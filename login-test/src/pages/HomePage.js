import React from 'react'
import { getAccount } from '../auth'
import { LoginDialog } from '../auth/LoginDialog'
import { Avatar } from "@material-ui/core";
/*import "./App.css";*/
import axios from 'axios';
export default function HomePage() {
    const getData = () =>{
        axios.get("http://localhost:3000/data").then((response)=>{
                console.log(response);
        })
    }
    return (
        <div>
            <div>Welcome {getAccount().name} <Avatar alt={getAccount().name} src={getAccount().photoURL} /> </div>
            <button onClick={getData}>here</button>
        </div>
    )
}
