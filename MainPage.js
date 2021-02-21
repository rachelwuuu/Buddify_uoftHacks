import React from 'react'
import { LoginDialog } from '../auth/LoginDialog'
import { useHistory } from "react-router-dom";
import styleSheet from './home.css';
export default function MainPage() {
    let history = useHistory();
    return (
        <div>
        <h1 className="buddify">Buddify!</h1>
            <div className="content">
                <h1>Find your next group of buddies.</h1>
            <LoginDialog onSuccess={()=>history.push('/home')} onFail={()=>{}}/>
            </div>
        </div>
    )
}
