# HairBnB

A full-stack Airbnb-inspired marketplace for discovering, creating, editing, and reviewing property listings.

HairBnB is built around a modular Node.js/Express backend with MongoDB persistence, server-rendered EJS views, Passport-based local authentication, Joi validation, reusable middleware, Mongo-backed sessions, and Cloudinary-backed image uploads.

> **Project status:** Core authentication, authorization, listing CRUD, reviews, validation, sessions, and image upload/storage flows are implemented. Booking functionality is the next major backend feature.

## Features

- **User authentication** with local username/password authentication through Passport.
- **Session-based authentication** with Passport serialization/deserialization.
- **MongoDB-backed sessions** using `connect-mongo`.
- **Authorization middleware** for protected account and listing actions.
- **Listings CRUD** for creating, viewing, editing, and deleting listings.
- **Listing ownership checks** to protect listing management actions.
- **Listing validation** using Joi middleware before data reaches the database.
- **Image uploads** using Multer with `multipart/form-data` handling.
- **Cloudinary storage** for uploaded listing images, with the resulting Cloudinary URL stored on the listing.
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
| Authentication | Passport.js, Passport Local |
| Validation | Joi |
| Sessions | Express Session, connect-mongo |
| File Uploads | Multer |
| Image Storage | Cloudinary, multer-storage-cloudinary |
| Password Authentication | passport-local-mongoose, bcryptjs |
| Utilities | dotenv, connect-flash, cors |
| Development | Nodemon |

## Architecture

The backend follows a layered, MVC-inspired structure that separates routing, persistence, middleware, validation, utilities, services, and presentation.

```text
HairBnB/
└── hairbnb-backend/
    ├── server.js                 # Application entry point
    └── src/
        ├── app.js                # Express configuration and middleware
        ├── config/
        │   ├── db.js             # MongoDB connection
        │   └── cloudConfig.js     # Cloudinary + Multer storage configuration
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

For a normal listing creation request:

```text
Browser form
    │
    │ multipart/form-data
    ▼
Express Router
    │
    ├── Authentication
    │
    ▼
Multer + CloudinaryStorage
    │
    ├── req.body  ← text form fields
    └── req.file  ← uploaded file + Cloudinary metadata
    │
    ▼
Joi validation
    │
    ▼
Route handler
    │
    ├── req.file.path → Cloudinary image URL
    └── req.body      → listing fields
    │
    ▼
Mongoose
    │
    ▼
MongoDB
    │
    ▼
EJS view / redirect / error handler
```

The repository separates routes, models, services, middleware, schemas, utilities, and views, allowing the project to scale beyond a single-file Express application.

## Core Routes

### Authentication

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/signup` | Render registration page |
| `POST` | `/signup` | Register a new user |
| `GET` | `/login` | Render login page |
| `POST` | `/login` | Authenticate using Passport Local |
| `GET` | `/logout` | End the current session |

### Users / Profiles

User routes are mounted under `/profile/:user` and use authentication plus account-ownership authorization where required. fileciteturn110file0L2-L2

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/profile/:user` | View a user's profile |
| `GET` | `/profile/:user/delete` | Render the account deletion page for the account owner |
| `POST` | `/profile/:user/delete` | Delete the account after authorization |

The user router uses `mergeParams: true` so it can access the `:user` parameter from the parent route. fileciteturn111file0L2-L2

### Listings

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/listings` | View all listings |
| `GET` | `/listings/form` | Open listing creation form |
| `POST` | `/listings/submit` | Validate, upload image, and create a listing |
| `GET` | `/listings/:id` | View a listing and its reviews |
| `GET` | `/listings/:id/edit` | Open listing edit form |
| `POST` | `/listings/:id/edit` | Validate, optionally replace image, and update a listing |
| `POST` | `/listings/:id/delete` | Delete a listing |

### Reviews

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/listings/:id/reviews` | Create a review |
| `POST` | `/listings/:id/reviews/:reviewId` | Delete an owned review |

## Image Upload Pipeline

Listing images use Multer with Cloudinary storage.

```text
<input type="file" name="image">
          │
          ▼
upload.single("image")
          │
          ▼
CloudinaryStorage
          │
          ▼
Cloudinary
          │
          ▼
req.file.path
          │
          ▼
Cloudinary image URL
          │
          ▼
Listing.image
```

The HTML form uses `enctype="multipart/form-data"`. Multer parses the multipart request, CloudinaryStorage uploads the file, and the resulting URL is available through `req.file.path`.

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

A listing contains:

- `title`
- `description`
- `image` containing the Cloudinary URL
- `price`
- `location`
- `country`
- `user` reference to the owner

### User

Users support local Passport authentication.

### Review

Reviews reference both the listing being reviewed and the user who created the review. Each review stores a comment, rating, and creation timestamp.

### Booking

A booking model and route structure are present as part of the project's planned marketplace architecture, but the full booking workflow is not yet implemented.

## Authentication & Authorization

HairBnB currently uses Passport for local authentication with `passport-local` and `passport-local-mongoose`.

Sessions are maintained with `express-session` and persisted in MongoDB using `connect-mongo`. Passport handles serialization/deserialization of the authenticated user.

Authorization is handled separately from authentication. Examples include:

- authenticated-only listing management
- listing ownership checks through `listingAuth`
- account ownership checks through `accountAuth`
- review ownership checks before deletion

This keeps the distinction clear:

```text
Authentication → Who is the user?
Authorization  → Is this user allowed to perform this action?
```

## Validation & Error Handling

Input validation is handled separately from routing with Joi schemas and validation middleware. For multipart listing routes, Multer runs before validation so `req.body` and `req.file` are available to downstream middleware.

Asynchronous route handlers are wrapped with a reusable `asyncHandler` utility, while application errors can be represented with the custom `ApiError` class.

The main router also provides centralized handling for unknown routes and application errors.

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js 18+
- MongoDB Atlas or a local MongoDB instance
- npm
- A Cloudinary account for listing image uploads

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
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Cloudinary credentials are required for listing image uploads. A MongoDB connection string and session secret are required for the application to run with persistent sessions.

### 4. Start the server

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
| `MONGO_URI` | Yes | MongoDB connection string |
| `SESSION_SECRET` | Yes | Express session signing secret |
| `CLOUD_NAME` | For image uploads | Cloudinary cloud name |
| `CLOUD_API_KEY` | For image uploads | Cloudinary API key |
| `CLOUD_API_SECRET` | For image uploads | Cloudinary API secret |

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
- Run Multer before validation for multipart routes so uploaded files and form fields are available downstream.
- Reuse middleware for authentication, authorization, and request validation.
- Centralize asynchronous error propagation instead of duplicating `try/catch` blocks.
- Store uploaded binary assets in Cloudinary rather than MongoDB.
- Persist Express sessions in MongoDB rather than the default in-memory store.
- Keep views and public assets separate from backend logic.

## Current Scope & Roadmap

The current repository establishes the foundation for a broader rental marketplace. Natural next steps include:

- Complete the booking workflow and associated controllers/services.
- Add availability checks and prevent overlapping bookings.
- Add search, filtering, sorting, and pagination.
- Support multiple listing images and Cloudinary asset cleanup on replacement/deletion.
- Add Google OAuth 2.0 authentication.
- Add stronger production security settings for sessions, cookies, secrets, and rate limiting.
- Add automated tests for routes, validation, authentication, uploads, and database behavior.
- Add deployment configuration for hosted MongoDB, Cloudinary, and a production server.

## Why This Project?

HairBnB is designed as a practical backend engineering project rather than a single-file CRUD demo. It explores authentication, authorization, relational document modeling, validation, middleware composition, persistent sessions, file uploads, cloud storage, error handling, and an MVC-inspired application structure in a real marketplace-style domain.

## Future Scope

Planned extensions include:

- **Google OAuth 2.0** for social login and account creation.
- **Booking and availability management** with conflict prevention.
- **Advanced listing discovery** through search, filtering, sorting, pagination, and geolocation.
- **Multiple image support** with complete Cloudinary asset lifecycle management.
- **Production hardening** including secure cookies, rate limiting, monitoring, and automated tests.

## License

This project currently uses the `ISC` license as defined in `package.json`.

## Author

**Mayhaul**  
GitHub: [@Mayhaul](https://github.com/Mayhaul)
