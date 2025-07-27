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
But here we need to handle write a predicate, because this is a more general function. For our process function we add intermediate step: predicate builder. Finally we will got this scheme:
