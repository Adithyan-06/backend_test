# Task CRUD API

A simple REST API built using **Node.js** and **Express.js** that performs CRUD operations on an in-memory list of tasks. The API is documented using **Swagger UI**.


## Requirements

* Node.js
* npm

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
node server.js 
```

## API Endpoints

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/tasks`     | Get all tasks     |
| GET    | `/tasks/:id` | Get a task by ID  |
| POST   | `/tasks`     | Create a new task |
| PUT    | `/tasks/:id` | Update a task     |
| DELETE | `/tasks/:id` | Delete a task     |

## Swagger Documentation

After starting the server, open:

```text
http://localhost:3000/docs
```

You can test all API endpoints using Swagger UI's **Try it out** feature.


