# MyNotes

A very simple full-stack note board application, written for sandboxing and demonstration purposes.

It showcases the MERN stack, specially the front-end bit, since front-end development is my main area of interest and one I'm passionate about.

Below is a breakdown of the most relevant application features:

### Front-end

- TypeScript code for static type checking
- State management using Redux Toolkit (with RTK Query and Reselect)
- Form building and validation using React Hook Form
- Tailwind CSS styling (with Headless UI and Heroicons)
- Accessibility by using ARIA roles and attributes and by ensuring color contrast
- Global error handling
- Test suite using Jest, React Testing Library and Mock Service Worker

### Back-end

- Data modelling and validation using mongoose
- Authentication using JWTs
- Global error handling

## Running locally

### Prerequisites

Building and running the application locally requires Node.js 20+ and either MongoDB Community Edition 6+ or a MongoDB Atlas account.

### Install dependencies

Run `npm install` in both the "backend" and "frontend" directories. This will install all the needed packages for both the back-end and front-end projects.

### Environment variables

Create a "nodemon.json" file in the "backend" folder with the following structure, which contains the address of the MongoDB instance and the secret key that will be used to encode JWT tokens:

```
{
  "env": {
    "MONGODB_URI": "your-mongodb-instance-address",
    "JWT_SECRET": "your-secret-goes-here"
  }
}
```

Typically, a local MongoDB instance address looks like `mongodb://127.0.0.1:27017/mynotes`. If you're using MongoDB Atlas, use the connection string that is provided for your instance.

### Build and start

Run `npm run start` in the "backend" directory to start the development server for the API.

Run `npm run start` in the "frontend" directory to build the front-end application and start the development server. The application can be accessed via http://localhost:3000.

### Testing

Run `npm run test` in the "frontend" directory to run the test suite for the front-end application.
