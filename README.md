## Requirements

You need to have installed:

1. Yarn https://yarnpkg.com/getting-started/install (`npm install -g yarn`)
2. Docker https://docs.docker.com/get-docker/

## Installation

In order to run the backend, first you need to install dependencies:

```shell
yarn install
```

For working server, database should be installed and configured, package is coming with configured `docker-compose`, so the easiest way is to use it as it is.

In separate terminal run (it may take some time when you run it first time):

```shell
docker-compose up
```

After, you need to create required schema in database, for this we need to use knex migrations (there has been created a separate npm script for that purpose):

```shell
yarn run migrate
```

**Note**: Please remember, when new functionality would come, you may need to call migration again.

## Running

Ok, right now all ready for the start!

Please run following command:

```shell
yarn run start
```

Start command run server by default on port 8888

You can check application status visiting next URL:

[http://localhost:8888/v1/health]()

Swagger with all available API's can be found here:

[http://localhost:8888/documentation/]()
