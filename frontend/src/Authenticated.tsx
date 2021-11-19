import React, { useState, useEffect } from "react";
import "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  User,
  GoogleAuthProvider,
  onAuthStateChanged,
  getAuth,
  signOut,
} from "firebase/auth";
import FirebaseAuth from "react-firebaseui/FirebaseAuth";

const firebaseConfig = {
  // put firebase config in here.
  // You can find the config in Project Settings > General
  // and choose the Config option in Firebase SDK snippet
  apiKey: "AIzaSyCaQPjD5e2HdceJLcvHsOyGJTKQt4RwXgg",
  authDomain: "trends-pg.firebaseapp.com",
  projectId: "trends-pg",
  storageBucket: "trends-pg.appspot.com",
  messagingSenderId: "727359309907",
  appId: "1:727359309907:web:9cb5ebefc7362e05f71ea6",
};

const firebase = initializeApp(firebaseConfig);

const auth = getAuth(firebase);

type Props = {
  readonly children: React.ReactNode;
};

const Authenticated = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  };

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return (
    <>
      {user ? (
        <>
          <h2>Hi, {user.displayName}!</h2>
          <button onClick={() => signOut(auth)}>Sign Out</button>
          {children}
        </>
      ) : (
        <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      )}
    </>
  );
};

export default Authenticated;
