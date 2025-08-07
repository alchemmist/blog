---
date: '2025-06-24T14:18:00+03:00'
title: Прозрачное развертывание с GitHub Actions
tech_name: deploy-gh-actions
language: ru
tags:
- github
extra:
  custom_props:
    public: true
    type: synopsis
    theme: linux
    status: finished
---

Недавно я нашёл простой способ выполнять любые операции на своих серверах через GitHub Actions. Мне нравится прозрачность этого подхода — я могу контролировать все шаги и процессы. Сейчас я покажу, как настроить чистое развертывание, но вы можете адаптировать это под свои задачи.

Как мы разворачиваем вручную? В простейшем случае подключаемся к серверу, вытягиваем репозиторий и перезапускаем приложение.

![](https://alchemmist.xyz/images/deploy-pipeline.svg)

Автоматизируем этот процесс. Начнём с подключения. Обычно это выглядит так:
```sh
ssh root@192.168.0.1 -i ~/.ssh/id_rsa25519
```

Нам нужны три компонента для доступа:
1. IP-адрес сервера
2. Имя пользователя
3. Приватный SSH-ключ
Для "чистого" развертывания автоматизируем все шаги. Чтобы GitHub Actions мог подключиться к серверу, передадим данные через секреты. 

В репозитории GitHub зайдите в `Settings` → `Security` → `Secrets and Variables` → `Actions`. Добавьте три секрета: `SSH_USER`, `SSH_HOST`, `SSH_KEY`. Не забудьте добавить публичный ключ в <code><span class="tilde">~</span>/.ssh/authorized_keys</code> на сервере. Первый шаг завершён.

Далее — вытягивание репозитория. Если сервер чистый, его нужно клонировать. Для приватных репозиториев вы можете столкнуться с ошибкой:
```txt
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

Сгенерируйте SSH-ключи на сервере:
```sh
ssh-keygen -C github -t ed25519
```

Добавьте публичный ключ в `Deploy keys` в настройках репозитория GitHub. Создайте секрет `SSH_PROJECT_PATH` для пути к проекту.

Финальный шаг — GitHub Actions. Создайте файл `.gitub/workflows/deploy.yaml` (имя не важно):
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

В этом примере я использую Docker для перезапуска сервисов. Выберите свой подход!```