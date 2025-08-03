# MyNotes

A very simple full-stack note board application, written for sandboxing and demonstration purposes.

It showcases the MERN stack, especially the frontend bit, since frontend development is my main area of interest and one I'm passionate about.

Below is a breakdown of the most relevant application features:

### Frontend

- TypeScript code for static type checking
- Redux Toolkit (with RTK Query and Reselect) for state management
- React Hook Form for form building and validation
- styled-components for styling (with Headless UI and Heroicons), including creation of a theme
- Accessibility features, including the use of semantic HTML, ARIA roles and attributes, and sufficient color contrast for readability
- Global error handling
- Test suite using Jest, React Testing Library and Mock Service Worker

### Backend

- mongoose for data modelling and validation
- JWTs for authentication
- Global error handling

This is a personal project so I'm not accepting contributions at the moment.

## Running Locally

### Prerequisites

Building and running the application locally requires Node.js 20+ and either MongoDB Community Edition 6+ or a MongoDB Atlas account.

### Install Dependencies

Run `npm install` in both the "backend" and "frontend" directories. This will install all the needed packages for both the backend and frontend projects.

### Environment Variables

Create a "nodemon.json" file in the "backend" folder with the following structure, which contains the address of the MongoDB instance and the secret key that will be used to encode JWT tokens:

```
{
  "env": {
    "MONGODB_URI": "your-mongodb-instance-address-goes-here",
    "JWT_SECRET": "your-secret-goes-here"
  }
}
```

Typically, a local MongoDB instance address looks like `mongodb://127.0.0.1:27017/your-database-name-goes-here`. If you're using MongoDB Atlas, use the connection string that is provided by the platform for your instance.

### Build and Start

Run `npm run start` in the "backend" directory to start the development server for the API.

Run `npm run start` in the "frontend" directory to build the frontend application and start the development server. The application can be accessed via http://localhost:3000.

### Testing

Run `npm run test` in the "frontend" directory to run the test suite for the frontend application.

## Next Steps

- Deploy the application
- Implement CI/CD to automate deployment with GitHub Actions
- Implement containerization with Docker

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
