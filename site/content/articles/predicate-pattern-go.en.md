---
date: '2025-07-29T12:09:00+03:00'
title: Predicate Pattern in Go
tech_name: predicate-pattern-go
language: en
tags:
- Go
extra:
  custom_props:
    public: true
    type: synopsis
    theme: other
    status: finished
---

If you think this code is idiomatic, elegant and beautiful, read this article!
```go
FindProcess(ByTitle(title))
FindProcess(ByPID(pid))
```
This code is an example of the result of the predicate pattern. This example is synthetic, but here we’re trying to achieve a similar result here. Firstly, let’s figure out the predicate. **Predicate** is a function, that returns a boolean value — very simple! 

Now, for example, we will write a method `findProcess` for `ProcManager` on Go with predicate pattern. The `ProcManager` has a field `processes []*Process`, which is slice of processes. And the `Process` has many unique fields, that we can use to searching. Our method will take a **predicate** and apply it to all items in the list until the predicate returns `true`, or the list ends and the search returns `hmm... nothing was found`.

For example, in Python we have a standard function `filter`, which takes an array of items and a predicate function, like this:
```python
filter([1, 2, 3, 4, 5], lambda n: n % 2 == 0)
```
But here we need to handle predicates manually, because this is a more general function. For our case we add intermediate step: a predicate builder. Finally we will get this scheme:
![|900](/images/predicate-pattern-schema.svg)
Let’s write a method `findProcess`:
```go
func (pm *ProcManager) findProcess(searchPredicate ProcessSearchPredicate) (*Process, error) {
	pm.mu.RLock()
	defer pm.mu.RUnlock()

	for _, proc := range pm.processes {
		if searchPredicate(proc) {
			return proc, nil
		}
	}
	return nil, fmt.Errorf("no process with this parameter")
}
```
This method takes one argument: `searchPredicate` with specific type `ProcessSearchPreciate`:
```go
type ProcessSearchPredicate func(p *Process) bool
```
Let’s see: it’s function from `Process` to `bool` — a predicate. Then we can write a predicate builder functions, like filter options:
```go
func ByTitle(title string) ProcessSearchPredicate {
	return func(p *Process) bool {
		return p.Title == title
	}
}

func ByPID(pid int) ProcessSearchPredicate {
	return func(p *Process) bool {
		return p.PID == pid
	}
}
```
It will work like this:
```go
proc, err := pm.findProcess(ByTitle(title))
```
This is already good, but I want to use autocomplete in my code editor for filter options. To make it we can rewrite filter options from *functions* to *methods* and use one empty object to call it, like this:
```go
type ProcessSearchFilter struct{}

var filter = ProcessSearchFilter{}

func (f ProcessSearchFilter) ByTitle(title string) ProcessSearchPredicate {
	return func(p *Process) bool {
		return p.Title == title
	}
}

func (f ProcessSearchFilter) ByPID(pid int) ProcessSearchPredicate {
	return func(p *Process) bool {
		return p.PID == pid
	}
}
```
After that we can use like this:
```go
proc, err := pm.findProcess(filter.ByTitle(title))
```
And my workflow in my code editor is very comfortable:
![](/images/predicate-pattern-demo.gif)

>If you like my code editor view you can use my Neovim theme: [nothing](https://github.com/alchemmist/nothing.nvim). And you can use my nvim config, find it in my [dotfiles](https://github.com/alchemmist/dotfiles)
