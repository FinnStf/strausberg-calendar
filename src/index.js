import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthContextProvider from "./store/AuthContextProvider";
import {BrowserRouter} from "react-router-dom";
import {initializeApp} from 'firebase/app'
import firebase from "firebase";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4RV1Jr4pIwDsfLRjqhHu96N0nLxDxACg",
    authDomain: "testserver-a17e0.firebaseapp.com",
    databaseURL: "https://testserver-a17e0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "testserver-a17e0",
    storageBucket: "testserver-a17e0.appspot.com",
    messagingSenderId: "382293909787",
    appId: "1:382293909787:web:bcbc9cafdce2cf0c3d73be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth(app)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthContextProvider firebaseAuth={firebaseAuth}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AuthContextProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
