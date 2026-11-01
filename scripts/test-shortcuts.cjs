const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('site/assets/main.js', 'utf8');
const helpers = source.slice(0, source.indexOf('// Высота'));
const context = vm.createContext({});
vm.runInContext(helpers, context);
for (const key of ['a', 'A', 'ф', 'Ф']) {
  assert.equal(context.shortcutKey({code: 'KeyA', key}), 'a');
}
for (const key of ['j', 'k', 'h', 'p', 'c', 'e', 'u', 't', 'b']) {
  assert.equal(context.shortcutKey({code: `Key${key.toUpperCase()}`, key: 'я'}), key);
}
assert.equal(context.shortcutKey({code: 'Slash', key: '?'}), '?');
assert.equal(context.isEditing({target: {isContentEditable: true}}), true);
assert.equal(context.isEditing({target: {closest: () => ({})}}), true);
assert.equal(context.isEditing({target: {}}), false);
console.log('Keyboard shortcut tests passed');
// Exercise the actual navigation listener, not only normalization.
const listeners = [];
const browser = vm.createContext({
  document: {
    readyState: 'loading',
    addEventListener: (type, fn) => { if (type === 'keydown') listeners.push(fn); },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({}),
    head: {appendChild() {}},
    body: {classList: {contains: () => false}},
  },
  localStorage: {getItem: () => null},
  window: {addEventListener() {}, location: {origin: 'https://example.com'}, scrollTo() {}},
  MutationObserver: class {},
});
vm.runInContext(source, browser);
for (const key of ['a', 'A', 'ф', 'Ф']) {
  browser.window.location.href = '';
  for (const fn of listeners) fn({key, code: 'KeyA', target: {tagName: 'BODY'}, preventDefault() {}});
  assert.equal(browser.window.location.href, '/articles/');
}
for (const extra of [{ctrlKey: true}, {metaKey: true}, {altKey: true}, {isComposing: true}, {target: {isContentEditable: true, tagName: 'DIV'}}]) {
  browser.window.location.href = '';
  for (const fn of listeners) fn({key: 'ф', code: 'KeyA', target: {tagName: 'BODY'}, preventDefault() {}, ...extra});
  assert.equal(browser.window.location.href, '');
}
console.log('Navigation handler regression tests passed');

// Denied storage must not abort registration of navigation handlers.
vm.runInContext('localStorage.getItem = () => { throw new Error("SecurityError"); }', browser);
assert.doesNotThrow(() => vm.runInContext(source, vm.createContext({
  ...browser,
  localStorage: {getItem() {throw new Error('SecurityError');}},
})));
console.log('Storage-denied initialization regression passed');

// Every section shortcut must use the canonical directory URL, avoiding a
// server redirect (which used to leak the reverse proxy's HTTP/8080 origin).
const destinations = {h: '/', a: '/articles/', p: '/ru/poetry/',
  b: '/books/', c: '/cv/', e: '/essays/', u: '/updates/', t: '/teach/'};
for (const [key, destination] of Object.entries(destinations)) {
  browser.window.location.href = '';
  for (const fn of listeners) fn({key, code: `Key${key.toUpperCase()}`,
    target: {tagName: 'BODY'}, preventDefault() {}});
  assert.equal(browser.window.location.href, destination);
  const url = new URL(browser.window.location.href, browser.window.location.origin);
  assert.equal(url.origin, browser.window.location.origin);
}
console.log('Canonical section URL regression tests passed');
