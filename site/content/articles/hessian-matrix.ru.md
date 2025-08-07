---
date: '2025-07-05T12:48:00+03:00'
title: Матрица Гессе
tech_name: hessian-matrix
language: ru
tags:
- math
extra:
  custom_props:
    type: synopsis
    theme: math
    status: finished
    public: true
---

Предположим, у нас есть функция и несколько её стационарных точек, которые нужно классифицировать (максимум, минимум, седловая точка). Для функции без ограничений используем матрицу Гессе.

> Как найти стационарные точки, читайте в статье: «[Стационарные точки и метод Лагранжа](/articles/stationary-points-and-lagrange)»

Разберём на примере. Функция и стационарные точки:
$$
f(x, y) = x^3 + y^3 - 3xy; \quad A = (0; 0), \ B = (1; 1)
$$
Сначала построим матрицу Гессе. В общем виде она выглядит так:
$$
H_f(x) =
\begin{bmatrix}
\displaystyle \frac{\partial^2 f}{\partial x_1^2} & \displaystyle \frac{\partial^2 f}{\partial x_1 \partial x_2} & \cdots & \displaystyle \frac{\partial^2 f}{\partial x_1 \partial x_n} \\
\displaystyle \frac{\partial^2 f}{\partial x_2 \partial x_1} & \displaystyle \frac{\partial^2 f}{\partial x_2^2} & \cdots & \displaystyle \frac{\partial^2 f}{\partial x_2 \partial x_n} \\
\vdots & \vdots & \ddots & \vdots \\
\displaystyle \frac{\partial^2 f}{\partial x_n \partial x_1} & \displaystyle \frac{\partial^2 f}{\partial x_n \partial x_2} & \cdots & \displaystyle \frac{\partial^2 f}{\partial x_n^2}
\end{bmatrix}
$$
Для нашей функции: $H = \begin{bmatrix}6x & -3 \\-3 & 6y\end{bmatrix}$. Подставим точки в матрицу и найдём собственные значения:
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
Применяем правила:
- Если все собственные значения положительны — локальный минимум
- Если все отрицательны — локальный максимум
- Если знаки разные — седловая точка

Результат: точка $A$ — седловая, точка $B$ — локальный минимум.```