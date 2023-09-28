# Workflow Manager

- [ ] Säljande beskrivning av vad det här är
  - [ ] med bild/gif
- [ ] Gå igenom Getting started så att det går att följa den
- [ ] Beskriva scheduling
- [ ] .

## Intro

This is an app that will be able to dynamically import and schedule GitHub workflows.

Hello there! 👋

Thank you for taking the time to check out this project. Looking to contribute? Great! Please read the [contribution guidelines](docs/CONTRIBUTING.md) first.

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
    docker compose --build -d
    ```

5. Push the database schema to the database

    ```bash
    docker compose exec frontend npx prisma db push
    ```
