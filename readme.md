<div align="left">
    <div style="display: inline-block;">
        <h2 style="display: inline-block; vertical-align: middle; margin-top: 0;">LETSDELIVERY DESAFIO NODEJS</h2>
        <p>
	<img src="https://img.shields.io/github/languages/top/felipetrevisan/letsdelivery-desafio-nodejs-aws?style=flat-square&color=A931EC" alt="repo-top-language">
</p>
        <p>Built with the tools and technologies:</p>
        <p>
	<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat-square&logo=npm&logoColor=white" alt="npm">
	<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat-square&logo=Prettier&logoColor=black" alt="Prettier">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=flat-square&logo=Zod&logoColor=white" alt="Zod">
</p>
    </div>
</div>

##  Overview
This is a simple REST API built with Node.js and TypeScript, featuring Zod for data validation. It leverages the Serverless Framework to deploy AWS Lambda functions, exposed via API Gateway, and uses DynamoDB for data storage.

---
##  Getting Started
###  Prerequisites

Before getting started with **letdelivery-desafio-nodejs-aws**, make sure your environment meets the following requirements:

- Node.js (version 22 or later)
- DynamoDB (local or AWS instance)
- Docker (for local testing)

###  Installation

Install **letsdelivery-desafio-nodejs-aws** using one of the following methods:

1. Clone the repository:
```sh
❯ git clone https://github.com/felipetrevisan/letsdelivery-desafio-nodejs-aws
```

2. Install the project dependencies:

**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
npm ci
```

###  Running Tests
To run the tests and see code coverage, use:

#### Creating Test Table
```sh
aws dynamodb create-table --table-name clients-test --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000
```

#### Running DynamoDB Local
```sh
docker-compose up
```

#### Executing Tests
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
npm test
```
This will execute the tests defined in the project and provide a coverage report.


###  Running the Project

To creating table Table
```sh
aws dynamodb create-table --table-name clients --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000
```

To initialize the DynamoDB locally, run:
```sh
docker-compose up
```

To initialize the project offline, run:

**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)
```sh
npm run start:offline
```

The server will start, and you can access the API on http://localhost:4000 (or your specified port).

###  API Endpoints
Here are the available routes for performing CRUD operations on customers:

- Create a Client (POST)
```sh
curl -X POST http://localhost:4000/clients \
-H "Content-Type: application/json" \
-d '{ "name": "John Doe", "birthDate": "1992-01-20", "contacts": [{ "type": "phone", "value": "11123456789" }] }'
```

- Retrieve All Clients (GET)
```sh
curl http://localhost:4000/clients
```

- Retrieve a Client by ID (GET)
```sh
curl http://localhost:4000/clients/<client_id>
```

- Update a Client (PUT)
```sh
curl -X PUT http://localhost:4000/clients/<client_id> \
-H "Content-Type: application/json" \
-d '{"name": "Jane Doe", "phone": "987654321"}'
```

- Delete a Client (DELETE)
```sh
curl http://localhost:4000/clients/<client_id>
```

## Acknowledgments
[Serverless Framework](https://www.serverless.com/) – For simplifying the deployment and management of cloud applications.
[Amazon DynamoDB](https://aws.amazon.com/pt/pm/dynamodb) – A scalable NoSQL database used for efficient data storage and retrieval.
[Node.js Test Runner](https://nodejs.org/) – The built-in test framework in Node.js, enabling seamless testing and automation.