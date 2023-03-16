/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Card from '../components/Card';
import GooseCardArea from '../components/GooseCardArea'
import PlayerButtons from '../components/PlayerButtons';
import colorCardData from '../colorCardData';
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:8000/game", {
    autoConnect: false,
    withCredentials: true,
});

export default function Game() {   
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
    const [calledColor, setCalledColor] = useState(0);
    const [numberQuacked, setNumberQuacked] = useState(3);
    const [parsedLocationState, setParsedLocationState] = useState(false);

    const {state} = useLocation();

    const notification = () => {
        if (activePlayer === playerNames[0]) {
            return "It's your turn!";
        } else if (calledColor === 4) {
            return "Active Player Quacked!";
        } else {
            return "Called color: " + calledColor;
        }
    }

    useEffect(() => {
        if (!parsedLocationState) {
            // {
            //     "room": {
            //         "version": 1,
            //         "createTime": "2023-03-15T06:47:03.000Z",
            //         "playerJoined": 1678862830,
            //         "startGame": "1969-12-31T23:59:59.000Z",
            //         "players": [
            //             "01GVJ0BDB0QJ1X3EXAZ85HRB4G",
            //             "01GVJ0BJ935E7FAPEB8KGRXFJ0"
            //         ],
            //         "lastInteraction": 1678862830,
            //         "roomCode": "t1",
            //         "activePlayer": "",
            //         "nextPlayer": "",
            //         "gameState": "lobby"
            //     },
            //     "roomId": "01GVJ0BC8YX7KDMJDH1DZ2M76H",
            //     "player": {
            //         "version": 1,
            //         "nickname": "r",
            //         "roomCode": "t1",
            //         "joinTime": 1678862829,
            //         "cardColors": [],
            //         "currentRotation": -1,
            //         "ready": false,
            //         "action": -1,
            //         "colorChoice": -1,
            //         "doneRotating": false
            //     },
            //     "playerId": "01GVJ0BJ935E7FAPEB8KGRXFJ0",
            //     "message": "OK"
            // }

        }
        console.log(state);
    }, [state]);

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
            <button onClick={() => {console.log(state)}}>Click</button>
            <GooseCardArea
                playerNames={playerNames.slice(1, playerNames.length)}
                playerCardRotations={playerCardRotations.slice(1, playerNames.length)}
                activePlayer={activePlayer}
            />
            {playerNames[0]}
            <Card
                rotation={playerCardRotations[0]}
                active={activePlayer === playerNames[0]}
                image={playerColorCard}
            />
            <PlayerButtons
                currentColor={0}
                calledColor={calledColor}
                active={activePlayer === playerNames[0]}
                numberQuacked={numberQuacked}
            />
        </div>
    )
}