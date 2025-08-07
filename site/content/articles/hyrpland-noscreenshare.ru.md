---
date: '2025-08-23T17:14:00+03:00'
title: Безопасно делимся экраном в Hyprland
description: Как безопасно демонстрировать полный экран в Hyprland без риска показать
  чаты, заметки и другую приватную информацию.
tech_name: hyrpland-noscreenshare
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

Мы все были в ситуации, когда нужно показать экран с множеством окон, и требуется несколько минут перед нажатием кнопки «Поделиться экраном», чтобы принять решение. Это нормально, особенно если ваша система — ваш второй (или даже первый) дом: с личными заметками, документами, паролями, чатами и так далее.

Далее мы настроим удобный рабочий процесс для такого случая. Однако эта настройка будет использовать новую функцию, встроенную в Hyprland и, скорее всего, отсутствующую в других DE/композиторах. Я продемонстрирую нашу конечную цель. Например, мой режим демонстрации экрана может выглядеть так:
![|85](/images/noscreenshare-demo.mp4)
> Если вам нравятся мои обои, вы можете найти [эти](https://github.com/alchemmist/dotfiles/blob/main/wallpapers/miyazaki/images/1198594-3200x1680-desktop-hd-studio-ghibli-background.jpg) и много других отличных материалов в моём репозитории `dotfiles` на [GitHub](https://github.com/alchemmist/dotfiles/tree/main/wallpapers). Не забывайте: я обожаю ваши звёзды!

Разберём всё по шагам. Во-первых, вспомним, что в [релизе](https://hypr.land/news/update50/#:~:text=on%20by%20default.-,No%20screen%20share,-There%E2%80%99s%20a%20new) Hyprland версии `0.50.0` было добавлено новое правило `windowrulev2` с опцией `noscreenshare`. Это свежий релиз, и сейчас оно управляется только из конфигурационного файла, вот так:
```plaintext
windowrulev2 = noscreenshare, class:^(org.telegram.desktop|obsidian|discord)$
```
Эта опция предписывает Hyprland рисовать чёрный прямоугольник вместо содержимого окна (даже если это окно не в фокусе или на заднем плане). Это работает идеально и защищает нашу приватность. Но я обнаружил два неудобных случая: 1. Когда мы хотим сделать скриншот (в моём случае, с помощью flameshot), Hyprland интерпретирует это как попытку поделиться экраном и скрывает все приватные окна. 2. Иногда я хочу показать что-то из моего Obsidian, например, и лезть в конфиги в этот момент — не очень хорошо.
## Управление опцией noscreenshare через CLI
Чтобы исправить этот опыт, напишем скрипт для управления правилом окна в конфиге. Если у вас нет времени, полная версия скрипта здесь. Скрипт будет комментировать или раскомментировать строку в конфигурационном файле с правилом и сохранять информацию о текущем состоянии правила в файле-маркере <code><span class="tilde">~</span>/.config/hypr/.screenshare_rule_disabled</code>. Скрипт можно запустить с командой `toggle`, чтобы изменить состояние на противоположное:
```bash
#!/bin/bash

CONFIG_FILE="$HOME/.config/hypr/hyprland.conf"
STATE_FILE="$HOME/.config/hypr/.screenshare_rule_disabled"

toggle_rule() {
	# TODO
}

case ${1} in
    "toggle")
        toggle_rule
        ;;
esac
```
Напишем функцию `toggle_rule`. Мы будем использовать утилиту Linux `sed` (_Stream Editor_). Это один из самых мощных инструментов для обработки текста в Linux и Unix-системах. Он обычно используется для таких задач, как поиск и замена, преобразование текста и потоковое редактирование. Синтаксис `sed`, в общем виде, выглядит так:
```bash
sed [options] "script" [file...]
```
Нам нужна опция `-i` для редактирования файла на месте. Затем пишем скрипт. Сначала нам нужно найти строку с правилом `noscreenshare`, как в regex:
```bash
"/windowrolev2.*noscreenshare.*"
```
Мы начинаем с `"/"` для написания поискового запроса, нам нужно, чтобы строка начиналась с `"windowrolev2"`, после чего `".*"` для любого количества любых символов, между которыми `"noscreenshare"`. Затем мы используем `"/"` для завершения поискового запроса и `"s/"` (_substitute_) для замены:
```bash
"/windowrulev2.*noscreenshare.*/s/^#//"
```
Наконец, мы используем регулярное выражение `"^#"` для поиска решётки в начале строки и заменяем её на ничто: `"//"`. Полная команда выглядит так:
```bash
sed -i '/windowrulev2.*noscreenshare.*/s/^#//' "$CONFIG_FILE"
```
Затем используем `sed` для добавления решётки в начало строки аналогичным образом, в зависимости от наличия файла-маркера:
```bash
toggle_rule() {
    if [ -f "$STATE_FILE" ]; then
        sed -i '/windowrulev2.*noscreenshare.*/s/^#//' "$CONFIG_FILE"
        rm -f "$STATE_FILE"
        CLASS="on"
    else
        sed -i '/windowrulev2.*noscreenshare.*/s/^/#/' "$CONFIG_FILE"
        touch "$STATE_FILE"
        CLASS="of"
    fi
}
```
На последнем шаге скрипта мы вызываем эту функцию, если была дана опция `toggle`, и возвращаем json-подобную строку для waybar. Полный скрипт:
```bash
#!/bin/bash

CONFIG_FILE="$HOME/.config/hypr/hyprland.conf"
STATE_FILE="$HOME/.config/hypr/.screenshare_rule_disabled"

toggle_rule() {
    if [ -f "$STATE_FILE" ]; then
        sed -i '/windowrulev2.*noscreenshare.*/s/^#//' "$CONFIG_FILE"
        rm -f "$STATE_FILE"
        CLASS="on"
    else
        sed -i '/windowrulev2.*noscreenshare.*/s/^/#/' "$CONFIG_FILE"
        touch "$STATE_FILE"
        CLASS="off"
    fi
}

case ${1} in
    "toggle")
        toggle_rule
        ;;
    *)
        if [ -f "$STATE_FILE" ]; then
            CLASS="off"
        else
            CLASS="on"
        fi
        ;;
esac

echo "{\"class\": \"$CLASS\", \"alt\": \"$CLASS\"}"
```
## Модуль Waybar
Чтобы использовать это удобно и мгновенно определять текущее состояние приватности, напишем модуль waybar:
```json
"custom/noscreenshare": {
  "exec": "~/scripts/toggle_noscreenshare.sh",
  "on-click": "~/scripts/toggle_noscreenshare.sh toggle && pkill -SIGRTMIN+4 waybar",
  "signal": 4,
  "interval": "once",
  "return-type": "json",
  "format": "{icon}",
  "format-icons": {
    "off": "",
    "on": "󰗹"
  },
  "tooltip": false
},
```
Опишем, что здесь происходит. Чтобы получить значение для этого модуля, мы используем поле `exec` и указываем наш скрипт. Затем мы определяем, что произойдёт при клике на модуль в опции `on-click`: запуск скрипта с опцией `toggle` и отправка системного сигнала waybar. Это позволяет не перезагружать весь процесс waybar, а только этот модуль. Здесь очень важно синхронизировать значение `signal` и число в команде `pkill -SIGRTMIN+4 waybar`, и сделать это значение уникальным только для этого модуля waybar. Затем мы настраиваем однократный запуск нашего скрипта при старте waybar и определяем формат отображения (`tooltip: false` для отключения текста при наведении курсора). Я использую эти иконки nerdfonts для этого, но они не одинакового размера. Поэтому я тонко настраиваю отступы и добавляю некоторые стили:
```css
#custom-noscreenshare {
  background: #1e1e2e;
  opacity: 0.7;
  padding: 0px 10px;
  margin: 5px 5px 3px 0px;
  border: 0px solid #181825;
  border-radius: 10px;
}

#custom-noscreenshare.on {
  font-size: 18px; 
  padding-right: 14px;
}

#custom-noscreenshare.off {
  font-size: 16px;
  padding-right: 16px;
  padding-left: 9px
}
```
После этого мы получаем удобный интерфейс для практичного контроля нашей приватности:  
![|700](/images/noscreenshare-demo.gif)