# Spotify Forum

A social media platform that uses Spotify OAuth to give users a place to discuss music.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## Installation

Instructions on how to install and set up your project. Include any dependencies that need to be installed.

## Usage

Provide examples and instructions on how to use your project. Include any relevant code snippets or screenshots.

## Features

List the main features of your project. Highlight any unique or noteworthy functionalities.
### Forum

#### Forum Creation and Listing:

- Users can create new forums with a name.
- Display a list of available forums for users to choose from.

#### Post Creation and Listing:

- Users can create new posts within a selected forum with a title and description.
- Display a list of posts for a selected forum.

#### Commenting System:

- Users can add comments to a selected post.
- Display comments associated with a post.

#### Like Functionality:

- Users can like posts and comments, which updates the like count in real-time.
-The likes are persisted in the database and updated optimistically on the client side.

#### Data Fetching and State Management:

- We use the useContext to hook to store the user's Spotify API token in local storage.
- In all other cases we use useEffect() hooks to fetch and cache data from the API.

## How to Extend the Project

Provide code snippets and relevant documentation on how to build more features.

## API Documentation

This API provides various endpoints to interact with Spotify data, manage user information, and handle forum posts and comments. The API is built using Express.js and integrates with Spotify's Web API and Firebase for data storage.

### Base URL
```
http://localhost:8000
```

### Authentication

#### Login
- **Endpoint:** `/auth/login`
- **Method:** `GET`
- **Description:** Redirects the user to Spotify's authorization page.
- **Parameters:**
  - `state` (optional): A random string to maintain state between the request and callback.

#### Callback
- **Endpoint:** `/auth/callback`
- **Method:** `GET`
- **Description:** Handles the callback from Spotify after user authorization.
- **Parameters:**
  - `code` (required): The authorization code returned by Spotify.
  - `state` (required): The state parameter to prevent CSRF attacks.

#### Refresh Token
- **Endpoint:** `/auth/refresh_token`
- **Method:** `GET`
- **Description:** Refreshes the Spotify access token.
- **Parameters:**
  - `refresh_token` (required): The refresh token to obtain a new access token.

### User

#### Get User Information
- **Endpoint:** `/user`
- **Method:** `GET`
- **Description:** Retrieves user information from the database.
- **Parameters:**
  - `id` (required): The user ID.

#### Get All Users
- **Endpoint:** `/user/all`
- **Method:** `GET`
- **Description:** Retrieves information for all users.

#### Update User Bio
- **Endpoint:** `/user`
- **Method:** `POST`
- **Description:** Updates the user's bio.
- **Parameters:**
  - `id` (required): The user ID.
  - `bio` (required): The new bio.

### Spotify Data

#### Get User's Top Artists
- **Endpoint:** `/artist`
- **Method:** `GET`
- **Description:** Retrieves the user's top artists from Spotify.
- **Parameters:**
  - `spotify_token` (required): The Spotify access token.
  - `num_artists` (optional): Number of top artists to retrieve (default is 10).
  - `timeframe` (required): Time range for top artists. Valid values are "short_term", "medium_term", and "long_term".

#### Get User's Top Tracks
- **Endpoint:** `/song`
- **Method:** `GET`
- **Description:** Retrieves the user's top tracks from Spotify.
- **Parameters:**
  - `spotify_token` (required): The Spotify access token.
  - `num_songs` (optional): Number of top tracks to retrieve (default is 10).
  - `timeframe` (required): Time range for top tracks. Valid values are "short_term", "medium_term", and "long_term".

#### Get User's Liked Tracks
- **Endpoint:** `/song/liked`
- **Method:** `GET`
- **Description:** Retrieves the user's liked tracks from Spotify.
- **Parameters:**
  - `spotify_token` (required): The Spotify access token.
  - `num_songs` (optional): Number of liked tracks to retrieve (default is 50).

### Forum

#### Create Forum
- **Endpoint:** `/forum`
- **Method:** `POST`
- **Description:** Creates a new forum.
- **Parameters:**
  - `name` (required): The name of the forum.

#### Get All Forums
- **Endpoint:** `/forums`
- **Method:** `GET`
- **Description:** Retrieves all forums.

#### Get Forum by ID
- **Endpoint:** `/forums/:forumId`
- **Method:** `GET`
- **Description:** Retrieves a specific forum by ID.
- **Parameters:**
  - `forumId` (required): The ID of the forum.

#### Create Post in Forum
- **Endpoint:** `/forums/:forumId/posts`
- **Method:** `POST`
- **Description:** Creates a new post in a specific forum.
- **Parameters:**
  - `forumId` (required): The ID of the forum.
  - `title` (required): The title of the post.
  - `description` (required): The description of the post.
  - `userId` (required): The ID of the user creating the post.

#### Get Posts in Forum
- **Endpoint:** `/forums/:forumId/posts`
- **Method:** `GET`
- **Description:** Retrieves all posts in a specific forum.
- **Parameters:**
  - `forumId` (required): The ID of the forum.

#### Get Comments for a Post
- **Endpoint:** `/forums/:forumId/posts/:postId/comments`
- **Method:** `GET`
- **Description:** Retrieves all comments for a specific post.
- **Parameters:**
  - `forumId` (required): The ID of the forum.
  - `postId` (required): The ID of the post.

#### Add Comment to a Post
- **Endpoint:** `/forums/:forumId/posts/:postId/comments`
- **Method:** `POST`
- **Description:** Adds a new comment to a specific post.
- **Parameters:**
  - `forumId` (required): The ID of the forum.
  - `postId` (required): The ID of the post.
  - `text` (required): The text of the comment.
  - `userId` (required): The ID of the user adding the comment.

#### Like a Post
- **Endpoint:** `/forums/:forumId/posts/:postId/like`
- **Method:** `POST`
- **Description:** Likes a specific post.
- **Parameters:**
  - `forumId` (required): The ID of the forum.
  - `postId` (required): The ID of the post.

#### Like a Comment
- **Endpoint:** `/forums/:forumId/posts/:postId/comments/:commentId/like`
- **Method:** `POST`
- **Description:** Likes a specific comment.
- **Parameters:**
  - `forumId` (required): The ID of the forum.
  - `postId` (required): The ID of the post.
  - `commentId` (required): The ID of the comment.

### Firebase Initialization

The Firebase initialization is handled in the `firebase.js` file, which sets up the connection to the Firestore database using the service account credentials.

### Example Usage

To use the API, ensure that you have the necessary environment variables set up, including `CLIENT_ID`, `SECRET_ID`, and Firebase service account credentials in a file in the root of the backend directory called `serviceAccount.json`. Start the server by running:

```bash
npm start
```

The server will run on the specified port (default is 8000). You can then make requests to the endpoints as described above.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Provide contact information for users to reach out to you with questions or feedback.
