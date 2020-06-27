# Headless FAQ backend

This is core of Headless FAQ

# Setup

## Dev

1. Setup `Hasura` and `Telegram bot`
1. Copy and set `.env_example > .env` & `.env_db_example > .env_db` (`MAIN_DB_CONNECTION_STRING` the same)
1. Run `npm run faq:dev:gql`

## Deploy

1. Setup Google App Engine and `gcloud` console
1. `npm run faq:deploy:gql`

# Techs

1. Architecture
    1. [Domain Driven Design Light (DDDL)](https://github.com/Dionid/dddl)
    1. Event Driven Architecture (EDA)
    1. CQRS + CQRS bus
    1. Repositories
    1. Modular monolith
    1. IoC + DI
1. Code
    1. Telegram Bot
    1. NestJS
    1. GraphQL
    1. Knex
1. DB
    1. PostgreSQL (+ Hasura)
1. Deployment
    1. Heroku for Hasura + PostgreSQL
    1. Google App Engine for main App
    1. Serverless + Google Cloud Functions

# Serverless

You can find example of Serverless lambda on GCF. It was added here just for
teaching purpose and is not used in application flow.

I will make separate branch, where you could find it in the future and delete from `master` 