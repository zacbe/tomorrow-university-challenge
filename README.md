This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

```bash
# Install dependencies
$ npm install

# Run the development server with docker
$ npm run compose:up

# Copy the .env.example file to .env
$ cp .env.example .env
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data models

The data models are based on the initial requirements of the project and adapted for easier implementation.

Both lessons and challenges have a many-to-many relationship, so they reference each other. You can see it as an array of ids in the model.

This allows for a more flexible data model, where lessons can belong multiple challenges and challenges can contain multiple lessons.

This also improves lazy-loading, as we can load the lessons and challenges separately and only load the related data when needed based on the ids.

### Lessons

```json
{
  "id": "ObjectId",
  "title": "Lesson 1",
  "description": "Description of lesson 1",
  "content": "Content of lesson 1",
  "challenges": [
    {
      "id": "string"
    }
    ...
  ]
}
```

### Challenges

```json
{
  "id": "ObjectId",
  "title": "Challenge 1",
  "description": "Description of challenge 1",
  "content": "Content of challenge 1",
  "lessons": [
    {
      "id": "string"
    }
    ...
  ]
}
```

## API

The API is a simple REST API with the following endpoints:

### Lessons

- `GET /api/lessons`: Get all lessons with query parameters for pagination and filtering
  - `filter`: List of ids to filter by
  - `page`: Page number
  - `limit`: Number of items per page
- `GET /api/lessons/:id`: Get a lesson by id
- `POST /api/lessons`: Create a new lesson
- `DELETE /api/lessons/:id`: Delete a lesson by id

### Challenges

- `GET /api/challenges`: Get all challenges with query parameters for pagination and filtering
  - `filter`: List of ids to filter by
  - `page`: Page number
  - `limit`: Number of items per page
- `GET /api/challenges/:id`: Get a challenge by id
- `POST /api/challenges`: Create a new challenge
- `DELETE /api/challenges/:id`: Delete a challenge by id

## Database
The database is a MongoDB database with two collections: `lessons` and `challenges`. The collections are created automatically when the server starts. The database is connected using the `MONGODB_URI` environment variable.

```bash
# Seed db with initial data
$ npm run seed
```

## Docker
The project includes a `Dockerfile` and `docker-compose.yml` file for easy development and deployment. The `Dockerfile` is based on the `18-alpine` image and installs the dependencies and runs the server. The `docker-compose.yml` file defines the services for the server and the MongoDB database.
