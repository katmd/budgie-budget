# Budgie Budget

Visualize your monthly budget and see how your income, debts, and expenses are trending.

## Build Status

Visit the deployed app at (Website Pending)

## Technologies Used

Built with: React, Redux, Node, Postgres, Heroku, Travis

## Features

1. 2. 3.

## Setup

1.  Clone the repo to your local machine
2.  Run `npm install` to install packages
3.  Create two postgres databases (`MY_APP_NAME` should match the name parameter in package.json):

```
export MY_APP_NAME=budgie-budget
createdb $MY_APP_NAME
createdb $MY_APP_NAME-test
```

> By default, running `npm test` will use `budgie-budget-test`, while regular development uses `budgie-budget`

4.  Run `npm run start-dev` to bundle and run the app on the localhost (defaulted to `localhost:8080`)

## Credits

Template Code: [Fullstack Academy](https://github.com/FullstackAcademy)
