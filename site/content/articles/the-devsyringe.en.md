---
tech_name: the-devsyringe
title: 'Devsyringe: Stop Copy-Pasting Dynamic Values'
date: '2025-09-05T14:22:00+03:00'
language: en
description: Description and motivation of unix tool devsyringe for injecting dynamic
  values into code or config files based on declarative rules.
tags:
- tools
extra:
  custom_props:
    public: true
    type: synopsis
    theme: linux
    status: finished
---

Today I want to tell about Injecting Life into Static Files: Building Dynamic Configs with [Devsyringe](https://devsyringe.alchemmist.xyz).

As developers, we live in a world of dynamic values. API tokens, temporary URLs from tunneling services like `ngrok` or `localtunnel`, database connection strings, and feature flags are the lifeblood of our modern applications. In compiled languages or Node.js environments, we have a rich ecosystem of tools like `dotenv` and configuration libraries to manage this dynamism seamlessly. They allow us to externalize configuration, injecting values from environment variables or secret managers at runtime.

But what about the static parts of our projects? Consider a simple HTML file that needs to display a temporary public URL, a JavaScript config object for a lightweight script, or a static configuration file for a legacy system. These aren't processed by a bundler or a framework; they are flat files. The traditional solution is manual, error-prone, and frustrating: run a command, watch its output, copy the new value, open a file, find the right line, paste, save, and then repeat for every other file that needs the same value — boredom. This process breaks flow state and is utterly antithetical to the automation we cherish.

I found myself facing this exact problem one too many times. The constant context-switching between my terminal and editor to update URLs was a nagging inefficiency. I knew there had to be a better way — a way to treat these static files as dynamic endpoints for configuration. This frustration was the catalyst for **Devsyringe**, a CLI utility written in Go designed to automate this very workflow.

## The Core Idea: Declarative Configuration Injection
The motivation behind Devsyringe wasn't to build another templating engine or a complex build system. The goal was simpler and more focused: to create a tool that can run a command, parse its output for a specific value using a regex, and then inject that value into one or more target files. The entire behavior is defined declaratively in a simple YAML configuration file, typically named `devsyringe.yaml`.

Think of it as a universal adapter between the dynamic output of CLI tools and the static text of your config files. It's purpose-built for scenarios where heavier solutions are overkill or simply don't fit. The real magic is in the hands-off automation; you define the rules once, and from then on, a single command keeps everything in sync. It's the missing glue that makes your entire setup feel truly dynamic.

## Real-World Use Cases and Practical Applications
Let's move beyond abstract concepts and look at practical, powerful use cases that save you from tedious manual work. The pattern is universal — any CLI command that outputs a value you need in a file is a perfect candidate for automation.

**The Classic Tunnel Automation.**
When developing web applications, you often need to expose your local server to the internet. Tools like `localtunnel` or `serveo` generate unique, random URLs that must be configured in both your frontend and backend code. Here's how Devsyringe handles this automatically:
```yaml
serums:
  localtunnel:
    source: lt --port 8080
    mask: https://[a-z0-9\-]+\.loca\.lt
    targets:
      env_file:
        path: ./.env
        clues: ["API_BASE_URL"]
      frontend_config:
        path: ./src/config.js
        clues: ["API_URL", "const"]
```

This configuration defines a complete workflow: execute the tunnel command, extract the URL using regex, and inject it into both the `.env` file and JavaScript configuration. The entire process becomes a single command: `dsy inject`.

**Dynamic Documentation and Résumé Automation.**  
Here's a more sophisticated use case: keeping technical documentation or LaTeX-generated résumés updated with live statistics. Imagine your résumé.tex file contains a line like: `\newcommand{\githubstars}{427}`

With Devsyringe, you can automatically populate this with your current GitHub statistics:
```yaml
serums:
  github_stats:
    source: curl -s "https://api.github.com/users/yourusername/repos" | jq 'reduce .[] as $repo (0; . + $repo.stargazers_count)'
    mask: "(\d+)"
    targets:
      resume:
        path: ./resume.tex
        clues: ["githubstars"]
```
This setup calls the GitHub API, calculates your total star count across all repositories, and updates the LaTeX source file. Your résumé maintains accurate, current statistics without manual intervention — perfect for job applications or portfolio updates. But then you can set up CI for regular updates with each push if you use the resume repository.

**Advanced Infrastructure Management.**
For more complex setups, Devsyringe shines in infrastructure automation. Consider these scenarios:
- Fetching fresh database credentials from HashiCorv Vault and injecting them into application properties
- Retrieving current deployment endpoints from service discovery and updating API gateway configurations
- Pulling infrastructure IP addresses from cloud providers and updating security group rules
- Extracting build metadata from CI systems and updating deployment manifests

The pattern remains consistent: command  output extraction  file injection. This simplicity makes it adaptable to countless automation scenarios. If you want a plain value from your hands — no problem, use: `echo '<my-value>'` as command, devsyringe will do the rest himself.

## Technical Architecture and Implementation
While Devsyringe's concept is simple, building a robust CLI tool requires careful architecture. The project leverages Go's strengths for concurrent processing and cross-platform compatibility while maintaining simplicity and reliability.

**Project Structure and Design Patterns.**
The architectural elegance of Devsyringe lies in its deliberate use of the **Decorator Pattern**, which mirrors the layered structure of a cabbage — each leaf wraps around the core, adding functionality while preserving the integrity of the inner layers. This pattern is foundational to the tool’s design: lower-level components remain blissfully unaware of the layers above them, ensuring modularity and separation of concerns.

Crucially, this philosophy extends beyond the tool’s internal architecture to its interaction with your projects. Devsyringe operates as an **invisible decorator** for your codebase. Your application remains completely unaware of its presence—no special imports, hooks, or changes to your code are required. It simply updates static files on disk, and your project runs exactly as it did before, just with new values in place. It’s automation that feels like magic because it leaves no trace of itself behind.

This approach enables seamless integration into any workflow. Whether you’re using it locally to manage tunnel URLs or in CI/CD to inject build-time secrets, Devsyringe enhances your environment without altering its fundamental behavior. Your configuration files remain valid, your build processes unchanged, and your mental model intact — all while gaining the power of dynamic value injection.

The codebase follows standard Go conventions with clear separation of concerns:
```plaintext
│── cmd
│   └── dsy
│       └── main.go
└── internal
    ├── cli
    │   ├── commands.go
    │   └── tui
    │       └── tui.go
    ├── config
    │   └── config.go
    ├── process
    │   ├── process.go
    │   └── procmanager.go
    └── utils
        └── utils.go
```
This organization makes the codebase maintainable and testable while keeping logical components separated.

**Key Technical Decisions.** 
The implementation makes several thoughtful choices that enhance reliability and user experience:

Cobra CLI Framework provides professional-grade command structure, automatic help generation, and shell completion. The TUI interface, built with tview, offers real-time process monitoring that surpasses typical CLI tools:
![|700](/images/demo-devsyringe.gif)
The process management system uses goroutines and channels for concurrent command execution and output capture. File injection employs simple pattern matching rather than complex parsing, making it universally applicable to any text format.

**Robust Error Handling and Validation.** 
The tool includes comprehensive error checking at every stage: configuration validation, command execution, output parsing, and file operations. Meaningful error messages guide users toward resolving issues rather than failing cryptically.

## Distribution and Cross-Platform Compatibility
A tool is only useful if it's easily installable. Devsyringe leverages modern Go tooling to provide seamless installation across all major platforms.

**Automated Builds with Goreleaser.** 
The project uses Goreleaser to automate the release process, generating: Cross-platform binaries for Windows, macOS, and Linux, Package manager support (Homebrew, AUR), Debian and RPM packages in [GitHub releases](https://github.com/alchemmist/devsyringe/releases) with checksums and signatures. Windows support already in [backlog](https://github.com/alchemmist/devsyringe/issues/10).

**Installation Simplicity.**  Users can install through multiple channels. For Go developers:
```sh
go install github.com/alchemmist/devsyringe/cmd/dsy@latest
```
For macOS users:
```sh
brew install devsyringe
```
For Arch Linux users:
```sh
paru -S devsyringe
```

This multi-channel approach ensures the tool is accessible to developers regardless of their preferred environment.

## Why Devsyringe Will Change Your Workflow
The true value of Devsyringe emerges after the first time you use it in anger. That moment when you realize you'll never again manually update a tunnel URL across multiple files. When your documentation automatically stays current with your API versions. When your résumé updates itself with your latest achievements.

It's not just about time saved — though that accumulates surprisingly fast. It's about maintaining flow state. It's about eliminating the tiny frustrations that add up throughout a development session. It's about having a tool that makes your entire development environment feel more integrated and automated.

The learning curve is intentionally shallow. The YAML configuration is straightforward, the commands are intuitive, and the feedback is immediate. You can go from installation to solving real problems in under five minutes.

## Getting Started and Next Steps
Ready to eliminate manual file updates from your workflow? Installation is simple:
```sh
go install github.com/alchemmist/devsyringe/cmd/dsy@latest
```

Visit the GitHub [repository](https://github.com/alchemmist/devsyringe) for complete documentation, examples, and source code. The `README` contains practical examples you can adapt immediately for your use cases.

Consider where in your workflow you're still copying values between terminal and editor. That's your starting point. Whether it's tunnel URLs, API keys, version numbers, or statistics — Devsyringe can probably automate it. In repository you can find many issues, if you interested of this project, [welcome](https://github.com/alchemmist/devsyringe/issues)!