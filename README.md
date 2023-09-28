# Workflow Manager

Hello there! 👋

Thank you for taking the time to check out this project. Looking to contribute? Great! Please read the [contribution guidelines](docs/CONTRIBUTING.md) first.

Do you use github actions? Maybe you use it to run workflows that should do something at a specific date and time.

This is an app that will be able to dynamically import and schedule GitHub workflows.

## Features

- Github integration
  - Authentication
  - Importing repositories and workflows
  - Triggering workflows  

## Getting started

### Quick start local development

The repository comes with a local `docker-compose` that can be used for development.

1. Start ngrok to handle incoming webhooks from GitHub. [See the development readme for more details](docs/DEVELOPMENT.md#ngrok)

    ```bash
    ngrok http 3000
    ```

2. [Create the GitHub App](docs/DEVELOPMENT.md#creating-the-github-app)
3. Copy [example env file](./.env-example) and update the values needed

    ```bash
    cp .env-example .env
    ```

4. Build and start the local docker compose containers

    ```bash
    docker compose up --build -d
    ```

5. Push the database schema to the database

    ```bash
    docker compose exec frontend npx prisma db push
    ```

Now you should be able to browse to <http://localhost:3000>

## Architecture

The application is built using Typescript, [Next.js](https://nextjs.org/), [tRPC](https://trpc.io/), [tailwindcss](https://tailwindcss.com/), and [Prisma](https://www.prisma.io/).

Authentication is done with [NextAuth.js](https://next-auth.js.org/) and using GitHub as the main [Provider](https://next-auth.js.org/providers/github).

The application relies on incoming webhooks to receive events from GitHub. To solve this when developing locally behind a NAT router we have used [ngrok](https://ngrok.com/). *Note that ngrok is not a requirement but one of many webhook development tools.*

### Scheduling

The code that handles the scheduling at the moment quite simple.

1. First we have a special private api endpoint that will find all of the scheduled workflows that should be fired in github at the current point in time.
2. The second part consist of some small script that will make a http request to that endpoint every minute.
