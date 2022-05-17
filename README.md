# AurBatao

AurBatao! is a realtime chat application.

**Team**: Roneel Valambhia, Aniruddh Muley, Yash Chaudhari, Akshat Bhayani, Arjun Majithiya, Ronels Macwan

To develope locally, you will Firebase API keys and a couple more unique ids. So you need to provide them as the following environment variables: REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_APP_ID, REACT_APP_DATABASE_URL, REACT_APP_SENDER_ID.

## Firestore database structure

- /messages
  - [{chatID}]
    - messages
      - [{messageID}]
        - message: string
        - sender: string (name)
        - sentBy: string (userID)
        - status: string
        - timestamp: timestamp
- /users
  - [{userID}]
    - email: string
    - name: string
    - displayName: string
    - isVerified: boolean
    - avatarUrl: string
- /pipeline (not implemented yet)
  - [{userID}]
    - sent
      - [{uid}]
        - chatID: string
        - messageID: string

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
