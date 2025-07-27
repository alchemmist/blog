---
date: '2025-07-06T05:19:00+03:00'
title: Стационарные точки и метод Лагранжа
tech_name: stationary-points-and-lagrange
language: ru
tags:
- math
extra:
  custom_props:
    type: synopsis
    theme: math
    public: true
    status: finished
---

При анализе функции мы ищем стационарные точки. Без ограничений используем градиент — вектор частных производных:
$$
\nabla f = \begin{pmatrix}
\displaystyle \frac{\partial f}{\partial x_1} \\
\displaystyle \frac{\partial f}{\partial x_2} \\
\dots \\
\displaystyle \frac{\partial f}{\partial x_n}
\end{pmatrix}
$$
Пример: $f(x, y, z) = x^2 + y^2 - 4x - 4y + z^4 - 4z^2$. Градиент:
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
Приравниваем к нулю: $\nabla f = 0$, получаем систему:
$$
\begin{cases}2x - 4 = 0 \\ 2y - 4 = 0 \\ 4z^3 - 8z = 0 \end{cases} \quad \Rightarrow \quad \begin{cases}x = 2\\ y = 2 \\ \left[
\begin{array}{l}
z = 0 \\
z = \sqrt{2} \\
z = -\sqrt{2}
\end{array}
\right.\end{cases}
$$
Стационарные точки: $(2, 2, 0), \ (2, 2, \sqrt{2}), \ (2, 2, -\sqrt{2})$. 

> Для дальнейшего анализа используйте [матрицу Гессе](/articles/hessian-matrix/).

Для задач с **ограничениями** применяем **метод множителей Лагранжа**. Пример: $f(x, y) = x^2 + y^2$ при условии $x + y = 1$. Перепишем ограничение как $g(x, y) = x + y - 1 = 0$. Градиенты:
$$
\nabla f = \begin{pmatrix}2x \\ 2y\end{pmatrix}, \quad \nabla g = \begin{pmatrix}1 \\ 1\end{pmatrix}
$$
Уравнения Лагранжа в общем виде:
$$
\begin{cases}
\displaystyle \frac{\partial f}{\partial x_1} = \lambda \frac{\partial g}{\partial x_1} \\
\displaystyle \frac{\partial f}{\partial x_2} = \lambda \frac{\partial g}{\partial x_2} \\
\quad \dots \\
\displaystyle \frac{\partial f}{\partial x_n} = \lambda \frac{\partial g}{\partial x_n} \\
g(x_1, x_2, \dots x_n) = 0
\end{cases}
$$
Для нашего случая:
$$
\begin{cases}2x = \lambda \cdot 1\\2y = \lambda \cdot 1\\x + y = 1\end{cases} \quad \Rightarrow \quad \begin{cases}\lambda = 2x\\\lambda = 2y\\x + y = 1\end{cases} \quad \Rightarrow \quad \begin{cases}x = y\\2x = 1\end{cases}\quad \Rightarrow \quad x = y = \frac{1}{2}
$$
Стационарная точка: $\left(\frac{1}{2}, \frac{1}{2} \right)$. Итог: без ограничений решаем $\nabla f = 0$, с ограничениями — метод Лагранжа.```