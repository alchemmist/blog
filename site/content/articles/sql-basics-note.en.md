---
tech_name: sql-basics-note
title: Note on SQL Basics
date: '2025-10-12T18:55:00+03:00'
language: en
description: Quick SQL notes covering data types and relational algebra. Learn how
  SQL stores, organizes, and manipulates data with simple examples.
tags:
- sql
extra:
  custom_props:
    public: true
    type: synopsis
    theme: sql
    status: finished
---

This is my simple note about basic data types in SQL and foundation of SQL — relation algebra. Let’s start from little cheat sheet of data types:

**Whole numbers:**
- `TINYINT` — from $-128$ to $127$.
- `SMALLINT` — from $-32 768$ to $32 767$.
- `INTAGER` — from $−2 147 483 648$ to $−2 147 483 647$.
- `BIGINT` — very big!

**Float numbers:**
- `FLOAT` — single precision, approximately 7-8 significant digits.
- `DOUBLE` — double precision, approximately 15-16 significant digits.
- `NUMERIC` / `DECIMAL` — fixed precision, use as `NUMERIC(precision, scale)`, where `precision` – total digits count, `scale` – count digits after dot.

**Strings:**
- `CHAR(n)` — string of fixed length. `n` defined maximum string length, if string less than `n` it sill be fill with spaces.
- `VARCHAR(n)` — string of variable length. `n` defined maximum string length. It’s more optimized and effective, because keep only real string length.
- `TEXT` — string of variable length, without limits (it depends on DBMS).
- `ENUM` — enumerate. Keep only one from defined list values, for example `ENUM('male', 'female', 'other')`.

**Date and time:**
- `DATE` — store only date (year, month, day).
- `TIME` — store only time (hours, minutes, seconds).
- `DATETIME` — store time and date.
- `TIMESTAMP` — store date and time, considering time zone. 

**Logical data:**
- `BOOLEAN` — store logical value: `TRUE` or `FALSE`. Some time can be represented as `TINYINT` with $1 = \texttt{TRUE}$ and $2 = \texttt{FALSE}$.

**Binary data:**
- `BLOB` (*Binary Large Object*) — store big binary data, like images, videos, audios and so on.
- `BINARY(n)` — binary string with fixed length `n`.
- `VARBINARY(n)` — binary string with variable length, but max length is `n`.

**Other:**
- `JSON` — store the json data.
- `XML` — store xml data.

## Relation algebra
Relational algebra serves is the theoretical basis for SQL. This means that any query that can be expressed in SQL can also be expressed in relational algebra, and vice versa. Understanding relational algebra helps you understand how SQL queries are processed and optimized.

Key concepts:
-  **Relation** — in relation algebra it’s the similar as table in database: columns and rows.
- **Attribute** — column in relation.
- **Tuple** — row in relation.
- **Relation Schema** — description structure of relation, which include attributes names and data types.

Let’s see on operators of relation algebra. You can try all of this examples in [RealX](https://dbis-uibk.github.io/relax/calc/local/uibk/local/0).

**π (pi)** — Operation, that create new relation, selecting specified attributes from source relation. It’s similar as `SELECT` in SQL. For example we can get the list of all books titles and authors:
```sql
π author, title (books)
```
As result:
```plaintext
+-----------------+-----------------------------+
| author          | title                       |
|-----------------+-----------------------------|
| Salinger        | The catcher in the Rye      |
| Robert Martin   | Clean code                  |
| Platon          | The State                   |
+-----------------+-----------------------------+
```

**`σ` (sigma)** — Operation, that create new relation contains only tuples, which satisfy specified condition. It’s similar as `WHERE` in SQL. This example give me the books only from Salinger:
```sql
σ author = "Salinger" (books)
```

**`∪` (union)** — Operation, that create new relation contains all tuples, which exists at least one of two source relations. Its similar as `UNION` in SQL. I can union books from Salinger and books published at 2024-01-05:
```sql
(σ author = 'Selinger' (books)) ∪ (σ publish_at = '2024-01-05' (books))
```

**`−` (subtraction)** — Operation, that create new relation, includes tuples, which contains into first relation but missing in second. Next example show ids of books, that no from Salinger.
```sql
π id (books) – π id (σ author = 'Salinger' (books))
```

**`×` (cross join)** — Operation, that create new relation contains all combinations of tuples from two source relations. It’s similar as `CROSS JOIN` in SQL. For example:
```sql
(σ id = 1 (books)) × (σ book_id = 1 (reviews))
```

**`⋈` (natural join)** — Operation, that create new relation, contains tuples from two source relations, that have same values in attributes with same name. Duplicated attributes remove from result relation. It’s similar as `NATURAL JOIN` in SQL. For example:
```sql
books ⋈ reviews
```
**`⋈ θ` (theta join)** — Operation, that create new relation, contains tuples from two source relations and satisfy specified condition `θ`. Condition can include operators: `=`, `≠`, `>`, `<`, `≥`, `≤`.  For example:
```sql
(books) ⋈ books.id = reviews.book_id (reviews)
```

**`⋈ =` (equjoin)** — A special case of theta join, where condition is equal values of attributes. The previous example show this.

**`÷` (division)** — Binary operation, that create new relation, contains tuples from first source relation, that connected with all tuples from second source relation. This is a powerful operator for solving tasks like: “Find all X, that connected with Y.” For example:
```sql
π title, author (σ status = 'available' (library)) ÷ 
π title (σ author = 'Selinjer' (books))
```
Here is two terms, first is `π title, author (σ status = 'available' (library))` and it’s return the available books with `title` and `author` attributes:
```plaintext
+-----------------+-----------------------------+
| author          | title                       |
|-----------------+-----------------------------|
| Salinger        | The catcher in the Rye      |
| Robert Martin   | Clean Code                  |
| Platon          | The State                   |
| Selinjer        | Advanced Algebra            |
| Selinjer        | Linear Algebra              |
+-----------------+-----------------------------+
```
Second term `π title (σ publish_at = '2024-01-05' (books))` is return the list of `Selinjer` books:
```plaintext
+------------------+
| author           |
|------------------|
| Selinjer         |
| Stive Machonnel  |
+------------------+
```
Division of this two relations will return the list of titles where authors equals and drop author attribute:
```plaintext
+-----------------------------+
| title                       |
|-----------------------------|
| Advanced Algebra            |
| Linear Algebra              |
+-----------------------------+
```
This is the available books in library from author published it at `'2024-01-05'`. 

**`γ` (aggregation)** — Operation, that groups tuples by specified attributes and execute aggregate function (*sum, max, min, count, average*). It’s similar as `GROUP BY` in SQL. For example:
```sql
γ title; COUNT(author) -> count (books)
```