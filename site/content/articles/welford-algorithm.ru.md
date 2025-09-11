---
tech_name: welford-algorithm
title: Алгоритм Уэлфорда
date: '2025-09-10T17:31:00+03:00'
language: ru
description: Что такое алгоритм Уэлфорда, как он помогает, как работает и реализация
  на C. Уэлфорд для среднего, дисперсии, ковариации и корреляции.
tags:
- algorithms
- C
- math
extra:
  custom_props:
    public: true
    type: synopsis
    theme: other
    status: draft
---

Представьте, что к вам потоком поступают данные: миллионы транзакций, цены акций, показания датчиков. Вам нужно вычислить среднее значение, дисперсию и корреляции. Классический способ — сохранить все данные и затем вычислить. Но это занимает много памяти, вычисления становятся тяжелыми, на больших числах возникают ошибки округления. Недавно я столкнулся с алгоритмом Уэлфорда, который позволяет проводить онлайн-вычисления за одну итерацию без сохранения больших данных. Это очень элегантный, стабильный и точный алгоритм.

Постановка задачи довольно проста: мы хотим вычислять статистики (среднее, дисперсию, ковариацию, корреляцию) шаг за шагом, когда мы получаем $n$ данных в потоке, без сохранения всех данных и дополнительных итераций. Напомним формулы базовым способом. Среднее:
$$
\overline{x} = \frac{1}{n}\sum\limits_{i = 1}^{n}x_i
$$
Дисперсия:
$$
s^2 = \frac{1}{n - 1}\sum\limits_{i = 1}^{n}(x_i - \overline{x})^2
$$
Как видите, для среднего нужна сумма: первая проблема — как получить сумму без всех чисел? А для дисперсии нужно среднее: вторая проблема — как узнать среднее без всех данных?

## Интуиция метода
Попробуем прочувствовать интуицию метода Уэлфорда. Представьте, у нас есть набор данных: $A = \{1, 2, 3\}$, среднее этого набора $\overline{x}_A = \frac{1 + 2 +3}{3} = 2$, и затем мы получили еще одно число: $6$. Чувствуете, что оно сдвинет наше среднее в сторону больших значений? Но насколько? Представьте похожий набор, но с большим количеством данных: $B = \{1, 1, 2, 2, 3, 3\}$, среднее также равно $2$, и мы также добавляем число $6$. Снова чувствуем, что сдвиг будет в сторону больших значений, но не такой сильный. Проверим нашу интуицию:
$$
\begin{align*}
&A' = \{1, 2, 3, 6\}, \quad \overline{x}_{A'} = \frac{1 + 2 + 3 + 6}{4} = 3, \quad \Delta_A = |\overline{x}_A - \overline{x}_{A'}| = 1 \\
&B' = \{1, 1, 2, 2, 3, 3, 6\},  \quad \overline{x}_{B'} = \frac{2(1 + 2 + 3) + 6}{7} \approx 2.57, \quad \Delta_{B} = \overline{x}_B - \overline{x}_{B'} \approx 0.57
\end{align*}
$$
Наша интуиция была права! Осталось понять, как мы можем вычислить эту дельту, если у нас есть только предыдущее среднее $\overline{x}_{i - 1}$, новое число $x_i$ и количество наших чисел. Метод Уэлфорда гласит: каждое новое значение сдвигает среднее в свою сторону с весом $1/i$:
$$
\overline{x}_i = \overline{x}_{i - 1} + \frac{1}{i}(x_i - \overline{x}_{i - 1})
$$
Проверим это для набора $B$. У нас есть среднее без нового числа $\overline{x}_{i - 1} = 2$ и новое число $x_i = 6$, и это седьмое число, $i = 7$. Цель — найти среднее $\overline{x}_i$ по формуле Уэлфорда:
$$
\overline{x}_i = 2 + \frac{1}{7}(6 - 2) = 2 + 0.57\ldotp\!\ldotp\!\ldotp \ \approx 2.57
$$
Как видите, это абсолютно точное значение. Отлично!

## Дисперсия, корреляция, ковариация
Истинная сила алгоритма Уэлфорда раскрывается при вычислении дисперсии. Наивный подход требует хранения всех точек данных и пересчета среднего перед вычислением дисперсии, что вычислительно дорого. Метод Уэлфорда изящно решает это, поддерживая текущую оценку дисперсии с использованием следующего рекуррентного соотношения:

Для дисперсии мы поддерживаем текущее среднее $\overline{x}$ и сумму квадратов разностей $S$. Для каждой новой точки данных $x_n$ на шаге $n$:
$$
\begin{gather*}
\overline{x}_n = \overline{x}_{n-1} + \frac{1}{n}(x_n - \overline{x}_{n-1}) \\
S_n = S_{n-1} + (x_n - \overline{x}_{n-1})(x_n - \overline{x}_n)
\end{gather*}
$$
Дисперсию генеральной совокупности можно затем вычислить как $\sigma^2 = S_n/n$, а выборочную дисперсию как $s^2 = S_n/(n-1)$.

Этот подход красиво расширяется на ковариацию и корреляцию. Для двух переменных $X$ и $Y$ мы поддерживаем счетчики $n$, средние $\overline{x}$ и $\overline{y}$, и накопленные произведения $C_{xy}$:
$$
\begin{gather*}
\delta_x = x_n - \overline{x}_{n-1}, \quad
\delta_y = y_n - \overline{y}_{n-1} \\
\overline{x}_n = \overline{x}_{n-1} + \frac{\delta_x}{n}, \quad
\overline{y}_n = \overline{y}_{n-1} + \frac{\delta_y}{n} \\
C_{xy_n} = C_{xy_{n-1}} + \delta_x (y_n - \overline{y}_n) \\
\end{gather*}
$$
Ковариация тогда равна $\text{cov}(X,Y) = \frac{C_{xy_n}}{(n-1)}$, а корреляция $\text{corr}(X,Y) = \frac{C_{xy_n}}{\sqrt{S_{x_n} S_{y_n}}}$.

## Реализация на C
Вот полная реализация алгоритма Уэлфорда на C для вычисления среднего и дисперсии:
```c
#include <stdio.h>
#include <math.h>

typedef struct {
    long long n;
    double mean;
    double M2;
} welford_state;

void welford_update(welford_state *state, double x) {
    state->n++;
    double delta = x - state->mean;
    state->mean += delta / state->n;
    state->M2 += delta * (x - state->mean);
}

double welford_mean(const welford_state *state) {
    return state->mean;
}

double welford_variance(const welford_state *state) {
    return (state->n > 1) ? state->M2 / (state->n - 1) : 0.0;
}

double welford_stddev(const welford_state *state) {
    return sqrt(welford_variance(state));
}

int main() {
    welford_state state = {0, 0.0, 0.0};
    double test_data[] = {1.0, 2.0, 3.0, 6.0};
    size_t data_size = sizeof(test_data) / sizeof(test_data[0]);
    
    for (size_t i = 0; i < data_size; i++) {
        welford_update(&state, test_data[i]);
        printf("Added %.1f: mean=%.3f, variance=%.3f, stddev=%.3f\n",
               test_data[i], welford_mean(&state), 
               welford_variance(&state), welford_stddev(&state));
    }
    
    return 0;
}
```
Для ковариации и корреляции мы можем расширить этот подход:
```c
typedef struct {
    long long n;
    double mean_x, mean_y;
    double C2;
} welford_cov_state;

void welford_cov_update(welford_cov_state *state, double x, double y) {
    state->n++;
    double delta_x = x - state->mean_x;
    double delta_y = y - state->mean_y;
    state->mean_x += delta_x / state->n;
    state->mean_y += delta_y / state->n;
    state->C2 += delta_x * (y - state->mean_y);
}

double welford_covariance(const welford_cov_state *state) {
    return (state->n > 1) ? state->C2 / (state->n - 1) : 0.0;
}
```