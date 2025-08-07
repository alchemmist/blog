---
date: 2025-08-23
title: "Privacy screen share in Hyprland"
description: "How to share full screen on Hyprland without worries about chats, notes and other privacy info."
tech_name: "hyrpland-noscreenshare"
language: en
tags:
  - linux
extra:
  custom_props:
    time: 17:14
    public: true
    type: synopsis
    theme: linux
    status: finished
---
We’ve all been in a situation when you need to share your screen with many windows, and you need a few minutes before clicking on “Share screen” button, in order to decide. It’s okay, especially if your system is your second (or even first) home: with private notes, documents, passwords, chats and so on.

Next we will set up a useful workflow for this case. But, this setup will use new feature, which is hardwired into Hyprland and most likely absent in other DEs/compositors. I will demonstrate our final goal:
![|85](/images/noscreenshare-demo.mp4)
> If you like my wallpaper you can find [this](https://github.com/alchemmist/dotfiles/blob/main/wallpapers/miyazaki/images/1198594-3200x1680-desktop-hd-studio-ghibli-background.jpg) and more very good stuff in my `dotfiles` repository on [GitHub](https://github.com/alchemmist/dotfiles/tree/main/wallpapers). Don’f forget: I love your stars!

Let’s go step-by-step. Firstly, let’s recall that in Hyprland [release](https://hypr.land/news/update50/#:~:text=on%20by%20default.-,No%20screen%20share,-There%E2%80%99s%20a%20new) of version `0.50.0` a new `windowrulev2` option `noscreenshare` was added. It’s a new release and now it isn’t controlled from `hyprctl` only from the config file, like this:
```conf
windowrulev2 = noscreenshare, class:^(org.telegram.desktop|obsidian|discord)$
```
This option will tell Hyprland to draw a black rectangle instead of window content (*even if this window isn’t in focus or int the background*). This works perfect and protects our privacy. But, I’ve found two inconvenient cases: **1.** When we want to make screenshot (*in my case, with flameshot*) Hyprland interpret it as try to share our screen and hide all privacy windows. **2.** Sometimes, I want to share something from my Obsidian, for example, and dive into configs in this moment — not so good.
## CLI control noscreenshare option
To fix this experience, let’s write a script for control window rule in config. If you don’t have time, the full version of the script [here](https://github.com/alchemmist/dotfiles/blob/main/scripts/toggle_noscreenshare.sh). Script will comment or uncomment line in config file with rule and save info about current rule state in maker-file `~/.config/hypr/.screenshare_rule_disabled`. And script can be run with command `toggle` to change state to the opposite:
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
Let’s write `toggle_rule` function. We will use `sed` (*Stream Editor*) Linux util. It’s one of the most powerful tools for text processing in Linux and Unix systems. It's commonly used for tasks like search and replace, text transformation, and stream editing. Syntax of `sed`, in general, looks like this:
```sh
sed [options] "script" [file...]
```
We need `-i` option edit file in-place. Then write a script. Firstly we need to find string with `noscreenshare` rule, like in regex:
```sh
"/windowrolev2.*noscreenshare.*"
```
We start with `"/"` for write search query, this we need to line start with `"windowrolev2"`, after that `".*"` for any count of any symbols, between which `"noscreenshare"`. Then we use `"/"` for end search query, and `"s/"` (*substitute*) for replace: 
```sh
"/windowrulev2.*noscreenshare.*/s/^#//"
```
Finally, we use `"^#"` regular expression for find hash at the start of line and replace it to nothing: `"//"`. Full command looks like:
```sh
sed -i '/windowrulev2.*noscreenshare.*/s/^#//' "$CONFIG_FILE"
```
Then use `sed` for add hash to start of line similar, depending on existence of marker-file:
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
In last step of script, we call this function, if `toggle` option was given, and return a json-like string for waybar. Full script:
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
## Waybar module
To use this conveniently and instantly detect the current privacy state we write a waybar module:
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
Let’s describe whats going on here. To get value for this module we use `exec` field and set our script. Then we defined what will happen, when we click on module at `on-click` option: run script with `toggle` option and send system signal to waybar. This allows you to not reload all waybar process, but only this module. Here it’s very important to sync `signal` value and number at `pkill -SIGRTMIN+4 waybar` command, and to make this value unique only for this waybar module. Then we configure to run our script once on waybar startup and define view format (`tooltip: false` for not showing text, when hovering over cursor) . I’m using this nerdfonts icons for this, but they are not the same size. Therefore I fine-tune padding and add some styles:
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
After that we have got nice interface for hands-on control of our privacy:
![|700](/images/noscreenshare-demo.gif)
