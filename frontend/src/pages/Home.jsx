/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import '../Home.css'

const putRoom = async (roomCode) => {
    const res = await fetch("http://localhost:3000/api/room/create", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            roomCode: roomCode
        })
    }).catch(error => console.log(error));
    return res;
}

const putPlayerInRoom = async (roomCode, nickname) => {
    const res = await fetch("http://localhost:3000/api/room/add_player", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            roomCode: roomCode,
            nickname: nickname,
        })
    }).catch(error => console.log(error));
    return res;
}

export default function Home() {
    const [nickname, setNickname] = useState("");
    const [roomCode, setRoomCode] = useState("");

    const navigate = useNavigate();

    const joinRoom = async () => {
        let joinRes = await putPlayerInRoom(roomCode, nickname);
        if (joinRes.status != 200) {
            console.log(`Error: could not join: ${res.message}`);
            return;
        }
        console.log("good result");
        navigate(`/game/${state.roomCode}`, { state: joinRes.body });
    }
    
    const onHostButton = async () => {
        console.log("Host");
        if (!nickname || !roomCode) {
            console.log("FILL IN NAME OR ROOMCODE");
            return;
        }
        let createRes = await putRoom(roomCode);
        console.log(createRes);
        if (createRes.status != 200) {
            console.log(`Error: could not create room ${roomCode}`);
            return;
        }
        joinRoom();
    }

    const onJoinButton = async () => {
        console.log("Join");
        if (!nickname || !roomCode) {
            console.log("FILL IN NAME OR ROOMCODE");
            return;
        }
        joinRoom();
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
                        setRoomCode(value);
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
