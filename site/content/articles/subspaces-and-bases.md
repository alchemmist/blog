---
date: 2025-07-03
title: "Subsapces and bases"
tech_name: "subspaces-and-bases"
tags:
  - math
extra:
  custom_props:
    time: 10:42
    public: true
    type: synopsis
    theme: math
    status: writing
---
Start with useful definition: Non-zero vectors $u, v \in \mathbb{R}$ call **collinear vectors**, if they are proportional to each other, that is exist $\lambda \in \mathbb{R}$, that $u = \lambda v$. Collinear vectors denoted as $u || v$. Zero-vector collinear with any vector. Geometrically, vectors collinear, if they have same or opposite direction. 

Let’s consider the plane $\pi$ in $\mathbb{R}^3$ space, which passes through zero-coordinate. Consider two non-collinear vectors $u$ an $v$ from this plane. Then, any point $x \in \pi$ we can be represented as: $x = \alpha u + \beta v$. 

![|400](/images/two-vectors-on-plane.png)
Okay, it’s mean we can define plane $\pi$  as:
$$
\pi = \{\text{all vectors }\  x \ \text { represented as }\ x = \alpha u + \beta v\}
$$
Let’s generalize the concept of a plane passing through the origin to a space of arbitrary dimension:
The linear **Span** of vectors $v_1, v_2, \dots, v_k \ \in \ \mathbb{R}^n$ is called set of vectors, represented in form of sum of vectors $v_1, v_2, \dots, v_k$ with arbitrary ratio:
$$
P = \text{span}{(v_1, v_2, \dots, v_k)} = \{ x: \ x = \alpha_1 v_1 + \alpha_2 v_2 + \dots + \alpha_k v_k, \ \alpha_i \in \mathbb{R} \}.
$$
Expression $\alpha_1 v_1 + \alpha_2 v_2 + \dots + \alpha_k v_k$ will call linear combination of vectors $v_1, v_2, \dots, v_k$. 

Let’s final this with pivotal definition: **linear subspace** $\mathbb{R}^n$ called span of finite numbers of vectors $v_1, v_2, \dots v_k \ \in \mathbb{R}^n$:
$$
V = \text{span}(v_1, v_2, \dots, v_k)
$$
The span concept and subspace concept equivalents. Why linear subspace is important? Here is an example:

> Let us take a black-and-white digital photograph of size 512 by 512 pixels. In computer memory, this photograph can be represented as $512 \times 512 = 262144$ numbers — each representing the intensity of the corresponding pixel, ranging from 0 (completely black) to 1 (completely white). Thus, the photograph can be represented as a vector $x$ in a space of dimension $d=262144$.
>
> Now, let us consider an important practical problem — compressing the photograph without significant loss. It turns out that this problem can be solved by finding a special low-dimensional subspace and projecting the vector $x$ onto this subspace.


