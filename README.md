# Ct.bot

Documentation lookup bot for Ct.js Discord

## Running

You'll need to have a `credentials.json` file or environment variables. This contains things such as the firebase config and prefix.

>credentials.json
```json
{
    "token": "Discord Bot Token Goes Here",
    "firebase": {
        "apiKey": "",
        "authDomain": "",
        "databaseURL": "",
        "projectId": "",
        "storageBucket": "",
        "messagingSenderId": "",
        "appId": ""
    }
}
```
>config.json
```json
{
    "prefix": "ct!",
    "status": "with ct.js! | ct!help"
}
```

First run `npm i` to install dependencies.

Then run `npm run start` to start the bot.

If you're developing it run `npm run dev`. This will restart the bot when javascript files are changed.

## Todo

-   [x] Look up and review topics from the Ct.js documentation
-   [ ] Image manipulation utilities
-   [x] Quick links to Ct.js resources
-   [ ] Alerts when documentation has been updated
-   [x] Allow users to add questions with answers to help other people out
    -   [ ] Approval process using administrator array or special channel
