---
date: 2025-07-05
title: "Hessian matrix"
tech_name: "hessian-matrix"
tags:
  - math
extra:
  custom_props:
    time: 12:48
    type: synopsis
    theme: math
    status: finished
    public: true
---
Imagine we got function and a few stationary points of this function, and we need to classify them, like: max, min or saddle point. If function without constraints, we can use Hessian matrix. 

> How to find stationary points of the function you can read at this article: “[Stationary points and Lagrange method](/articles/stationary-points-and-lagrange)”

Let’s learn it on example. Function and stationary points:
$$
f(x, y) = x^3 + y^3 - 3xy; \quad A = (0; 0), \ B = (1; 1)
$$
Firstly, build Hessian matrix. In general form Hessian matrix looks like:
$$
H_f(x) =
\begin{bmatrix}
\displaystyle \frac{\partial^2 f}{\partial x_1^2} & \displaystyle \frac{\partial^2 f}{\partial x_1 \partial x_2} & \cdots & \displaystyle \frac{\partial^2 f}{\partial x_1 \partial x_n} \\
\displaystyle \frac{\partial^2 f}{\partial x_2 \partial x_1} & \displaystyle \frac{\partial^2 f}{\partial x_2^2} & \cdots & \displaystyle \frac{\partial^2 f}{\partial x_2 \partial x_n} \\
\vdots & \vdots & \ddots & \vdots \\
\displaystyle \frac{\partial^2 f}{\partial x_n \partial x_1} & \displaystyle \frac{\partial^2 f}{\partial x_n \partial x_2} & \cdots & \displaystyle \frac{\partial^2 f}{\partial x_n^2}
\end{bmatrix}
$$
For our function it is: $H = \begin{bmatrix}6x & -3 \\-3 & 6y\end{bmatrix}$. Then substitute points in this matrix and find eigenvalues:
$$
\begin{align}
&H_A = \begin{bmatrix}0 & -3 \\ -3 & 0\end{bmatrix} 
&&H_B = \begin{bmatrix}6 & -3 \\ -3 & 6\end{bmatrix} 
\\[1em]
&\det(H_A - \lambda I) = 
\det \begin{bmatrix}
0 - \lambda & -3 \\
-3 & 0 - \lambda
\end{bmatrix} =
&&\det(H_B - \lambda I) = \det \begin{bmatrix}
6 - \lambda & -3 \\
-3 & 6 - \lambda
\end{bmatrix} =
\\
&= (-\lambda)(-\lambda) - (-3)(-3) = \lambda^2 - 9 = 0 \ \Rightarrow \quad \quad \quad \quad
&&= (6-\lambda)^2 - 9 = 0 \ \Rightarrow
\\[1em]
&\Rightarrow \ \lambda^2 = 9 \ \Rightarrow \  \lambda = \pm 3 \ \Rightarrow
&&\Rightarrow \ (6-\lambda)^2 = 9 \ \Rightarrow \ 6 - \lambda = \pm 3 \ \Rightarrow
\\[1em]
&\Rightarrow \lambda_1 = 3, \quad \lambda_2 = -3
&&\Rightarrow \lambda_1 = 6 - 3 = 3, \quad \lambda_2 = 6 + 3 = 9
\end{align}
$$
Then use this rules:
- If Hessian eigenvalues is positives, point is local minimum
- If Hessian eigenvalues is negative, point is local maximum
- If Hessian eigenvalues not defined, point is saddle 

As result, point $A$ it is saddle point and point $B$ it is local minimum. 
