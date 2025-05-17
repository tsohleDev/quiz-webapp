# QUIZ WEB APP

## Overview

Quiz Web App is a simple, client-side web application that allows users to take quizzes on various topics. It stores user progress and scores using Firebase Firestore and identifies users (or more accurately, browser instances) using a custom cookie-based UID system. Initial quiz questions are populated from a local JSON file if not already present for a user in the database.

## Tech Stack

* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Backend (Database):** Firebase Firestore
* **UID Management:** Custom JavaScript using browser cookies

## Core Features

* Dynamic loading of quiz questions based on categories.
* Persistent UID for users/browsers via cookies.
* Storage of initial quiz questions for users in Firestore.
* Tracking and storage of user scores for different quiz categories.
* Retrieval of a user's top score for a specific category.

## Project Structure (Key Files)

* `index.html` (or your main HTML file, e.g., `test_quiz_app_html`): The main entry point of the application.
* `authentication.js`: Handles generation and retrieval of UIDs using browser cookies.
    * `getCookie(name)`
    * `setCookie(name, value, days)`
    * `generateUUID()`
    * `getUid()`
* `database-client.js` (referred to as `database.js` in some contexts): Contains all the logic for interacting with Firebase Firestore.
* `firebase-keys.js`: **(Important: Not in version control)** Stores your Firebase project configuration.
* `init-data.json`: Contains the initial set of questions for different categories, loaded into Firestore if a user accesses a category for the first time.

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd quiz-web-app
    ```

2.  **Firebase Setup:**
    * This project uses Firebase Firestore as its backend database.
    * You will need to create your own Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    * Once your project is created, enable Firestore database.
    * Go to your Firebase project settings and find your web app's Firebase configuration object.

3.  **Create `firebase-keys.js`:**
    * In the root of the project, create a file named `firebase-keys.js`.
    * This file will contain your Firebase project's configuration details. It is **intentionally excluded from version control** (via `.gitignore`) because it contains sensitive information.
    * Add your Firebase configuration to `firebase-keys.js` like this:
        ```javascript
        // firebase-keys.js - DO NOT COMMIT THIS FILE IF IT CONTAINS REAL KEYS
        const firebaseConfig = {
            apiKey: "YOUR_ACTUAL_API_KEY",
            authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
            projectId: "YOUR_ACTUAL_PROJECT_ID",
            storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
            messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
            appId: "YOUR_ACTUAL_APP_ID",
            measurementId: "YOUR_MEASUREMENT_ID" // Optional
        };
        ```
    * Replace the placeholder values with your actual Firebase project credentials.

4.  **Firestore Indexes:**
    * The application might require specific composite indexes in Firestore for certain queries (e.g., fetching top scores).
    * If you encounter Firestore errors related to missing indexes, the error message in your browser's developer console will usually provide a direct link to create the required index in your Firebase console. Follow that link and create the index. For example, the `getUserTopScore` function requires an index on the `scores` collection for fields `uid` (Ascending), `category` (Ascending), and `score` (Descending).

5.  **Open in Browser:**
    * Open the main HTML file `index.html` in your web browser to run the application.

## UID Management

This application uses a simple client-side UID generation and persistence mechanism:
* When a user first visits, a UUID is generated using functions in `authentication.js`.
* This UID is then stored in a browser cookie (e.g., `quizAppUserUID`) with a long expiry (e.g., 365 days).
* On subsequent visits, the UID is retrieved from the cookie.
* This UID is used to associate Firestore data (like fetched questions and scores) with a specific browser instance.

**Note:** This cookie-based UID system is for simple browser identification and is **not a secure authentication system**. It does not verify user identity.

## Core Database Functionality (`database-client.js`)

The `database-client.js` file manages all interactions with Firebase Firestore. Key functions include:

* **`updateQuestions(uid, categoryKey, questions)`:**
    * Updates (creates or overwrites) multiple question documents in Firestore for a specific `uid` and `categoryKey`.
    * The questions are stored under the path `users/{uid}/{categoryKey}`.
    * Uses a batch write for efficiency.

* **`getQuestions(uid, categoryKey)`:**
    * Retrieves questions for a given `uid` and `categoryKey` from Firestore.
    * If no questions are found in Firestore for that user/category combination, it attempts to:
        1.  Fetch initial questions for the `categoryKey` from the local `init-data.json` file.
        2.  Use `updateQuestions()` to save these initial questions to Firestore under the user's path.
        3.  Return the newly loaded questions.
    * If questions already exist in Firestore, it returns them directly.

* **`addScore(uid, score, category)`:**
    * Adds a new score entry to a root `scores` collection in Firestore.
    * Each score document includes the `uid`, `score`, `category`, and a server `timestamp`.

* **`getUserTopScore(uid, category)`:**
    * Retrieves the highest score for a given `uid` and `category` from the `scores` collection.
    * Requires a composite index in Firestore to function correctly.

## Future Improvements

* **Secure Authentication:**  Replacing the custom cookie UID system with Firebase Authentication. This would provide actual user accounts, secure identity verification, and allow for more granular security rules in Firestore based on `request.auth.uid`.
* **Error Handling & UI:** Enhance UI feedback for all operations and improve error display.



