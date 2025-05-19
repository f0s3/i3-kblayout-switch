# i3-kblayout-switch

`i3-kblayout-switch` is a simple script designed for i3wm users who frequently switch between multiple keyboard layouts. It automatically remembers and switches the keyboard layout per workspace, making layout management more seamless.

## Installation

### Arch Linux

#### AUR

`yay -S i3-kblayout-switch`

#### Manual installation

##### Install dependencies

`yay -S xkb-switch xkblayout-state`

##### Install i3-kblayout-switch

curl it to some place that's in your $PATH:
`curl https://raw.githubusercontent.com/f0s3/i3-kblayout-switch/refs/heads/master/i3-kblayout-switch.ts /usr/bin/i3-kblayout-switch`

chmod it if needed:

`chmod +x /bin/i3-kblayout-switch`

Add the script to your i3 configuration to run it on startup. In your ~/.config/i3/config (or wherever your i3 config is located), add the following line:

`exec_always --no-startup-id i3-kblayout-switch &`
