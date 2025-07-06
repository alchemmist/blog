---
date: 2025-07-06
title: "Stationary points and Lagrange method"
tech_name: "stationary-points-and-lagrange"
tags:
  - math
extra:
  custom_props:
    time: 05:19
    type: synopsis
    theme: math
    public: true
    status: finished
---
When we analyze a function, we want to find stationary points. If we haven’t a constraints, use gradient. Gradient it’s a vector of partial derivatives:

$$
\nabla f = \begin{pmatrix}
\displaystyle \frac{\partial f}{\partial x_1} \\
\displaystyle \frac{\partial f}{\partial x_2} \\
\dots \\
\displaystyle \frac{\partial f}{\partial x_n}
\end{pmatrix}
$$

See on example: $f(x, y, z) = x^2 + y^2 - 4x - 4y + z^4 - 4z^2$. Let’s find gradient:

$$
\nabla f = \begin{pmatrix}
\displaystyle \frac{\partial f}{\partial x} \\
\displaystyle \frac{\partial f}{\partial y} \\
\displaystyle \frac{\partial f}{\partial z}
\end{pmatrix} =  \begin{pmatrix}
2x - 4 \\
2y - 4 \\
4z^3 - 8z
\end{pmatrix}
$$

Then set equal to zero: $\nabla f = 0$, and got system of equations:

$$
\begin{cases}2x - 4 = 0 \\ 2y - 4 = 0 \\ 4z^3 - 8z = 0 \end{cases} \quad \Rightarrow \quad \begin{cases}x = 2\\ y = 2 \\ \left[
\begin{array}{l}
z = 0 \\
z = \sqrt{2} \\
z = -\sqrt{2}
\end{array}
\right.\end{cases}
$$

Finally, we got this stationary points: $(2, 2, 0), \ (2, 2, \sqrt{2}), \ (2, 2, -\sqrt{2})$. 

> If you want to continue analysis, use [Hessian matrix](/aritcles/hessian-matrix).

Now, look at case, when we have function and **constraints**. This is where the **Lagrange multiplier method** comes into play. For example, function is $f(x, y) = x^2 + y^2$ on condition $x + y = 1$. Rewrite a condition as: $g(x, y) = 0$, therefore $g(x, y) = x + y - 1$. Then, find gradients for all functions:
$$
\nabla f = \begin{pmatrix}2x \\ 2y\end{pmatrix}, \quad \nabla g = \begin{pmatrix}1 \\ 1\end{pmatrix}
$$
After that, write down the Lagrange equation and solve it. In general, Lagrange equation looks like:
$$
\begin{cases}
\displaystyle \frac{\partial f}{\partial x_1} = \lambda \frac{\partial g}{\partial x_1} \\
\displaystyle \frac{\partial f}{\partial x_2} = \lambda \frac{\partial g}{\partial x_2} \\
\quad \dots \\
\displaystyle \frac{\partial f}{\partial x_n} = \lambda \frac{\partial g}{\partial x_n} \\
g(x_1, x_2, \dots x_n) = 0
\end{cases}
$$
In our case:
$$
\begin{cases}2x = \lambda \cdot 1\\2y = \lambda \cdot 1\\x + y = 1\end{cases} \quad \Rightarrow \quad \begin{cases}\lambda = 2x\\\lambda = 2y\\x + y = 1\end{cases} \quad \Rightarrow \quad \begin{cases}x = y\\2x = 1\end{cases}\quad \Rightarrow \quad x = y = \frac{1}{2}
$$
Done! Stationary point is $\left(\frac{1}{2}, \frac{1}{2} \right)$. Let’s resume: if functions without constraints use equation $\nabla f = 0$, else use Lagrange multiplier method. 

