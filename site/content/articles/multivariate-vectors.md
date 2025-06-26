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
1. Sum of vectors is a sum of corresponding coordinates:
$$
v + w = \begin{pmatrix}v_1 \\ v_2 \\ \ldots \\ v_n \end{pmatrix} + \begin{pmatrix}w_1 \\ w_2 \\ \ldots \\ w_n \end{pmatrix} = \begin{pmatrix}v_1 + w_1 \\ v_2 + w_2 \\ \ldots \\ v_n + w_n \end{pmatrix}
$$

We can add vectors only they have same dimension.
1. Product of vector by scalar is a product off each coordinates by a scalar:
$$
\lambda v = \lambda \cdot \begin{pmatrix}v_1 \\ v_2 \\ \ldots \\ v_n \end{pmatrix} = \begin{pmatrix}\lambda v_1 \\ \lambda v_2 \\ \ldots \\ \lambda v_n \end{pmatrix}
$$
2. Difference of vectors is a sum of vectors, but one of vector product by scalar $-1$.
3. Scalar product of vectors:
$$
x \cdot y = \langle x;y\rangle = x_1 y_1 + x_2 y_2 + \ldots + x_n y_n = \sum \limits_{i = 1}^{n}x_i y_i
$$
Properties of scalar vectors product:
- Commutativity: $\langle v; w\rangle = \langle w; v\rangle$
- Distributivity over addition: $\langle x; (v + w)\rangle = \langle x; v\rangle + \langle x; w \rangle$
- Compatibility with scalar multiplication: $\langle v; \lambda w\rangle = \lambda \langle v;w\rangle$
## Geometric meaning 
In geometry vector is a segment having a direction.
![|400](/images/the-vector.png)

 The length of vector we calculate with Pythagoras’s theorem: $|v| = \sqrt{\sum\limits_{i = 1}^{n}{x_i}}$. If length of vector equal one we call it a **unit vector**. If $v$ not a unit vector we can change it multiplying by $\lambda = \frac{1}{|v|}$. We can calculate distance and angle between two vectors. 

![|600](/images/distance-between-vectors.png)
Distance is a length of difference two vectors: $|d| = |v - w| = \sqrt{\sum\limits_{i = 1}^{n}{(v_i - w_i)^2}}$. Angle between two vectors follows from Law of Cosines: 
$$
\cos{\theta} = \frac{\sum\limits_{i = 1}^{n}{u_i v_i}}{|u||v|}
$$
Often be helpful: $|u| = \sqrt{\langle u;u\rangle}$
