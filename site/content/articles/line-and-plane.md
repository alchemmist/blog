---
date: 2025-06-28
title: "Line and plane"
tech_name: "line-and-plane"
tags:
  - math
extra:
  custom_props:
    time: 17:18
    public: true
    type: synopsis
    theme: math
    status: finished
---
The Linear Algebra starts from basic geometry intuition, which continues to multivariate spaces. Now we will talk about line, plane and space. 

## The line in plane and space
How to define a line in plane? Of course, through two points. But it’s not all. Exists are three more methods:

1. **Parametric equation** 
Let line $l$ set by two points $r_0 = (x_0; y_0)$ and $r_1 = (x_1;y_1)$. Observe that vector $a = r_0 - r_1$ in same direction with $l$. Therefore, any point on $l$ may define as $r = r_0 + ta$, where $t \in \mathbb{R}$ and full line $l$ way be with $-\infty < t < \infty$. This expression we call *parametric equation*:
$$
l = \{r: r = r_o + at, \ t \in \mathbb{R} \}
$$
2. **Linear equation**
Let’s write the parametric equation using coordinates:
$$
\begin{bmatrix}x \\ y\end{bmatrix} = \begin{bmatrix}x_0\\y_0\end{bmatrix} + \begin{bmatrix}t \cdot a_1 \\ t \cdot a_2\end{bmatrix} \Rightarrow \begin{cases}x = x_0 + ta_1 \\ y = y_0 + ta_2\end{cases}
$$
Suppose that, $a_1 \neq 0$ and $a_2 \neq 0$ and solve $t$ from each equation: $\frac{x - x_0}{a_1} = \frac{y - y_0}{a_2} \Rightarrow a_2x - a_1y + (a_1y_0 - a_2x_0) = 0$. Since $a_1, a_2, x_0, x_1$ it’s a numbers, that mean we can define it as linear equation: 
$$
Ax + By + C = 0
$$
where $A = a_2$, $B = -a_1$, $C = (a_1y_0 - a_2x_0)$ 

3. **Normal and translation**
Last method. Let’s select random point on line $l$ with radius-vector $r_0$. Let’s draw a vector $n$ from point $r_0$, that is perpendicular line $l$. Then for any point $r$ on line $l$ vectors $r - r_0$ and $n$ will be perpendicular. Rewrite it with scalar product:
$$
l = \{ r: \langle r - r_0;n\rangle = 0\}
$$
Of course, $r_0$ it can by any point on line $l$ and normal vector $n$ any vector perpendicular to line $l$. To find normal to line, we need direction vector $a = \begin{pmatrix}a_1 \\ a_2\end{pmatrix}$ from *parametric equation* and then normal vector will be: $n = \begin{bmatrix}-a_2\\ a_1\end{bmatrix}$ or $n’ = -n = \begin{bmatrix} a_2 \\ -a_1\end{bmatrix}$

Let’s resume and see the relationship between this methods. If line passes through two points $r_0 = (x_0; y_0)$ and $r_1 = (x_1; y_1)$, then his can be define of of the three methods:
- parametric equation :
$$
r = r_0 + ta = \begin{bmatrix}x_0\\y_0\end{bmatrix} + t \cdot \begin{bmatrix}x_1 - x_0 \\ y_1 - y_0\end{bmatrix} = \begin{bmatrix}x_0\\y_0\end{bmatrix} + \begin{bmatrix}t \cdot a_1 \\ t \cdot a_2\end{bmatrix}
$$
- linear equation:
$$
Ax + By + C = 
\underbrace{a_2}_{A} x + 
\underbrace{(-a_1)}_{B} y + 
\underbrace{(a_1 y_0 - a_2 x_0)}_{C} = 0;
$$
- normal and translation:
$$
\langle r - r_0; n\rangle = \left\langle \begin{bmatrix}x - x_0\\y - y_0\end{bmatrix}; \begin{bmatrix}a_1 \\ -a_1\end{bmatrix}\right\rangle = \left\langle\begin{bmatrix}x - x_0 \\ y - y_0\end{bmatrix}; \begin{bmatrix}A \\ B\end{bmatrix} \right\rangle
$$
What about line in space? Parametric equation doesn’t change, one vectors will get longer. Linear equation will change: now it’s not one equation, it’s system of two equations:
$$
\begin{cases}
a_2x - a_1y + (a_1y_0 - a_2x_0) = 0 \\
a_3y - a_2z + (a_2z_0 - a_3y_0) = 0
\end{cases}
$$
Method with normal and translation **not working in space**!

Addition: let’s take to look at **distance from point to line:** 
$$
d(P, l) = \frac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}
$$
And we can detect where point relative to a line: group of points from one side, for which $Ax +By + C > 0$ is true; group from another side, for which $Ax +By + C < 0$ is true.
## The plane in space
Again this question. How to define a plane in space? Of course, through with three points non-collinear, that do not lie on the same straight line. Collinear points lie on the same line. And again let’s consider three methods:
1. **Parametric equation**:
$$
\pi = \{r: r = r_0 + t_1v_1 + t_2v_2, \quad t_1, t_2 \in \mathbb{R}\}
$$
2. **Normal and translation** is the same as for line: $\langle r - r_0; n\rangle = 0$
3. **Linear equation:** start from normal and translation and expand it:
$$
\langle r - r_0; n\rangle = 0 \quad \Rightarrow \quad 
\underbrace{n_1}_{A} x\  + \ 
\underbrace{n_2}_{B} y\  + \
\underbrace{n_3}_{C} z \ 
\underbrace{- \langle r_0 ;n\rangle}_{D} = 0. \ \Rightarrow \ Ax + By + Cz + D = 0
$$
Let’s look to relationship between this methods:
- For rewrite parametric equation to normal and translation we need to find normal vector from this system of equations: $\begin{cases}\langle n; v_1\rangle = 0 \\ \langle n; v_2\rangle = 0\end{cases}$
- For rewrite normal and translation form to linear equation we can use this: $A = n_1$, $B = n_2$, $C = n_3$, $D = -\langle n ;r_0\rangle$ 
- If we have three points, defined plane, we can go to parametric equation: $\begin{array}a v_1 = r_1 - r_0\\ v_2 = r_2 - r_0\end{array}$

Projection point $P$ on plan $\pi$ we call point $P_\pi \in \pi$, the closest to the point $P$: $P_\pi = \arg{\min{||P - X||}}, \ X \in \pi$. Then, the distance from point $P$ to plane $\pi$ will be $d(P, \pi)$ — the distance between point $P$ and her projection $P_\pi$:
$$
d(P, \pi) = \frac{|Ax_0 + By_0 + Cz_0 + D|}{\sqrt{A^2 + B^2 + C^2}}
$$
Detecting where point relative a plane is the same as line. 
