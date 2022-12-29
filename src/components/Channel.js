import React , {useState , useEffect} from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import Message from './Message';

import { QuerySnapshot } from 'firebase/firestore';

const Channel = ({user = null , db = null}) => {
    const [messages , setMessages] = useState([]);
    const [newMessage , setNewMessage]  = useState([]);

    const {uid , displayName , photoURL} = user;

    useEffect(()=>{
        if(db){
            const unsubscibe = db.collection('messages').orderBy('createdAt').limit(100).onSnapshot(querySnapshot=>{
                const data = querySnapshot.docs.map(doc => ({
                    ... doc.data(),
                    id: doc.id,
                }));

                setMessages(data);

            })

            return unsubscibe;
        }
    } , [db]);

    const handleOnChange = e =>{
        setNewMessage(e.target.value);
    }
    const handleOnSubmit = e =>{
        e.preventDefault();
        if(db){
            db.collection('messages').add({
                text:newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                displayName,
                photoURL
            })
        }
    }



    return (
        <>
        <ul>
            {messages.map(message =>(
                <li key = {message.id}>
                    {/* {message.text} */}
                    <Message {...message} />
                    </li>
            ))}
        </ul>
        <form onSubmit={handleOnSubmit}>
        <div class="form-group">
            <input
            type = "text"
            value = {newMessage}
            onChange = {handleOnChange}
            placeholder="Type your Message here..." />
            </div>
            <button class="button" class="btn btn-primary" type = "submit" disabled={!newMessage}>
                Send
            </button>
        </form>
        </>
    );


};

export default Channel;