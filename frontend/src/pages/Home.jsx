/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import React, { useState, useEffect } from 'react'
import '../Home.css'

export default function Home() {
    const [nickname, setNickname] = useState("");
    const [roomCode, setRoomCode] = useState("");
    
    const onHostButton = async () => {
        console.log("Host");
        const res = await fetch("http://localhost:3000/api/room/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roomCode: roomCode
            })
        }).catch(error => console.log(error));
        console.log(await res.json());
    }

    const onJoinButton = () => {
        console.log("Join");
    }

    return (
        <div>
            <div className="title">
                <h1>DownGoose!</h1>
            </div>
            <div className='goose-image'>
                <img
                    className="home-goose-image"
                    src="/goose/goose.png"
                    alt="Card"
                    width={100}
                    height={100} 
                />
            </div>
            <div className='lobby-form'>
                <p>Nickname:</p>
                <textarea 
                    className="nickname" 
                    style={{
                        resize:"none"
                    }}
                    value={nickname} 
                    onChange={e => {
                        const value = e.target.value.replace(/[\r\n\v" "]+/g, "");
                        setNickname(value)
                    }} 
                    rows="1"
                    maxLength={16}
                />
                <p>Join Code</p>
                <textarea 
                    className="gameJoinCode" 
                    style={{
                        resize:"none"
                    }}
                    value={roomCode} 
                    onChange={e => {
                        const value = e.target.value.replace(/[\r\n\v" "]+/g, "");
                        setRoomCode(value)
                    }} 
                    rows="1"
                    maxLength={16}
                />
                <p></p>
                <button className="host-button" onClick={onHostButton}>
                    Host
                </button>
                <button className="join-button" onClick={onJoinButton}>
                    Join
                </button>
            </div>
        </div>
    )
}
