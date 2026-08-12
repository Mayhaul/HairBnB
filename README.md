# HairBnB

A full-stack Airbnb-inspired marketplace for discovering, creating, editing, and reviewing property listings.

HairBnB is built around a modular Node.js/Express backend with MongoDB persistence, server-rendered EJS views, Passport-based authentication, Joi validation, and reusable middleware/utilities.

> **Project status:** Core listing, authentication, review, validation, and session flows are implemented. Booking-specific files and service/controller placeholders are present in the current codebase and can be extended as the application grows.

## Features

- **User authentication** with local username/password authentication through Passport.
- **Google OAuth 2.0 login** with automatic account creation for first-time Google users.
- **Session-based authentication** with Passport serialization/deserialization.
- **Listings CRUD** for creating, viewing, editing, and deleting listings.
- **Listing validation** using Joi middleware before data reaches the database.
- **Reviews and ratings** attached to listings, with ratings constrained to 0–5.
- **Review ownership checks** so users can delete only their own reviews.
- **Protected routes** that redirect unauthenticated users to login and preserve the original destination.
- **Flash messages** for authentication and application feedback.
- **Centralized error handling** with a custom API error utility and async route wrapper.
- **Server-rendered UI** using EJS and EJS-Mate.
- **MongoDB data modeling** with Mongoose relationships between users, listings, and reviews.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Backend | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Templating | EJS, EJS-Mate |
| Authentication | Passport.js, Passport Local, Google OAuth 2.0 |
| Validation | Joi |
| Sessions | Express Session |
| Password Authentication | passport-local-mongoose, bcryptjs |
| Utilities | dotenv, connect-flash, cors |
| Development | Nodemon |

## Architecture

The backend follows a layered, MVC-inspired structure that separates routing, business logic, persistence, middleware, and presentation.

```text
HairBnB/
└── hairbnb-backend/
    ├── server.js                 # Application entry point
    └── src/
        ├── app.js                # Express configuration and middleware
        ├── config/
        │   └── db.js             # MongoDB connection
        ├── controllers/          # Controller layer
        ├── middlewares/
        │   ├── auth.middleware.js
        │   ├── error.middleware.js
        │   └── validation.middleware.js
        ├── models/
        │   ├── User.model.js
        │   ├── Listing.model.js
        │   ├── Booking.model.js
        │   └── review.model.js
        ├── routes/
        │   ├── index.js
        │   ├── auth.routes.js
        │   ├── listing.routes.js
        │   ├── review.routes.js
        │   ├── booking.routes.js
        │   └── home.routes.js
        ├── schemas/              # Joi validation schemas
        ├── services/             # Service layer
        ├── utils/
        │   ├── ApiError.js
        │   └── asyncHandler.js
        ├── views/                # EJS templates
        └── public/               # CSS and client-side JavaScript
```

### Request flow

```text
HTTP Request
     │
     ▼
 Express Router
     │
     ├── Authentication / Authorization middleware
     ├── Joi validation middleware
     │
     ▼
 Controller / Route Handler
     │
     ▼
 Service Layer
     │
     ▼
 Mongoose Models
     │
     ▼
 MongoDB
     │
     ▼
 EJS View / Redirect / Error Handler
```

The repository already separates routes, models, services, middleware, schemas, utilities, and views, giving the project a structure that can scale beyond a single-file Express application.

## Core Routes

### Authentication

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/signup` | Render registration page |
| `POST` | `/signup` | Register a new user |
| `GET` | `/login` | Render login page |
| `POST` | `/login` | Authenticate using Passport Local |
| `GET` | `/logout` | End the current session |
| `GET` | `/auth/google` | Start Google OAuth flow |
| `GET` | `/auth/google/callback` | Handle Google OAuth callback |

### Listings

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/listings` | View all listings |
| `GET` | `/listings/form` | Open listing creation form |
| `POST` | `/listings/submit` | Create a listing |
| `GET` | `/listings/:id` | View a listing and its reviews |
| `GET` | `/listings/:id/edit` | Open listing edit form |
| `POST` | `/listings/:id/edit` | Update a listing |
| `POST` | `/listings/:id/delete` | Delete a listing |

### Reviews

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/listings/:id/reviews` | Create a review |
| `POST` | `/listings/:id/reviews/:reviewId` | Delete an owned review |

## Data Model

The current application models the main marketplace relationships with MongoDB/Mongoose:

```text
User
 │
 ├── creates / owns listings
 │
 └── writes reviews
          │
Listing ──┘
```

### Listing

A listing contains a title, description, image metadata, price, location, country, and an optional user reference.

### User

Users support local Passport authentication and can also be associated with a Google account through `googleId`.

### Review

Reviews reference both the listing being reviewed and the user who created the review. Each review stores a comment, rating, and creation timestamp.

## Authentication & Authorization

HairBnB uses Passport to support two authentication strategies:

1. **Local authentication** using `passport-local` and `passport-local-mongoose`.
2. **Google OAuth 2.0** using `passport-google-oauth20`.

Protected actions pass through authentication middleware. When an unauthenticated user attempts a protected action, the application stores the intended destination and redirects the user to the login page. After authentication, the flow can return the user to the original page.

Review deletion also includes an ownership check so a logged-in user cannot delete another user's review.

## Validation & Error Handling

Input validation is handled separately from routing with Joi schemas and validation middleware. Asynchronous route handlers are wrapped with a reusable `asyncHandler` utility, while application errors can be represented with the custom `ApiError` class.

The main router also provides a centralized fallback for unknown routes and renders a dedicated error page for application errors.

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js 18+
- MongoDB running locally
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Mayhaul/HairBnB.git
cd HairBnB/hairbnb-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `hairbnb-backend/`.

```env
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

The Google credentials are required for the Google OAuth flow. Local authentication does not require Google credentials.

### 4. Start MongoDB

The current database configuration connects to:

```text
mongodb://127.0.0.1:27017/hairbnb
```

Start your local MongoDB instance before starting the application.

### 5. Start the server

Development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The server listens on the port specified by `PORT`.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Yes | HTTP server port |
| `GOOGLE_CLIENT_ID` | For Google login | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google login | Google OAuth client secret |

> **Security:** Never commit real credentials or secrets to Git. Keep `.env` local and use `.env.example` as the template for environment configuration.

## Development Scripts

```bash
npm run dev    # Start with Nodemon
npm start      # Start with Node
```

## Project Design Principles

- Keep HTTP concerns in routes/controllers and reusable application logic in services.
- Keep persistence concerns inside Mongoose models.
- Validate incoming data before database operations.
- Reuse middleware for authentication, authorization, and request validation.
- Centralize asynchronous error propagation instead of duplicating `try/catch` blocks.
- Keep views and public assets separate from backend logic.

## Current Scope & Roadmap

The current repository establishes the foundation for a broader rental marketplace. Natural next steps include:

- Complete the booking workflow and associated controllers/services.
- Associate listings with their creators and enforce owner-level listing permissions.
- Add search, filtering, sorting, and pagination.
- Add image upload/storage instead of URL-only image metadata.
- Add stronger production security settings for sessions, cookies, and secrets.
- Add automated tests for routes, validation, authentication, and database behavior.
- Add deployment configuration for a hosted MongoDB instance and production server.

## Why This Project?

HairBnB is designed as a practical backend engineering project rather than a single-file CRUD demo. It explores authentication, authorization, relational document modeling, validation, middleware composition, sessions, OAuth, error handling, and an MVC-inspired application structure in a real marketplace-style domain.

## License

This project currently uses the `ISC` license as defined in `package.json`.

## Author

**Mayhaul**  
GitHub: [@Mayhaul](https://github.com/Mayhaul)
