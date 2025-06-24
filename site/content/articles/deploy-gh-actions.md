---
date: 2025-06-24
title: "Transparent Deployment with GitHub Actions"
tech_name: "deploy-gh-actions"
tags:
  - github
extra:
  custom_props:
    time: 14:18
    public: true
    type: synopsis
    theme: linux
    status: writing
---

Recently, find the simple way to make anything at my servers in GitHub pipeline with Actions. And I love it’s very clear. I can control all operations, step and processes. Now I’ll show how to make clear depoly with it, but you can use similar for your goals.

Let’s think! How we deploy manually? In the simple case, we connect to server, pull repository and then restart our app.

![](https://alchemmist.xyz/images/deploy-pipeline.svg)

We want automate all of this. Let’s start with first point. We connect to server with SSH, but what we need to do it? Often connection looks like this:
```sh
ssh root@192.168.0.1 -i ~/.ssh/id_rsa25519
```
Here i have three information unit for get access:
1. Server IP address
2. Username of user
3. SSH private key
We make “clear” deployment, therefore all step in our manually pipeline will be automate. In order to GitHub Actions can connect to our server we need to give all information. GitHub have special entity for it: `Secrets and Variables` now, for more security we put all to `secrets`. 

Open your GitHub repository and go to `Settings`, here in `Security` section click to `Secrets and Variables` and go to `Actions`. Then we will add three secrets: `SSH_USER`, `SSH_HOST`, `SSH_KEY`.  Remember, the public pair of `SSH_KEY` private key need to be added to `~/.ssh/authorized_keys` on server. Nice! First step was finished.

Next we need to pull repository. If your server is clean, you need to firstly clone it. If your repository is private, most likely, when you try to do it, you got something like this:
```txt
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

You need to generate *(or migrate)* the ssh keys on your server. For generate you can use this:
```sh
ssh-keygen -C github -t ed25519
```
Then copy `~/.ssh/id_ed25519.pub` and copy on GitHub repository settings at `Deploy keys`. After you can clone repository. In order to GitHub Actions know where your project we make new secret `SSH_PROJECT_PATH`.

Last step: GitHub Actions. Restart service or anything steps, what you want, we describe `.gitub/workflows/deploy.yaml` *(file name doesn’t matter)*:
```yaml
name: Deploy
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Pull repo
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ${{ secrets.SSH_PROJECT_PATH }}
            git pull origin main --rebase
      - name: Compose down
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ${{ secrets.SSH_PROJECT_PATH }}
            docker compose down
      - name: Compose up
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ${{ secrets.SSH_PROJECT_PATH }}
            docker compose up -d
```
In this example I’m using docker for restart my services. Choose your way!

