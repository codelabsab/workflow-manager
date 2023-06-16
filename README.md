# Workflow Manager

> **Work in progress!**

This is an app that will be able to dynamically import and schedule GitHub workflows.

## Getting started

First, install and setup the environment:

```bash
npm install
npm prepare  # installs the git commit and push hooks
```

Copy the `.env-example` to `.env` and update all of the values.

## Running local development

**Important**: The app needs a public address to receive incoming webhooks. You will need to either deploy it somewhere or you kan use [ngrok.io](www.ngrok.io) to create a simple reverse proxy for the incoming requests.

You can use a free ngrok accound but be aware that your ngrok forwarding address might/will change. A paid account that does not have this behaviour might be a better alternative for more intensive development.  

However to make it work with a free account you can simply update the `NEXTAUTH_URL` in the `.env` and update the `callback` and `webhook` urls on your github app settings page <https://github.com/settings/apps/name-of-your-app>

### Creating the Github App

A github app is needed for user authentication and github integration.

1. Go to <https://github.com/settings/apps> and create a new app
2. The app naming does not matter, but will be displayed to the end-user
3. Add a callback to **Identifying and authorizing users**
    - Set the callback url to: `https://<your public domain or localhost>/api/auth`
4. Activate the Webhook section and set the **Webhook URL** to `https://<publicly available domain>/api/github/events`
5. Set the following permissions
    - Repository permissions:
        - Actions: Read & Write
        - Contents: Read-only
        - Metadata: Read-only
        - Workflows: Read & Write
    - Organization permissions:
        - Members: Read-only
    - Account permissions:
        - Email addresses: Read-only
6. Add the following in the **Subscribe to events** section
    - Push
    - Workflow Job
    - Workflow Run
7. Store the settings needed for the runtime environment `.env` file
    - Generate a new `Client secrets` and download the `Private key`
    - Copy the `App ID`
    - Copy the `Client ID`

### Update local environment variables and run the server

1. copy `.env-example` to `.env` and update the values with the values from the previous step
    - **Important!** Note that you have to base64 encode the contents of the `Private Key` before inserting it in to the `.env` to the `GITHUB_APP_PRIVATE_KEY`.

        ```bash
        cat <path to the generated private key file>.pem | base64
        ```

2. (Optionally if you want to run it locally) Start the mysql instance `docker-compose up -d`
3. (Optionally) start ngrok to receive incoming webhooks
4. Start the server `npm run dev`

### More verbose development logging

Add the `VERBOSE_DEV_LOGGING=true` to your `.env` file to enable prisma `query` logging.

### Actually running the service locally

The repository comes with a local `docker-compose` that will host 2 local mysql databases that can be used for development. Why 2 databases you ask? Well one is a shadow database used for generating migrations.

You can however choose to run on a <https://planetscale.com> instance instead.

```bash
# or just docker-compose up in a separate terminal  
docker-compose up -d

# (optional but recommended) i a separate terminal
ngrok http 3000

# install all of the dependencies
yarn install  
# Start the local service
yarn dev 
```
