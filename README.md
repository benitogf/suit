# SUIT

[![Build Status][build-image]][build-url]

[build-url]: https://travis-ci.com/benitogf/suit
[build-image]: https://travis-ci.com/benitogf/suit.svg?token=b628aVyTMNXTpbUCmJtn&branch=master&style=flat-square

> A Vue.js project based on [vue-material](http://vuematerial.io) please check the [wiki](https://github.com/benitogf/suit/wiki) for more details about the project goals

## Development Requirements

The [api](https://github.com/benitogf/tie) running locally, or changing [the dev config](https://github.com/benitogf/suit/blob/master/config/index.js#L47) to https://api.minut.us

Authentication is static for now (no user registration) just two users:

Admin role:

- username: admin
- password: 123

User role:

- username: user
- password: 123


## Available commands

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# build for production
npm run build

# build library
npm run build:lib

# serve production at localhost:9009 (need to run build first)
npm run serve

# run unit tests
npm run unit

# run and watch unit tests
gulp

# run e2e tests
npm run drive
npm run build
npm run serve
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

Try using (vue devtools)[https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd]
