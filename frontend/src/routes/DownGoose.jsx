/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Game from '../Game'
import Home from '../Home'
import Lobby from '../Lobby'
import '../DownGoose.css'

const socket = io("http://localhost:8000/game", {
    autoConnect: true,
    withCredentials: true,
});

export default function DownGoose() {
    const [nickname, setNickname] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            socket.on('ping', () => {
                console.log("got ping");
                socket.volatile.emit('pong');
            });
    
            socket.on('pong', (id) => {
                console.log("got pong from", id);
            });

            socket.on('disconnect', () => {
                socket.off('ping');
                socket.off('pong');
                socket.off('player-join');
                setIsConnected(false);
            });

            socket.on('player-join', (newNickname) => {
                console.log("Got player-join")
            });
        });
    
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    });

    const onJoinRoom = (response) => {
        console.log("onJoinRoom:", "Room response:", response);
    }

    const onReceiveRoom = (response) => {
        console.log("onReceiveRoom:", "Room response:", response);
        if (response.code === 0) {
            //good response
            socket.volatile.emit('join-room', roomCode, nickname, onJoinRoom);
        } else {
            console.log("Error:", response.message);
        }
    }
    
    const sendCreateRoom = () => {
        if (nickname && roomCode) {
            socket.volatile.emit('create-room', roomCode, onReceiveRoom);
        } else {
            console.log("MISSING DATA");
        }
    }

    const sendJoinRoom = () => {
        if (nickname && roomCode) {
            socket.volatile.emit('join-room', roomCode, nickname, onJoinRoom);
        } else {
            console.log("MISSING DATA");
        }
    }

    return (
        <div>
            <Home
                onPressHost = {() => {
                    console.log("onPressHost()");
                    sendCreateRoom();
                }}
                onPressJoin = {() => {
                    sendJoinRoom();
                }}
                nickname = {nickname}
                setNickname = {setNickname}
                roomCode = {roomCode}
                setRoomCode = {setRoomCode}
            />
        </div>
    )
}
