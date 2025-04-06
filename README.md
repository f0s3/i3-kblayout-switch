# i3-kblayout-switch

`i3-kblayout-switch` is a simple script designed for i3wm users who frequently switch between multiple keyboard layouts. It automatically remembers and switches the keyboard layout per workspace, making layout management more seamless.

## Installation

### Arch Linux

#### AUR

`yay -S i3-kblayout-switch`

#### Manual installation

##### Install dependencies

TODO: add it to AUR

`yay -S xkb-switch xkblayout-state`

##### Install i3-kblayout-switch

TODO: describe cloning process, clone the file into /bin/i3-kblayout-switch, something in the lines of:

`curl https://raw.githubusercontent.com/f0s3/i3-kblayout-switch/refs/heads/master/i3-kblayout-switch.ts /bin/i3-kblayout-switch`

TODO: chmod it if needed

`chmod +x /bin/i3-kblayout-switch`

Add the script to your i3 configuration to run it on startup. In your ~/.config/i3/config (or wherever your i3 config is located), add the following line:

`exec_always --no-startup-id i3-kblayout-switch &`
