# Spotify Forum

A social media platform that uses Spotify OAuth to give users a place to discuss music.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## Installation/Usage

### Clone the Repository
   ```sh
   git clone https://github.com/asatpathy314/spotify-app.git
   ```

### Front-End Installation

1. **Go to Front-End Folder**
   ```sh
   cd spotify-app/frontend

2. **Install Dependencies**
   ```sh
   npm install

3. **Run Front-End Server**
   ```sh
   npm run dev

### Back-End Installation

1. **Go to Back-End Folder**
   ```sh
   cd spotify-app/backend
   ```

2. **Install Dependencies**
   ```sh
   npm install

3. **Set Up Environment Variables**
    Create a .env file in the backend directory with the following content, replacing the placeholders with your actual Spotify API credentials:
   ```sh
    CLIENT_ID=your_spotify_client_id
    CLIENT_SECRET=your_spotify_client_secret

4. **Run Back-End Server**
   ```sh
   npm start

Go to http://localhost:5173/ to access the app.

### How to Create an App in Spotify and Get Client ID and Secret

1. **Log in to the Spotify Developer Dashboard**
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/login).
   - Log in with your Spotify account. If you don't have an account, you'll need to create one.

2. **Create a New App**
   - Once logged in, click on the "Create an App" button.
   - Fill in the details for your new app:
     - **App Name**: Choose a name for your app.
     - **App Description**: Provide a brief description of your app.
     - **Redirect URI**: Add the URI where users will be redirected after authorization ( `http://localhost:8000/auth/callback` for local development).
   - Accept the Spotify Developer Terms of Service.
   - Click on the "Create" button.

3. **Retrieve Client ID and Client Secret**
   - After creating the app, you will be redirected to the app's dashboard.
   - Here you will find your **Client ID** and **Client Secret**. Copy these values as you will need them for authorization.

### Linking Your Project to Firebase with `serviceAccount.js`

#### 1. Set Up Firebase Project

1. **Create a Firebase Project**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click on "Add project" and follow the prompts to create a new Firebase project.

2. **Generate a Service Account Key**
   - In the Firebase Console, navigate to your project.
   - Click on the gear icon next to "Project Overview" and select "Project settings".
   - Go to the "Service accounts" tab.
   - Click on "Generate new private key" and confirm by clicking "Generate key". This will download a JSON file containing your service account credentials.

#### 2. Create `serviceAccount.json`

1. **Create a New File**
   - In your project directory, create a new file named `serviceAccount.json`.

2. **Add the Service Account Credentials**
   - Copy the content of the downloaded JSON file and paste it into `serviceAccount.json`.
   - Export the credentials as a module. Your `serviceAccount.json` should look like this:

   ```javascript
   const serviceAccount = {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "your-private-key-id",
     "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR-PRIVATE-KEY\n-----END PRIVATE KEY-----\n",
     "client_email": "your-client-email@your-project-id.iam.gserviceaccount.com",
     "client_id": "your-client-id",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
   }


## Usage

Once everything is setup `cd` to the project folder. In order to start the frontend server.

```bash
cd frontend
npm run dev
```

Then to start the backend server go back to parent directory and then.

```bash
cd backend
npm start
```

## Features

### Profile
1. **User Profile Display:**
   - Displays the user's profile information including avatar, name, bio, favorite song, and favorite artist.
   - Fetches profile data from the backend using the user ID.

2. **Editable Bio:**
   - Users can edit their bio if they are viewing their own profile.
   - Editable bio textarea is shown with a save button when in edit mode.

3. **Favorite Song and Artist:**
   - Displays the user's favorite song with album cover and song name.
   - Displays the user's favorite artist with artist image and name.

4. **Authentication Check:**
   - Checks for Spotify access token and user ID from URL parameters or redirects to login if not found.
   - If the user is not authorized, displays a message prompting the user to login.

### Favorite Artists
1. **Top Artists Display:**
   - Fetches and displays the user's top artists from Spotify for three different timeframes: short-term, medium-term, and long-term.
   - Allows users to toggle between these timeframes to view their top artists for different periods.
2. **Dynamic Data Fetching:**
   - Uses `axios` to make API requests to the backend to fetch top artists data based on the selected timeframe.
   - Fetches data for all timeframes upon component mount if a valid token is available.
3. **Timeframe Selection:**
   - Utilizes a `TimeButton` component to allow users to select the timeframe (short-term, medium-term, long-term) for displaying top artists.
   - Updates the displayed artists dynamically based on the selected timeframe.

### Favorite Songs
1. **Top Songs Display:**
   - Fetches and displays the user's top songs from Spotify for three different timeframes: short-term, medium-term, and long-term.
   - Allows users to toggle between these timeframes to view their top songs for different periods.

2. **Dynamic Data Fetching:**
   - Uses `axios` to make API requests to the backend to fetch top songs data based on the selected timeframe.
   - Fetches data for all timeframes upon component mount if a valid token is available.

3. **Timeframe Selection:**
   - Utilizes a `TimeButton` component to allow users to select the timeframe (short-term, medium-term, long-term) for displaying top songs.
   - Updates the displayed songs dynamically based on the selected timeframe.

### Discover Page

1. **Discover Page:**
   - Displays a list of user profiles for discovery.
   - Fetches all user profiles from the backend.

2. **Profile Links:**
   - Each user profile is a clickable link that navigates to the respective user's profile page.
   - Uses `Link` component from Chakra UI for navigation.

3. **Responsive Design:**
   - Profiles are displayed in a responsive grid layout.
   - Uses Chakra UI's `Box` component with flex properties for a flexible and responsive design.

### Forum
1. **Forum Creation and Listing:**
   - Users can create new forums with a name.
   - Display a list of available forums for users to choose from.

2. **Post Creation and Listing:**
   - Users can create new posts within a selected forum with a title and description.
   - Display a list of posts for a selected forum.

3. **Commenting System:**
   - Users can add comments to a selected post.
   - Display comments associated with a post.

4. **Like Functionality:**
   - Users can like posts and comments, which updates the like count in real-time.
   - The likes are persisted in the database and updated optimistically on the client side.

5. **Data Fetching and State Management:**
   - Efficient data fetching with `axios` to interact with your Express backend.
   - Management of loading states to provide feedback to users.

## How to Extend the Project

### Backend
- Create a file in the backend/api folder using `template.js`.
- Import a the new route in `app.js` and use the pre-established format to add the route.
- Implement the API endpoint for this route. Depending on the purpose of the endpoint you may need to verify that the Spotify token which the user has provided is still valid using appropriate error handling on the frontend. In order to make the API as flexible as possible try to send raw data to the frontend unless the data processing is compute intensive.

### Frontend:
- In `Sidebar.jsx` add the link and an appropriate icon to the `LinkItems` array.
- Create a new route in the router in `main.jsx` under the children of `App.jsx`. This will allow `react-router-dom` to recognize the page.
- Add a component file in `Routes.jsx`. This will be the component you define in `Main.jsx`. 
- Import/create necessary components and subscribe to the AuthContext if you need to make any calls to API endpoints that interface with the Spotify API.

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

- [Abhishek Satpathy](mailto:asatpathy314@gmail.com)
- [Carson Colyer](mailto:carsoncolyer@gmail.com)
- [Harun Ahmed](mailto:hahmed3173@gmail.com)
