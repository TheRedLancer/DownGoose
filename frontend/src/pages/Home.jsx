/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import React, { useState, useEffect } from 'react'
import '../Home.css'

export default function Home() {
    const [nickname, setNickname] = useState("");
    const [roomCode, setRoomCode] = useState("");

    const onJoinRoom = (response) => {
        console.log("onJoinRoom:", "Room response:", response);
    }

    const onReceiveRoom = (response) => {
        console.log("onReceiveRoom:", "Room response:", response);
        if (response.code === 0) {
            //good response
            // socket.volatile.emit('join-room', roomCode, nickname, onJoinRoom);
        } else {
            console.log("Error:", response.message);
        }
    }
    
    const sendCreateRoom = () => {
        if (nickname && roomCode) {
            // socket.volatile.emit('create-room', roomCode, onReceiveRoom);
            console.log("EMIT create-room");
        } else {
            console.log("MISSING DATA");
        }
    }

    const sendJoinRoom = () => {
        if (nickname && roomCode) {
            console.log("EMIT join-room");
            //socket.volatile.emit('join-room', roomCode, nickname, onJoinRoom);
        } else {
            console.log("MISSING DATA");
        }
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
                <button className="host-button" onClick={() => {
                    sendCreateRoom();
                }}>
                    Host
                </button>
                <button className="join-button" onClick={() => {
                    sendJoinRoom();
                }}>
                    Join
                </button>
            </div>
        </div>
    )
}
