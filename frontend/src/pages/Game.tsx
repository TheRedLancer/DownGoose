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
    /*calledColor values:
        -1: not set
        0-3: colors,
        4: downgoose
    */
    const [parsedLocationState, setParsedLocationState] = useState(false);
    const [gameRoomId, setGameRoomId] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    /**
     * 0: loading
     * 1: lobby,
     * 2: playing,
     * 3: game over
     */
    const [gameState, setGameState] = useState(0);

    const {state} = useLocation();

    // const notification = () => {
    //     if (activePlayer === players[0]?.nickname) {
    //         return "It's your turn!";
    //     } else if (calledColor === 4) {
    //         return "Active Player Quacked!";
    //     } else {
    //         return "Called color: " + calledColor;
    //     }
    // }

    // useEffect(() => {
    //     if (!parsedLocationState) {
    //         setActivePlayer(state.room.activePlayer);
    //         setGameRoomId(state.roomId);
    //         setPlayers([state.player]);
    //         setParsedLocationState(true);
    //         setGameState(state.room.gameState);
    //     }
    // }, [state]);

    // useEffect(() => {
    //     socket.on('connect', () => {
    //         setIsConnected(true);
    //         socket.on('ping', () => {
    //             console.log("got ping");
    //             socket.volatile.emit('pong');
    //         });
    
    //         socket.on('pong', (id) => {
    //             console.log("got pong from", id);
    //         });

    //         socket.on('player-join', (newNickname) => {
    //             console.log("Got player-join:", newNickname);
    //         });

    //         socket.on('disconnect', () => {
    //             socket.off('pong');
    //             socket.off('player-join');
    //             setIsConnected(false);
    //         });
    //     });
    
    //     return () => {
    //         socket.off('connect');
    //         socket.off('disconnect');
    //     };
    // });

    return (
        <div className='game'>
            Playing a game!
            {/* <h2>
                Notification: {notification()}
            </h2>
            <GooseCardArea
                players={players.slice(1, players.length)}
                activePlayer={activePlayer}
            />
            {players[0]?.nickname}
            <Card
                rotation={players[0]?.currentRotation}
                active={activePlayer === players[0]?.nickname}
                image={colorCardData[ "p" +
                    players[0]?.cardColors[0] + "_" +
                    players[0]?.cardColors[1] + "_" +
                    players[0]?.cardColors[2] + "_" +
                    players[0]?.cardColors[3]
                ]}
            />
            <PlayerButtons
                currentColor={0}
                calledColor={calledColor}
                active={activePlayer === players[0]?.nickname}
                numberQuacked={numberQuacked}
            /> */}
        </div>
    )
}