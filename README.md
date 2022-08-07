# Vizion API Challenge

# Table of Contents
- [Setting Up](#setting-up)
- [Resources](#resources)
- [How It Works](#how-it-works)
- [Repo Design Pattern](#repo-design-pattern)
- [How the package.json works](#package-json-explanation)
- [Agile process](#agile)
- [Testing](#testing)
- [Postman Collection](#postman-collection)
- [Notes](#notes)
- [NPM and Yarn](#npm-and-yarn)
- [Requirements](#vizion-api-challenge)
# Setting Up
- Install [NodeJS](https://nodejs.org/en/)
- Install [Docker](https://www.docker.com/products/docker-desktop/)
- Install the following images:
  - postgres12-alpine: run `docker pull postgres:12-alpine` in terminal.
  - softwaremill/elasticmq: run `docker pull softwaremill/elasticmq` in terminal.
- Install yarn: `npm install -g yarn`
- Install packages: `yarn`
- Finally run: `npm start`
  - This shouldn't need anything else. [But if you are interested in learning why](#package-json-explanation).
  - This is important we run the app using `npm start` and not `yarn start`. [Click here to learn why](#npm-and-yarn)
# Resources
- [Sequelize](https://sequelize.org/)
- [ElasticMQ](https://github.com/softwaremill/elasticmq)
- [Nodejs](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Postgres](https://www.postgresql.org/)
- [Puppeteer](https://pptr.dev/)

# How It Works
![LucidChart Diagram](public/vizion.png?raw=true "LucidChart Diagram")

# Repo Design Pattern
![Model Logic Controller](public/MLCdiagram.png?raw=true "Model Logic Controller")

# Package Json Explanation
So the idea here was to make this as easy as can be to start up. I didn't want the user to have to run any docker commands. I'm not an expert at docker but I've used it before, and generally speaking its pretty simple to start up a docker container if you have the image. So we download the 2 images we need (`postgres:12-alpine` and `softwaremill/elasticmq`). I wrote a series of scripts that will setup the docker containers (basically the database, express API server and the elasticmq services) and we use concurrently to start them both at the same time. The database service just runs in background and doesn't need to be ran concurrently like the elasticmq and api service need to be.

The issue I had now was that it was a manual process to stop all the docker containers that we had running. And I was concerned that this was bad practice not to have some solution for this. Since runaway containers running will drain up battery life and will cause your PC to become very hot :). So to solve this issue, I looked into a feature of npm that allows for [script hooks](https://docs.npmjs.com/cli/v8/using-npm/scripts). So after the user terminates their session, the `post` hook will run which should stop the necessary containers and also remove them. It takes a second or two but personally I think this feature is worth it. Then when you `npm start` again, it will set it all up for you. 

If I needed to persist this data, I would either setup some hydration script or make it so it doesnt stop/remove the `postgres` docker container, so that the data can at least persist. 

# Agile
Not that this was necessary but I find it easier to organize and break down my problems into tasks. To achieve this I used a kanban board.

![Kanban](public/Kanban.png?raw=true "Kanban")
# Testing
Simple run `yarn test`.

# Postman Collection
[Postman Collection](public/vizion.json)

# Notes
- Changes to requirements
  - The only change I made was adding in a `status` and `error` property on the `Result` model. I did this because I wanted to add the result before it was processed, this way the user requests a `Result` thats in progress, we can return that, instead of returning that one doesn't exist yet.
- If I had more time I would:
  - Implement a cron job that would periodically reprocess references and add results.
  - Add integration tests
  - Instead of just scraping the URL, we could in theory, click around the site and gather data from all the pages we can find.
  - I've used sequelize before but not so much, so wasnt sure if there was some way to use sequelize not just as a way to build/manage
    our tables, but also to create models that we can use in code. I didn't want to go down the ORM rabbit hole, so figured this was fine for now.
    The idea behind our model/logic/controller pattern would be that logic would get the model schema from the model file, but since we only used
    sequelize to create our tables and not to create a class or object that represents the database model, we didnt have this. 
- Things I might have changed (or just things I noticed about this project):
  - I think we could have used DynamoDB for this, which was a good solution IMO since we can utilize [DynamoDB Streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) or [Kinesis](https://aws.amazon.com/kinesis) streams to make it just THAT more async. There is a built in feature for dynamodb to automatically send destructive (create, update, delete) operations to a DynamoDB or Kinesis stream. So in theory, the API call would simply only insert a record into the database, and then from that, the listener would get invoked bc of this trigger.
  - I think it would have been interesting to use graphql over a REST api here. Harder/more of a learning curve for people to setup who havent used it before, but it does take care of the validation piece. Incoming and outgoing data from API endpoints would all be validated out of the box.
  - Would be cool to set this up on a AWS environment. But this was fun for me, since im much more used to doing this on AWS so learned a lot doing this locally using docker and postgres.

# NPM and Yarn
So I used yarn for dependency management instead of npm. Generally I like some features of yarn over npm. With that said, you might notice we use both yarn and npm in the package json. The reason for this is because only npm supports hooks for scripts, yarn does not. So we use yarn to manage dependencies, and use npm to execute scripts.

# Vizion API Challenge

:wave: Hi there!

In this project, you'll build a simple API that fetches some info about a given URL/webpage and makes the results accessible. This project aims to see how you approach a given problem & set of requirements with little constraint on how to approach it and convey information to your peers.

- [Setting Up](#setting-up)
- [Requirements](#requirements)
- [Bonus Points](#bonus-points)
- [Submitting Your Work](#submitting-your-work)

## Setting Up

To get started, make sure you have Node.js installed. We recommend the [active LTS release](https://nodejs.org/en/about/releases/). 

Afterward, clone this repository. This project contains an empty `index.js` file; you're free to begin working there. If you have another approach in mind, delete this file.

FYI, our stack is largely based on TypeScript & Node.js. We use PostgreSQL for our primary database, but any relational database is fine. **How you tackle this project is entirely up to you!**

## Requirements

Complete the following:

- [Create a New Reference](#1-create-a-new-reference)
- [Process the New Reference](#2-process-the-new-reference)
- [Make the Results Accessible](#3-make-the-results-accessible)
- [Write a Setup Guide](#write-a-setup-guide)

## Develop a [RESTful](https://restfulapi.net/) API 

#### 1. Create a New Reference

- Add an endpoint that accepts a URL in the request body and create and return a new [`Reference`](#reference) record as JSON.
- During this process, you should also initiate an asynchronous task to fetch data from the URL saved in the [`Reference`](#reference). 
  - [More information on fetching data is below](#data-fetching-notes).
- **Note:** The endpoint should return the [`Reference`](#reference) record without waiting for it to be processed.

#### 2. Process the New Reference

- Implement an async worker function that processes the reference. 
  - This function should take a [`Reference`](#reference) as an argument.
- Given the [`Reference`](#reference) `url` field, get the text content from the page's `title` and any `meta` elements (if they exist) with their names and values serialized to create a semi-structured representation of a page's title & metadata.
- Return the data as an object and create a new [`Result`](#result) record in the database, storing the info as JSON or a serialized string into the record's `data` column.

#### 3. Make the Results Accessible

- Add a new GET endpoint that allows a user to fetch results for a given [`Reference`](#reference) ID. 
  - This endpoint should return a list of saved [`Results`](#result) for a given [`Reference`](#reference) as JSON. 
- Don't forget to keep it RESTful and keep [resource naming best practices](https://restfulapi.net/resource-naming/) in mind as you go.

#### Data Fetching Notes

In your processing task, you'll need to fetch the contents of a webpage and extract information from its DOM. To do this, we recommend fetching and working with the page content using browser automation tools like [Puppeteer](https://github.com/puppeteer/puppeteer) or [Playwright](https://playwright.dev/).

> :warning: BEWARE! :warning:

Fetching HTML via HTTP and being able to extract your information without any additional effort is becoming increasingly less common these days with the rise of JS-dependent rendering, SPAs, and other complexities like bot detection or browser fingerprinting. If you'd like to challenge yourself a bit further, check out [ToScrape](https://toscrape.com), which has many great scenarios already laid out and designed for extracting!

### Data Models

#### Reference

A reference is created when a user makes a call to `POST /references`

| Field        | Type        | Description              |
| ------------ | ----------- | ------------------------ |
| `id`         | primary key | the reference identifier |
| `url`        | string      | a valid web address      |
| `created_at` | timestamp   | reference created time   |

#### Result

A result is created after a data fetching task for a `Reference` is completed.

| Field          | Type        | Description                   |
| -------------- | ----------- | ----------------------------- |
| `id`           | primary key | the reference identifier      |
| `reference_id` | foreign key | the related reference         |
| `data`         | json        | Result from the fetching task |
| `created_at`   | timestamp   | result created time           |

## Write a Setup Guide

Document instructions for getting your solution up and running. Your project will be run, tested, and assessed using your instructions—assume no dependencies will be pre-installed other than Docker and Node.

## Bonus Points

Other things that are not required, but we would love to see:

- Test coverage (We tend to use [Jest](https://jestjs.io/))
- Additional validations
- More endpoints (fetch all references, delete a reference & its results, etc.)
- Make use of an actual job queue (Redis, ElasticMQ, etc.)
- Scheduling/interval-based reprocessing of existing references to monitor changes
- Anything else you can think of!

Suppose you don't implement bonus items, no worries. Feel free to share some notes of things you might do and how you might have gone about them given more time.

## Submitting Your Work

> **:bangbang: Commit your changes to the main branch before submitting :bangbang:**

When you have finished the exercise, please create a bundle of your work: 

1. Change to the project root
1. Run `npm run bundle`
    - This will create a bundle file called `take-home-challenge.bundle` based on your local main branch. 
1. Send the file to us via email, or if you received a submission link from your hiring manager, please upload it there.

Thank you, and good luck! :pray:
