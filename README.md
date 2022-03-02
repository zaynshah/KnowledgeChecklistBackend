# KnowledgeChecklistBackend

## Welcome to Our Project!

![GitHub all releases](https://img.shields.io/github/downloads/FahmidulHaquee/WorldBankFrontend/total?logo=GitHub)
![APM](https://img.shields.io/apm/l/npm)
![Twitter Follow](https://img.shields.io/twitter/follow/SigmaLabs?style=social)
![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@babel/core)
![GitHub Sponsors](https://img.shields.io/github/sponsors/FahmidulHaquee)

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Setup](#Setup)
- [User Authentication](#user-authentication)

  - [Creating a session ID](#creating-a-session-id)
  - [Find a current user’s ID](#find-a-current-users-id)
  - [Registering a user](#registering-a-user)
  - [Validating a user log-in](#validating-a-user-log-in)

- [Database Schema](#database-schema)
- [License](#license)
- [Developers](#developers)

## Introduction

## Technologies

This repository uses [deno](https://deno.land/manual/getting_started/installation) to run its files.
For our database we use [PostgreSQL](https://www.postgresql.org/) to store data.
To deploy the server, this repository is using.. ()

## Setup

There is another repository which is closely related and can be found [here](https://github.com/olliecase-green/KnowledgeChecklistFrontend). It is recommended that you create a folder and clone both the frontend and backend repos into the same folder.

Start by forking this backend repository, and then cloning the repository into your local drive. Toggle into the directory, /KnowledgeChecklistBackEnd, and run the following command into your terminal to initiate the backend server:

```
deno run --allow-net --allow-read --allow-write server.js
```

The frontend React application requires this backend server to be running to work correctly. Now, relevant requests will be made from the frontend React app using the fetch API.

## User Authentication

### Creating a session ID

### Registering a user

### Validating a user log-in

## Database Schema

## License

The license for this project can be found [here](license.md)

The Developers that worked on this project are:

Project Manager & Engineer: [Fahmidul Haque](https://github.com/FahmidulHaquee)
System Architect & Engineer: [Oliver-case Green](https://github.com/olliecase-green)
Quality Assurance & Engineer: [Zayn Shah](https://github.com/zaynshah)
