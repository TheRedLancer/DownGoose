/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Card from '../components/Card';
import GooseCardArea from '../components/GooseCardArea'
import PlayerButtons from '../components/PlayerButtons';
import colorCardData from '../colorCardData.json';
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:8000/game", {
    autoConnect: true,
    withCredentials: true,
});

/**
 * @param {Object} props 
 * @param props.roomCode
 * @param props.isHost
 * @param props.currentPlayer
 * @param props.playerNames
 */
export default function Game(props) {   
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [playerNames, setPlayerNames] = useState(["player1", "player2", "player3"]);
    const [playerCardRotations, setPlayerCardRotations] = useState([3, 0, 0]);
    const [activePlayer, setActivePlayer] = useState("player3");
    const [playerColorCardColors, setPlayerColorCardColors] = useState(["blue", "pink", "orange", "yellow"]);
    const [playerColorCard, setPlayerColorCard] = useState(colorCardData[
        playerColorCardColors[0] + "_" +
        playerColorCardColors[1] + "_" +
        playerColorCardColors[2] + "_" +
        playerColorCardColors[3]]);
    const [calledColor, setCalledColor] = useState("orange");
    const [numberQuacked, setNumberQuacked] = useState(3);

    const {room, roomId} = useLocation();

    const notification = () => {
        if (activePlayer === playerNames[0]) {
            return "It's your turn!"
        } else if (calledColor === "quack") {
            return "Active Player Quacked!";
        } else {
            return "Called color: " + calledColor;
        }
    }

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

            socket.on('player-join', (newNickname) => {
                console.log("Got player-join:", newNickname);
            });

            socket.on('disconnect', () => {
                socket.off('pong');
                socket.off('player-join');
                setIsConnected(false);
            });
        });
    
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    });

    return (
        <div className='game'>
            <h2>
                Notification: {notification()}
            </h2>
            <GooseCardArea
                playerNames={playerNames.slice(1, playerNames.length)}
                playerCardRotations={playerCardRotations.slice(1, playerNames.length)}
                activePlayer={activePlayer}
            />
            {playerNames[0]}
            <Card
                playerName={playerNames[0]}
                rotation={playerCardRotations[0]}
                active={activePlayer === playerNames[0]}
                image={playerColorCard}
            />
            <PlayerButtons
                currentColor={playerColorCardColors[playerCardRotations[0]]}
                calledColor={calledColor}
                active={activePlayer === playerNames[0]}
                numberQuacked={numberQuacked}
            />
        </div>
    )
}