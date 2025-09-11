---
tech_name: welford-algorithm
title: Welford algorithm
date: '2025-09-10T17:31:00+03:00'
language: en
description: What is Welford algorithm, why he help us, how it works and C implementation.
  Welford for mean, variance, covariance and correlation.
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

Imagine that data is streaming to you: millions of transactions, stock prices, sensor readings. You need to calculate the mean, variance, and correlations. The classic way is to save all the data and then calculate it. But it takes up a lot of memory, calculations are getting heavy, rounding errors occur on large numbers. Recently, I came across to Welford algorithm, which can be online calculating in one iteration without save big data. It’s very elegant, stable and exact algorithm.

The problem settings is pretty simple: we want to calculate statistics (mean, variance, covariance, correlation) step by step, when we receive $n$ data in a stream, without saving all data and additional iteration. Let’s remind formulas on base way. Mean:
$$
\overline{x} = \frac{1}{n}\sum\limits_{i = 1}^{n}x_i
$$
Variance:
$$
s^2 = \frac{1}{n - 1}\sum\limits_{i = 1}^{n}(x_i - \overline{x})^2
$$
As you see for mean we need sum: first problem — how to get sum without all numbers? And for variance we need mean: second problem — how to know mean without all data?

## Intuition of method
Let’s try to feel the intuition of Welford method. Imagine we have the dataset: $A = \{1, 2, 3\}$, mean of this dataset is $\overline{x}_A = \frac{1 + 2 +3}{3} = 2$ and then we got one more number: $6$. Do you feel it will be move our mean to the bigger side? But how much bigger? Imagine similar dataset but with more data: $B = \{1, 1, 2, 2, 3, 3\}$ the mean also is $2$ and we also adding number $6$. Again we fill it will be move to the bigger side, but no so strong. Let’s check our intuition:
$$
\begin{align*}
&A' = \{1, 2, 3, 6\}, \quad \overline{x}_{A'} = \frac{1 + 2 + 3 + 6}{4} = 3, \quad \Delta_A = |\overline{x}_A - \overline{x}_{A'}| = 1 \\
&B' = \{1, 1, 2, 2, 3, 3, 6\},  \quad \overline{x}_{B'} = \frac{2(1 + 2 + 3) + 6}{7} \approx 2.57, \quad \Delta_{B} = \overline{x}_B - \overline{x}_{B'} \approx 0.57
\end{align*}
$$
Our intuition was right! It remains for us to figure out how we can calculate this delta, if we got only previous mean $\overline{x}_{i - 1}$, new number $x_i$ and count of our numbers. The Welford method told: every new value move mean in its own direction with weight $1/i$:
$$
\overline{x}_i = \overline{x}_{i - 1} + \frac{1}{i}(x_i - \overline{x}_{i - 1})
$$
Let’s check it for $B$ dataset. We got mean without new number $\overline{x}_{i - 1} = 2$ and new number $x_i = 6$ and it’s a seventh number, $i = 7$. Goal is find a $\overline{x}_i$ mean with Welfod forumula:
$$
\overline{x}_i = 2 + \frac{1}{7}(6 - 2) = 2 + 0.57\ldotp\!\ldotp\!\ldotp \ \approx 2.57
$$
It’s absolutely exact value, as you see. Nice!

## Variance, correlation, covariance
The real power of Welford's algorithm reveals itself when calculating variance. The naive approach requires storing all data points and recalculating the mean before computing variance, which is computationally expensive. Welford's method elegantly solves this by maintaining a running estimate of variance using the following recurrence relation:

For variance, we maintain the current mean $\overline{x}$ and the sum of squares of differences $S$. For each new data point $x_n$ at step $n$:
$$
\begin{gather*}
\overline{x}_n = \overline{x}_{n-1} + \frac{1}{n}(x_n - \overline{x}_{n-1}) \\
S_n = S_{n-1} + (x_n - \overline{x}_{n-1})(x_n - \overline{x}_n)
\end{gather*}
$$
The population variance can then be calculated as $\sigma^2 = S_n/n$, while the sample variance is $s^2 = S_n/(n-1)$.

This approach extends beautifully to covariance and correlation. For two variables $X$ and $Y$, we maintain counts $n$, means $\overline{x}$ and $\overline{y}$, and accumulated products $C_{xy}$:
$$
\begin{gather*}
\delta_x = x_n - \overline{x}_{n-1}, \quad
\delta_y = y_n - \overline{y}_{n-1} \\
\overline{x}_n = \overline{x}_{n-1} + \frac{\delta_x}{n}, \quad
\overline{y}_n = \overline{y}_{n-1} + \frac{\delta_y}{n} \\
C_{xy_n} = C_{xy_{n-1}} + \delta_x (y_n - \overline{y}_n) \\
\end{gather*}
$$
The covariance is then $\text{cov}(X,Y) = \frac{C_{xy_n}}{(n-1)}$ and correlation is $\text{corr}(X,Y) = \frac{C_{xy_n}}{\sqrt{S_{x_n} S_{y_n}}}$.

## C implementation
Here's a complete C implementation of Welford's algorithm for calculating mean and variance:
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
For covariance and correlation, we can extend this approach:
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