---
date: 2025-06-26
title: "Base of multivariate vectors"
tech_name: "multivariate-vectors"
tags:
  - math
extra:
  custom_props:
    time: 14:18
    public: true
    type: synopsis
    theme: math
    status: writing
---
What is a vector? For natural number $n$ will call a n-variate **vector** list of n ordered real numbers $v = \begin{pmatrix}v_1&v_2&v_3&\ldots&v_n\end{pmatrix}$. Well the $n$ number is a vector dimension: $\dim{v} = n$. For $n$ number the set of all possible vectors will call $R^n$. 
The regular number we call “scalar”. For example, $5 \ - \ scalar$, but $\begin{pmatrix}1&3\end{pmatrix} \ - \ vector$.

## The basic operations of vectors
1. Sum of vectors is a sum of corresponding coordinates :
$$
v + w = \begin{pmatrix}v_1 \\ v_2 \\ \ldots \\ v_n \end{pmatrix} + \begin{pmatrix}w_1 \\ w_2 \\ \ldots \\ w_n \end{pmatrix} = \begin{pmatrix}v_1 + w_1 \\ v_2 + w_2 \\ \ldots \\ v_n + w_n \end{pmatrix}
$$

2. Product of vector by scalar is a product off each coordinates by a scalar:
$$
\lambda v = \lambda \cdot \begin{pmatrix}v_1 \\ v_2 \\ \ldots \\ v_n \end{pmatrix} = \begin{pmatrix}\lambda v_1 \\ \lambda v_2 \\ \ldots \\ \lambda v_n \end{pmatrix}
$$
3. Difference of vectors is a sum of vectors, but one of vector product by scalar $-1$.
4. 