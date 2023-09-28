# Development

## Running local development

**Important**: The app needs a public address to receive incoming webhooks. You will need to either deploy it somewhere or you can use [ngrok.io](https://ngrok.io) to create a simple reverse proxy for the incoming requests.

You can use a free ngrok account but be aware that your ngrok forwarding address might/will change. A paid account that does not have this behaviour might be a better alternative for more intensive development.  

However to make it work with a free account you can simply update the `NEXTAUTH_URL` in the `.env` and update the `callback` and `webhook` urls on your github app settings page <https://github.com/settings/apps/name-of-your-app>

## Creating the Github App

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

## Ngrok

When you get a new **ngrok** url, you will need to replace the old url in your Github app and .env file. Here are the steps:

Edit your github [app](https://github.com/settings/apps)

Replace your new ngrok **url** with old on *(remember to leave the subdirectories on both)*:

- Callback URL
- Webhook URL

In the `.env` file:

**Important!** Replace the URLs of `NEXTAUTH_URL` and `BASE_URL` variable with your new url
