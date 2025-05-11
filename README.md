# Ortask Client Side

Backend for ortask client, this is where the controllers, routes, services, and models use.

## Features

- Authentication Route
- Authentication Middlware
- Zod parse middleware
- Error and unknow enpoint middleware
- Asynchandler for asynchronus controllers/routes
- Create and login user controller
- Create, remove, update, get task controller
- Email Verification Controller
- Custom Utilities

## Technologies

### Backend Core

- **Express JS**: A fast, unopinionated web framework for Node.js that simplifies building web applications and APIs
- **Node JS**: A JavaScript runtime environment that executes JavaScript code outside a web browser
- **MongoDB**: A NoSQL database that provides high performance, high availability, and easy scalability
- **Mongoose**: An elegant MongoDB object modeling tool designed to work in an asynchronous environment
- **Nodemailer**: A module for Node.js applications to allow easy email sending
- **Zod**: A TypeScript-first schema validation library with static type inference
- **Dotenv**: A zero-dependency module that loads environment variables from a .env file
- **Cookie-parser**: A middleware that parses cookies attached to the client request
- **jsonwebtoken**: An implementation of JSON Web Tokens for authentication and information exchange

## Getting Started

1. Clone the repository
2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

## Project Structure

```
otasks-backend/
├── src/
│   ├── controllers/          # Route controllers
│   ├── models/               # MongoDB Models
│   ├── routes/               # API Routes
│   ├── utils/                # Custom Utilities
│   ├── template/             # Email verification template
│   ├── app.ts                # Main backend connection and setup
│   ├── index.ts              # App connection
│   └── types.ts              # Typescript interface
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server (Your port in env)
- `npm run lint` - Run ESLint
- `npm run tsc` - Run typescript

## 📄 Licenses

This project is open source and available under the [MIT License](LICENSE).
