---
date: '2025-07-06T07:16:00+03:00'
title: Gram-Schmidt orthogonalization
tech_name: gram-schmidt
tags:
- math
extra:
  custom_props:
    type: synopsis
    public: true
    theme: math
    status: finished
---

In more practical cases we want to make projection of vector to subspace, and if subspace define with orthogonal and orthonormal basis we can do it easily. To orthogonalize a vectors, we using Gram-Schmidt method. 

We have source vectors $v_1, v_2, \dots, v_n$, and we need to get orthogonal vectors $u_1, u_2, \dots, u_n$. In general, describe the method:
0. Remove all zero vector.
1. We take first vector unchanged: $u_1 = v_1$.
2. Next vector find from $v_2$ and projections to last vectors: $u_2 = v_2 - \text{Proj}_{u_1}{v_2}$.
3. Again: $u_3 = v_3 - \text{Proj}_{u_1}{v_3} - \text{Proj}_{u_2}{v_3}$.
4. And continue it to $u_n$ vector: $u_n = v_n - \text{Proj}_{u_1}{v_n} - \text{Proj}_{u_2}{v_n} - \dots - \text{Proj}_{u_{n - 1}}{v_n}$.
Let's remind how to find projection: $\text{Proj}_{u}{v} = \frac{\langle u, v\rangle}{||u||^2}u$. If we want orthonormal basis we can product all vectors $u$ to $\frac{1}{||u_i||}$.

Let’s see on example: $v_1 = \begin{pmatrix}1 \\ 1\end{pmatrix}, \ v_2 = \begin{pmatrix}1 \\ 0\end{pmatrix}$. 
Firstly set $u_1 = v_1$, then $u_2 = v_2 - \text{Proj}_{u_1}{v_2} = \begin{pmatrix}1 \\ 0\end{pmatrix} - \begin{pmatrix}0.5 \\ 0.5\end{pmatrix} = \begin{pmatrix}0.5 \\ -0.5\end{pmatrix}$. Finally we got orthogonal vectors $u_1 = \begin{pmatrix}1 \\ 0\end{pmatrix}$, $u_2 = \begin{pmatrix}0.5 \\ -0.5\end{pmatrix}$.



