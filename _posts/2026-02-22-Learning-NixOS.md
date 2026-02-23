---
layout: post
title: Learning NixOS
date: 2026-02-22 12:00:00
description: My journey learning NixOS, Flakes, Home Manager, and Snowfall Lib.
tags: nixos automation
categories: linux
---

I recently started exploring NixOS, and it has been quite the journey. Coming from traditional Linux distributions, the declarative nature of NixOS was a paradigm shift. I wanted to document my learnings here, serving both as a guide for others and a set of notes for my future self.

## Why NixOS?

The main appeal for me was **reproducibility**. In the past, if I broke my system, I’d have to remember all the random packages I installed and config files I tweaked. With NixOS, the entire state of my operating system is defined in code. If I break something, I can rollback to a previous generation right from the boot menu.

## Nix Flakes

The first major concept I tackled was **Nix Flakes**.

Flakes are a way to package Nix projects with pinned dependencies. This ensures that if I build my system today and again in six months, I get the exact same result unless I explicitly update the `flake.lock` file. It solves the issue of "it works on my machine" by locking down the exact versions of nixpkgs and other inputs.

## Organization with Snowfall Lib

As I added more to my configuration, my `flake.nix` file started getting massive. That's when I found **Snowfall Lib**.

Snowfall Lib is a library that introduces an opinionated directory structure to Nix flakes. Instead of manually importing every file, Snowfall automatically discovers my systems, packages, modules, and overlays based on the folder structure.

My structure now looks something like this:

```
├── flake.nix
├── systems/
│   └── x86_64-linux/
│       └── my-machine/
│           └── default.nix
├── modules/
│   └── nixos/
│       └── jellyfin/
│           └── default.nix
└── homes/
    └── x86_64-linux/
        └── tyler/
            └── default.nix
```

This makes navigating my configuration much more intuitive.

## Home Manager

NixOS handles the system configuration, but **Home Manager** is what I use for my user-specific configuration (dotfiles).

I use it to configure things like my shell (zsh/fish), terminal emulator (kitty/alacritty), git settings, and neovim. The beauty is that I don't need to symlink files manually anymore. Home Manager generates the config files in `~/.config/` based on the Nix code I write.

## Package Management & Dev Shells

One of my favorite features is how Nix handles development environments.

Instead of installing Python, Node.js, Go, and Rust globally and dealing with version conflicts, I use **Dev Shells**.

I can create a `shell.nix` (or define a devShell in my flake) for a specific project. When I run `nix develop` in that directory, I get a shell with all the tools I need. When I exit, they are gone. My global system stays clean, and I never have to worry about polluting my environment with one-off dependencies.

## Creating Modules: Self-Hosting Jellyfin

To really test my understanding, I decided to self-host **Jellyfin**. Instead of just enabling the service in my `configuration.nix`, I created a reusable module.

By defining `options` (like `services.jellyfin.enable`), I can toggle the service on or off for different machines easily.

```nix
{ lib, config, pkgs, ... }:
with lib;
let
  cfg = config.services.my-jellyfin;
in
{
  options.services.my-jellyfin = {
    enable = mkEnableOption "Enable Jellyfin Media Server";
  };

  config = mkIf cfg.enable {
    services.jellyfin = {
      enable = true;
      openFirewall = true;
    };
    environment.systemPackages = [ pkgs.jellyfin pkgs.jellyfin-web pkgs.jellyfin-ffmpeg ];
  };
}
```

This modular approach is what makes NixOS so powerful for managing infrastructure.

## Conclusion

The learning curve for NixOS is steep, but the payoff is huge. Having a system that is fully declarative, reproducible, and easy to rollback is invaluable. I'm still learning, but tools like Flakes, Snowfall Lib, and Home Manager have made the experience much more manageable.
