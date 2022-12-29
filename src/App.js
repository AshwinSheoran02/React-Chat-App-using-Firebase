import React, { useRef, useState , useEffect } from 'react';
import './App.css';
import Button from './components/Button'
import Channel from './components/Channel'
import Navbar from './components/Navbar';



import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyCgV5w_G6GnXPi-6CzPMqxkeADsqywMGu8",

  authDomain: "superchatapp-1.firebaseapp.com",

  projectId: "superchatapp-1",

  storageBucket: "superchatapp-1.appspot.com",

  messagingSenderId: "312097093500",

  appId: "1:312097093500:web:d0bd81e2e8e9efe5ad96f9",

  measurementId: "G-6QMJZ04K1N"

})

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
  const [user , setUser] = useState(() => auth.currentUser);
  const [initializing , setInitializing] = useState(true);

  useEffect(()=>{
    const unsubscribe =  auth.onAuthStateChanged(user => {
      if (user){
        setUser(user);
      }
      else{
        setUser(null);
      }
      if(initializing){
        setInitializing(false);
      }
    });
    ///
    return unsubscribe;
  } , [])

  const signInWithGoogle = async() =>{
    //
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();
    try{
      await auth.signInWithPopup(provider);
    }
    catch(error){
      console.error(error);
    }
  };

  const signOut = async() =>{
    try{
      await firebase.auth().signOut();
    }
    catch(error){
      console.log(error.message);
    }
  };  

  if (initializing) return "Loading...";

  // if(user)return ;

  return (
    

    <div >
        <Navbar/>

      { user ? (
          <>
          <button class="btn btn-primary" onClick = {signOut}>Sign Out</button>
          <Channel user = {user} db={db} />
        </>
      ) : 
      ( 
        <button class="btn btn-primary" onClick={signInWithGoogle}>Sign in with Google</button>
       )

      }

    </div>
  );
}



export default App;