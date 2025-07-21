---
date: '2025-07-11T09:58:00+03:00'
title: Battery degradation on Linux
tech_name: battery-degradation
tags:
- linux
extra:
  custom_props:
    public: true
    type: synopsis
    theme: linux
    status: finished
---

We all know our battery not forever. It’s okay, we can replace degraded battery at service and use machine again. But very useful see current state of your battery. In MacOS it’s default feature, on Linux we, of course, can do same thing. Let’s see!

Now we will understand how to find the desired value and then make a beautiful minimalistic waybar module for battery.

## Find a battery degradation value

Firstly get list of all power devices:
```sh
upower -e
```
Then find battery from this list:
```sh
upower -e | grep BAT

# For example:
# /org/freedesktop/UPower/devices/battery_BATT
```

Then get detailed information about this device, with `-i` flag of `upower`:
```sh
upower -i $(upower -e | grep BAT)
```
We got something like this:
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

Here many interesting information, for example charge-cycles, time to full battery, and so on. But now we use two parameters: 
- `energy-full-design` — the original full battery volume 
- `energy-full` — current battery volume
Deference between this two parameters is degradation of battery:
$$
\text{Degradation} = \left(1 - \frac{E_{\text{full}}}{E_{\text{design}}}\right) \times 100\%
$$
Now let’s calculate this metric in percents. 

First find this parameters in big output and devide them, with `awk`:
```sh
upower -i $(upower -e | grep BAT) | awk '\
	/energy-full:/ {ef=$2}\
	/energy-full-design:/ {efd=$2}\
	END {print ef/efd}'
```
Here we find `energy-full` and save to variable `ef`, find `enengry-full-design` and save to `efd` variable. On the end we divide them: `ef/efd`.  

After that calculate percent value, with `bc` *(is shell calculator for expression with float numbers)*:
```sh
echo "(1 - $(upower -i $(upower -e | grep BAT) | awk '\
        /energy-full:/ {ef=$2}\
        /energy-full-design:/ {efd=$2}\
        END {print ef/efd}')) * 100 + 0.5" \
	| bc

# Output example:
# 20.558200
```
Here we make `+ 0.5` for rounding when the fractional part is cut off later.

In last step we need to round value. We make it simple: we already add `0.5` to value and now it remains to cut off the fractional part with `cut` util:
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
Here `-d'.'` means we split by dot and `-f1` means we take first part.

## Waybar module
In my waybar config <code><span class="tilde">~</span>/.config/waybar/config.json</code> I’m add two modules on right section, but you can do as you want. Finally i’m got this:
![](/images/battery-waybar-module.png)
> If you like my wallpaper you can find this and more very good stuff in my `dotfiles` repository on [GitHub](https://github.com/alchemmist/dotfiles/tree/main/wallpapers). Don’f forgot: I love your stars!


Let’s see:
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
First module it’s default `battery` module, for me it’s great work on hyprland. Here we define levels of good, warning and critical level of charging, define nerd icons format for different battery state:
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

Second module it’s today topic: `custom/batterydegradaion`:
```json
"custom/battery-degradation": {
  "format": " {}%",
  "interval": "once",
  "exec": "~/scripts/battery-degradation.sh",
  "tooltip": false
},
```
I’m put our command to script, for me it’s useful. You can do same, don’t forgot add shebang `#!/bin/bash` and:
```sh
chmod +x ~/scripts/battery-degradation.sh
```

In module we define the format with nerd icon and percent, turn off tooltip and set run once on waybar start *(because this parameter changing very long)*. 

And finish this modules with css style in <code><span class="tilde">~</span>/.config/waybar/style.css</code>:
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

Done! As result: 
![](/images/waybar-battery-module-2.png)