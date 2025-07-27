---
date: '2025-07-11T09:58:00+03:00'
title: Деградация батареи в Linux
tech_name: battery-degradation
language: ru
tags:
- linux
extra:
  custom_props:
    public: true
    type: synopsis
    theme: linux
    status: finished
---

Мы все знаем, что батарея не вечна. Это нормально — можно заменить изношенную батарею в сервисе и снова использовать устройство. Но очень полезно видеть текущее состояние батареи. В MacOS это стандартная функция, в Linux мы, конечно, можем сделать то же самое. Давайте разберёмся!

Сначала мы поймём, как найти нужное значение, а затем создадим красивый минималистичный модуль для waybar.

## Находим значение деградации батареи

Сначала получим список всех устройств питания:
```sh
upower -e
```

Затем найдём батарею в этом списке:
```sh
upower -e | grep BAT

# For example:
# /org/freedesktop/UPower/devices/battery_BATT
```

Затем получим детальную информацию об этом устройстве:
```sh
upower -i $(upower -e | grep BAT)
```

Мы получим что-то вроде этого:
```txt
  native-path:          BATT
  vendor:               DESAY
  model:                BASE-BAT
  serial:               1
  power supply:         yes
  updated:              Fri Jul 11 11:37:00 2025 (7 seconds ago)
  has history:          yes
  has statistics:       yes
  battery
    present:             yes
    rechargeable:        yes
    state:               charging
    warning-level:       none
    energy:              25.514 Wh
    energy-empty:        0 Wh
    energy-full:         47.5052 Wh
    energy-full-design:  59.4247 Wh
    energy-rate:         11.1573 W
    voltage:             11.972 V
    charge-cycles:       650
    time to full:        2.0 hours
    percentage:          53%
    capacity:            79.9417%
    technology:          lithium-ion
    charge-start-threshold:        75%
    charge-end-threshold:          80%
    charge-threshold-supported:    yes
    icon-name:          'battery-good-charging-symbolic'
  History (charge):
    1752222927	53.000	charging
  History (rate):
    1752223020	11.157	charging
    1752222990	11.123	charging
    1752222987	11.192	charging
    1752222957	10.822	charging
    1752222927	10.857	charging
```

Здесь много интересной информации, например количество циклов зарядки, время до полной зарядки и т.д. Сейчас нас интересуют два параметра:
- `energy-full-design` — изначальный полный объём батареи
- `energy-full` — текущий объём батареи

Разница между этими параметрами и есть деградация батареи:
$$
\text{Degradation} = \left(1 - \frac{E_{\text{full}}}{E_{\text{design}}}\right) \times 100\%
$$
Теперь посчитаем этот показатель в процентах. 

Сначала найдём эти параметры и разделим их:
```sh
upower -i $(upower -e | grep BAT) | awk '\
	/energy-full:/ {ef=$2}\
	/energy-full-design:/ {efd=$2}\
	END {print ef/efd}'
```

Затем посчитаем процентное значение:
```sh
echo "(1 - $(upower -i $(upower -e | grep BAT) | awk '\
        /energy-full:/ {ef=$2}\
        /energy-full-design:/ {efd=$2}\
        END {print ef/efd}')) * 100 + 0.5" \
	| bc

# Output example:
# 20.558200
```

На последнем шаге нам нужно округлить значение:
```sh
echo "(1 - $(upower -i $(upower -e | grep BAT) | awk '\
        /energy-full:/ {ef=$2}\
        /energy-full-design:/ {efd=$2}\
        END {print ef/efd}')) * 100 + 0.5" \
	| bc \
	| cut -d'.' -f1

# Output example:
# 20
```

## Модуль для Waybar
В моём конфиге waybar <code><span class="tilde">~</span>/.config/waybar/config.json</code> я добавил два модуля в правую секцию, но вы можете сделать как вам удобно. В итоге я получил это:
![](/images/battery-waybar-module.png)
> Если вам нравятся мои обои, вы можете найти их и другие классные штуки в моём репозитории `dotfiles` на [GitHub](https://github.com/alchemmist/dotfiles/tree/main/wallpapers). Не забывайте: я люблю ваши звёзды!

Посмотрим:
```json
{
  ...
  "modules-left": [...],
  "modules-center": [...],
  "modules-right": [
    "battery",
    "custom/battery-degradation",
	...
  ],
  ...
```

Первый модуль — стандартный `battery`, у меня он отлично работает на hyprland. Здесь мы определяем уровни хорошего, предупреждающего и критического уровня заряда, задаём nerd-иконки для разных состояний батареи:
```json
"battery": {
  "states": {
    "good": 90,
    "warning": 25,
    "critical": 10
  },
  "format": "{icon} {capacity}%",
  "format-charging": " {capacity}%",
  "format-plugged": " {capacity}%",
  "format-icons": ["󰂎", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"],
  "tooltip": "{time}",
  "style": "{capacity < 10 ? 'color: red;' : 'color: normal;'}"
},
```

Второй модуль — тема сегодняшнего разговора:
```json
"custom/battery-degradation": {
  "format": " {}%",
  "interval": "once",
  "exec": "~/scripts/battery-degradation.sh",
  "tooltip": false
},
```

Я поместил нашу команду в скрипт — так удобнее. Вы можете сделать так же, не забудьте добавить shebang `#!/bin/bash` и:
```sh
chmod +x ~/scripts/battery-degradation.sh
```

В модуле мы определяем формат с nerd-иконкой и процентом, отключаем подсказку и устанавливаем однократный запуск при старте waybar. 

И завершаем эти модули CSS-стилем:
```css
#battery,
#custom-battery-degradation {
  background: #1e1e2e;
  opacity: 0.7;
  padding: 0px 10px;
  margin: 3px 0px;
  margin-top: 5px;
  border: 0px solid #181825;
}

#battery {
  padding-right: 10px;
  border-radius: 10px 0px 0px 10px;
  min-width: 50px;
}

#custom-battery-degradation {
  border-radius: 0px 10px 10px 0px;
  margin-right: 5px;
  min-width: 35px;
}

#battery.critical {
  color: red;
}
```

Готово! В результате: 
![](/images/waybar-battery-module-2.png)