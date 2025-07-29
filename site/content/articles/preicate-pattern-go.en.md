---
date: 2025-07-29
title: "Predicate Pattern in Go"
tech_name: "preicate-pattern-go"
language: en
tags:
  - Go
extra:
  custom_props:
    time: 12:09
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

This code it’s example of result of predicate pattern. This is synthetic, but here we try to achieve a similar result. Firstly, let’s figure out the predicate. **Predicate** it is a function, that returns a bool — very simple! 

Now, for example, we will write a method `findProcess` for `ProcManager` on Go with predicate pattern. The `ProcManager` have field `processes []*Process`  this is slice of processes. And `Process` have many unique field, that we can use to search. Our method will be get **predicate** and use this predicate to all items in list, while predicate doesn’t return `true` or list is end and search return `hmm... nothig was found`. 

For example in Python we have standard function `filter`, which got array of items and predicate function, like this:
```python
filter([1, 2, 3, 4, 5], lambda n: n % 2 == 0)
```
But here we need to handle write a predicate, because this is a more general function. For our case we add intermediate step: predicate builder. Finally we will got this scheme:
![|800](/images/predicate-pattern-schema.svg)
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
This method got one argument: `searchPredicate` with specific type `ProcessSearchPreciate`:
```go
type ProcessSearchPredicate func(p *Process) bool
```
Let’s see: it’s function from `Process` to `bool` – predicate. Then we can write a predicate builder functions, like filter options:
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
It’s will work like this:
```go
proc, err := pm.findProcess(ByTitle(title))
```
This already good, but I want to use autocomplete in my code editor for filter options. For make it we can rewrite filter options from *functions* to *methods* and use one empty object for call it, like this:
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
And my workflow in code editor very comfortable:
![](/images/predicate-pattern-demo.gif)

>If you like my code editor view you can use my Neovim theme: [nothing](https://github.com/alchemmist/nothing.nvim). And you can use my nvim config, find it in my [dotfiles](https://github.com/alchemmist/dotfiles)

