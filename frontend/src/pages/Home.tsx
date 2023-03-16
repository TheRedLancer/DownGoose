/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import * as server from "../server.js"
import '../Home.css'

export default function Home() {
    const [nickname, setNickname] = useState("");
    const [roomCode, setRoomCode] = useState("");

    const navigate = useNavigate();

    const joinRoom = async () => {
        let joinRes = await server.putPlayerInRoom(roomCode, nickname).catch(e => {console.log(e)});
        if (!joinRes) {
            return;
        }
        if (joinRes.status != 200) {
            console.log(`Error: could not join: ${roomCode}`, joinRes, "\nbody", await joinRes.json());
            return;
        }
        joinRes.json().then(data => {
            console.log("Sending data:", data);
            navigate(`/game/${data.room.roomCode}`, { state: data });
        });
    }
    
    const onHostButton = async () => {
        console.log("Host");
        if (!nickname || !roomCode) {
            console.log("FILL IN NAME OR ROOMCODE");
            return;
        }
        let createRes = await server.putRoom(roomCode);
        if (!createRes) {
            return;
        }
        console.log(createRes);
        if (createRes.status != 200) {
            console.log(`Error: could not create room ${roomCode}`);
            return;
        }
        //joinRoom();
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
                    rows={1}
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
                    rows={1}
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
