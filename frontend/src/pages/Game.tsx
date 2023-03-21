/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import { useState, useEffect } from 'react'
import Card from '../components/Card';
import GooseCardArea from '../components/GooseCardArea'
import PlayerButtons from '../components/PlayerButtons';
import { useLocation } from "react-router-dom";
import { gameSocket } from '../socket';
import { GamePlayer, GameState, LobbyPlayer, LobbyPlayers } from '../global';
import { gameState } from '../../../backend/src/dbFunctions';
import getCardFile from '../colorCardData';

export default function Game() {    
    /*calledColor values:
        -1: not set
        0-3: colors,
        4: downgoose
    */
    const [parsedLocationState, setParsedLocationState] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [player, setPlayer] = useState<GamePlayer>();
    const [players, setPlayers] = useState<GamePlayer[]>([]);
    const [activePlayer, setActivePlayer] = useState("");
    const [roomId, setRoomId] = useState("");
    const [roomCode, setRoomCode] = useState("");

    const {state} = useLocation();

    useEffect(() => {
        if (!parsedLocationState) {
            let gs: GameState = state.gameState;
            let p = gs.players.filter((p: GamePlayer) => p.id === state.player.id);
            if (p.length === 1) {
                setPlayer(p[0]);
                console.log(p[0]);
            }
            let players: GamePlayer[] = gs.players.filter((p: GamePlayer) => p.id !== state.player.id);
            setPlayers(players);
            setActivePlayer(gs.activePlayer);
            setRoomId(gs.roomId);
            setRoomCode(gs.roomCode);
            
            setParsedLocationState(true);
        }
    }, [state]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log("Connected to:", state.roomId);
            gameSocket.emit('join-room', player!.id, player!.nickname, state.roomId);
        }

        function onPing() {
            console.log("got ping");
            gameSocket.volatile.emit('pong');
        }

        function onDisconnect() {
            console.log("got disconnect");
            setIsConnected(false);
        }

        if (player) {
            gameSocket.on('connect', onConnect);
            gameSocket.on('ping', onPing);
            gameSocket.on('disconnect', onDisconnect);
        }
    
        return () => {
            gameSocket.off('connect', onConnect);
            gameSocket.off('ping', onPing);
            gameSocket.off('disconnect', onDisconnect);
        };
    }, [state, player, players]);

    return (
        <div className='game'>
            Playing a game!
            <GooseCardArea
                players={players}
                activePlayer={activePlayer}
            />
            {player?.nickname}
            <Card
                rotation={player?.currentRotation}
                active={activePlayer === player?.nickname}
                image={getCardFile(player?.cardColors)}
            />
            <PlayerButtons
                currentColor={0}
                calledColor={0}
                active={activePlayer === player?.nickname}
                numberQuacked={234}
            />
        </div>
    )
}