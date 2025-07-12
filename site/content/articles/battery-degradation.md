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
``<code>sh
upower -e
</code>`<code>
Then find battery from this list:
</code>`<code>sh
upower -e | grep BAT

# For example:
# /org/freedesktop/UPower/devices/battery_BATT
</code>`<code>

Then get detailed information about this device, with </code>-i<code> flag of </code>upower<code>:
</code>`<code>sh
upower -i $(upower -e | grep BAT)
</code>`<code>
We got something like this:
</code>`<code>txt
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
</code>`<code>

Here many interesting information, for example charge-cycles, time to full battery, and so on. But now we use two parameters: 
- </code>energy-full-design<code> — the original full battery volume 
- </code>energy-full<code> — current battery volume
Deference between this two parameters is degradation of battery:
$$
\text{Degradation} = \left(1 - \frac{E_{\text{full}}}{E_{\text{design}}}\right) \times 100\%
$$
Now let’s calculate this metric in percents. 

First find this parameters in big output and devide them, with </code>awk<code>:
</code>`<code>sh
upower -i $(upower -e | grep BAT) | awk '\
	/energy-full:/ {ef=$2}\
	/energy-full-design:/ {efd=$2}\
	END {print ef/efd}'
</code>`<code>
Here we find </code>energy-full<code> and save to variable </code>ef<code>, find </code>enengry-full-design<code> and save to </code>efd<code> variable. On the end we divide them: </code>ef/efd<code>.  

After that calculate percent value, with </code>bc<code> *(is shell calculator for expression with float numbers)*:
</code>`<code>sh
echo "(1 - $(upower -i $(upower -e | grep BAT) | awk '\
        /energy-full:/ {ef=$2}\
        /energy-full-design:/ {efd=$2}\
        END {print ef/efd}')) * 100 + 0.5" \
	| bc

# Output example:
# 20.558200
</code>`<code>
Here we make </code>+ 0.5<code> for rounding when the fractional part is cut off later.

In last step we need to round value. We make it simple: we already add </code>0.5<code> to value and now it remains to cut off the fractional part with </code>cut<code> util:
</code>`<code>sh
echo "(1 - $(upower -i $(upower -e | grep BAT) | awk '\
        /energy-full:/ {ef=$2}\
        /energy-full-design:/ {efd=$2}\
        END {print ef/efd}')) * 100 + 0.5" \
	| bc \
	| cut -d'.' -f1

# Output example:
# 20
</code>`<code>
Here </code>-d'.'<code> means we split by dot and </code>-f1<code> means we take first part.

## Waybar module
In my waybar config </code>~/.config/waybar/config.json<code> I’m add two modules on right section, but you can do as you want. Finally i’m got this:
![](/images/battery-waybar-module.png)
> If you like my wallpaper you can find this and more very good stuff in my </code>dotfiles<code> repository on [GitHub](https://github.com/alchemmist/dotfiles/tree/main/wallpapers). Don’f forgot: I love your stars!


Let’s see:
</code>`<code>json
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
</code>`<code>
First module it’s default </code>battery<code> module, for me it’s great work on hyprland. Here we define levels of good, warning and critical level of charging, define nerd icons format for different battery state:
</code>`<code>json
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
</code>`<code>

Second module it’s today topic: </code>custom/batterydegradaion<code>:
</code>`<code>json
"custom/battery-degradation": {
  "format": " {}%",
  "interval": "once",
  "exec": "<span class="tilde">~</span>/scripts/battery-degradation.sh",
  "tooltip": false
},
</code>`<code>
I’m put our command to script, for me it’s useful. You can do same, don’t forgot add shebang </code>#!/bin/bash<code> and:
</code>`<code>sh
chmod +x <span class="tilde">~</span>/scripts/battery-degradation.sh
</code>`<code>

In module we define the format with nerd icon and percent, turn off tooltip and set run once on waybar start *(because this parameter changing very long)*. 

And finish this modules with css style in </code>~/.config/waybar/style.css<code>:
</code>`<code>css
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
</code>``

Done! As result: 
![](/images/waybar-battery-module-2.png)
