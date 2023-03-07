/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Game from './Game'
import Home from './Home'
import Lobby from './Lobby'

const socket = io("http://localhost:8000", {
    autoConnect: false,
    withCredentials: false,
});

export default function DownGoose() {
    const [isDisabled, setDisabled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [inLobby, setInLobby] = useState(false);
    const [nickname, setNickname] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [playerNames, setPlayerNames] = useState([]);
    const [endGame, setEndGame] = useState(false);
    const [gameChannel, setGameChannel] = useState("");
    const [gameID, setGameID] = useState("");
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });
    
        socket.on('disconnect', () => {
            setIsConnected(false);
        });
    
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    const onReceiveHost = (roomCode) => {
        console.log("Got code:", roomCode);
    }
    
    const sendRequestHost = () => {
        socket.volatile.emit('request-host', onReceiveHost);
    }
    
    let display = undefined;
    if (isPlaying) {
        display = <Game
            gameChannel={gameChannel}
            isHost={isHost}
            currentPlayer={currentPlayer}
            playerNames={playerNames}
            endGame={endGame}
        />
    } else {
        if (inLobby) {
            display = <Lobby
                playerList = {playerNames}
                gameID = {gameID}
                isHost = {isHost}
                onStartGame = {() => {
                    console.log("onStartGame");
                }}
            />
        } else {
            display = <Home
                onPressHost = {() => {
                    console.log("onPressHost()");
                    sendRequestHost();
                }}
                onPressJoin = {() => {
                    console.log("onPressJoin()");
                    if (isConnected) {
                        socket.disconnect();
                    } else {
                        socket.connect();
                    }
                }}
                nickname = {nickname}
                setNickname = {setNickname}
                gameID = {gameID}
                setGameID = {setGameID}
            />
        }
    };

    return (
        <div>
            {display}
        </div>
    )
}
