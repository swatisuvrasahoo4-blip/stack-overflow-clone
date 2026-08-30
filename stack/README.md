# Code Quest - Stack Overflow Clone

Code Quest is a full-stack developer community platform built with Next.js, TypeScript, Node.js, Express.js, and MongoDB.

It extends the traditional Stack Overflow question-and-answer experience with a community feed, reputation system, premium subscriptions, multilingual support, notifications, content moderation, and advanced login security.

## Live Demo

https://stack-overflow-clone-86r8.vercel.app/

## Features

- Question and answer system
- Upvote and downvote functionality
- Accepted answers
- Community feed for technical updates, code snippets, images, project showcases, and learning achievements
- Likes, comments, replies, sharing, and bookmarks
- Follow and unfollow users
- Trending and Following feeds
- Hashtags and user mentions
- Notifications for likes, comments, mentions, and followers
- Post reporting and admin moderation
- Forgot password using email or phone number
- Password generator
- Free, Bronze, Silver, and Gold subscription plans
- Reputation rewards and penalties
- Reputation transfer and activity history
- Reputation-based community privileges
- English, Spanish, Hindi, Portuguese, Chinese, and French support
- Email OTP verification for switching to French
- Mobile OTP verification for other supported languages
- New-device OTP verification
- Trusted-device management
- Active session management and remote session revocation
- Advanced search and filtering
- Cursor-based server-side pagination
- Infinite scrolling

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- i18next
- react-i18next

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Other Services

- Cloudinary
- Email and OTP verification
- Subscription and payment integration

## Project Structure

```text
stack-overflow/
├── stack/              # Next.js frontend
├── server/             # Node.js and Express backend
├── docker-compose.yml
└── .gitignore
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd stack-overflow
```

### 2. Install Frontend Dependencies

```bash
cd stack
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Environment Variables

The project contains example environment files:

```text
stack/.env.example
server/.env.example
```

Create your actual environment files from these examples.

Frontend:

```text
stack/.env.local
```

Backend:

```text
server/.env
```

Add the required values to these files.

> Never commit `.env` or `.env.local` files containing credentials or secrets.

### 5. Run the Backend

From the `server` directory:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Run the Frontend

From the `stack` directory:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Run with Docker

Make sure Docker Desktop is running.

From the root directory of the project:

```bash
docker compose up --build
```

After the containers start:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

To stop the containers:

```bash
docker compose down
```

## Multilingual Support

Code Quest supports six languages:

- English
- Spanish
- Hindi
- Portuguese
- Chinese
- French

Switching to French requires email OTP verification.

Switching to the other supported languages requires mobile OTP verification.

## Subscription Plans

The platform provides four subscription levels:

- Free
- Bronze
- Silver
- Gold

Premium plans provide additional benefits such as increased question limits, advanced filters, badges, priority support, enhanced profile visibility, and other premium features.

## Reputation System

Users can earn or lose reputation based on their activity on the platform.

Reputation is used to unlock community privileges such as commenting, editing community posts, voting to close questions, and reporting content.

The platform also supports reputation transfers and reputation activity history.

## Security

Code Quest includes additional account and device security features such as:

- Email and mobile OTP verification
- New-device verification
- Trusted-device management
- Active session tracking
- Remote session revocation
- Login activity tracking
- Password reset functionality

## Pagination and Performance

The application uses cursor-based server-side pagination and infinite scrolling to efficiently load questions and community posts.

## Deployment

The frontend is deployed on Vercel.

MongoDB Atlas is used for the cloud database.

## Author

Swati Suvra Priyadarshine Sahoo

Full Stack Web Developer