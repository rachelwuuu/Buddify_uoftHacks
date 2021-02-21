import React, { useState, useEffect } from 'react';
import { getAccount } from '../auth'
import { LoginDialog } from '../auth/LoginDialog'
import { Avatar } from "@material-ui/core";
import "./homePage.css";
import axios from 'axios';
export default function HomePage() {
    const [email,setEmail] = useState(null);
    const [name,setName] = useState(null);
    const [headline,setHeadline] = useState(null);
    const [countryRegion,setCountryRegion] = useState(null);
    const [homeCountryRegion,setHomeCountryRegion] = useState(null);
    const [locationCity,setLocationCity] = useState(null);
    const [contactInfo,setContactInfo] = useState(null);
    const [about,setAbout] = useState(null);
    const [avatar,setAvatar] = useState(null);
    const [friends,setFriends] = useState(null);
    
    function loop(friends){
        if(friends){
            
            return friends.map((friend)=>(
                
                <div key={friend} className="friend">
                        <Avatar src={friend.avatar} className="friendAvatar"></Avatar>
                        <p>{friend.name}</p>
                        <p>Email: {friend.email}</p>
                        <p>Headline: {friend.intro.headline}</p>
                        <p>Country Region: {friend.intro.countryRegion}</p>
                        <p>Home Country: {friend.intro.homeCountryRegion}</p>
                        <p>Location City: {friend.intro.locationCity}</p>
                    
                </div>
                ));
        }
    }
    function loopName(friends){
        if(friends){
            return friends.map((friend)=>(<p key={friend.name}>{friend.name}</p>));
        }
    }
    useEffect(async ()=>{
        const response=await axios(
            'http://localhost:3000/data',
        );
        setEmail(response.data.gmailTest.email)
        setName(response.data.gmailTest.name)
        setHeadline(response.data.gmailTest.intro.headline)
        setCountryRegion(response.data.gmailTest.intro.countryRegion)
        setHomeCountryRegion(response.data.gmailTest.intro.homeCountryRegion)
        setLocationCity(response.data.gmailTest.intro.locationCity)
        setContactInfo(response.data.gmailTest.intro.contactInfo)
        setAbout(response.data.gmailTest.intro.about)
        setAvatar(response.data.gmailTest.avatar)
        setFriends(response.data.gmailTest.friends)
    })
    return (
        <div className="homePage">
            <div className="welcomeInfo">Welcome, {getAccount().name} <Avatar alt={getAccount().name} src={getAccount().photoURL} id="mainPic" /> 
                <div className="friends">
                    <div className="personalInfo">
                            <Avatar src={avatar} className="friendAvatar"></Avatar>
                            <p>Name: {name}</p>
                            <p>Email: {email}</p>
                            <p>Headline: {headline}</p>
                            <p>Country Region: {countryRegion}</p>
                            <p>Home Country: {homeCountryRegion}</p>
                            <p>Location City:{locationCity}</p>
                            <p>Contact Info:{contactInfo}</p> 
                            <p>About: {about}</p>
                    </div> 
                
                    {loop(friends)}
                </div>
            </div>
            
            
        
        </div>
    )
}

