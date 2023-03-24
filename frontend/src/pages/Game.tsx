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

    function parseGameData(data: GameState) {
        setPlayers(data.players.filter((p: GamePlayer) => p.id !== player?.id));
        setActivePlayer(data.activePlayer);
    }

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
    }, [parsedLocationState]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log("Connected to:", roomId);
            gameSocket.emit('join-game', player!.id, roomId);
        }

        function onPing() {
            console.log("got ping");
            gameSocket.volatile.emit('pong');
        }

        function onDisconnect() {
            console.log("got disconnect");
            setIsConnected(false);
        }
        
        function onJoin(gameData: GameState) {
            console.log("got on-join");
            console.log("Game data:", gameData);
            parseGameData(gameData);
        }

        function onPlayerJoin(playerId: string, gameData: GameState) {
            console.log(playerId + " joined");
            console.log("Game data:", gameData);
        }

        if (player) {
            gameSocket.on('connect', onConnect);
            gameSocket.on('ping', onPing);
            gameSocket.on('disconnect', onDisconnect);
            gameSocket.on('on-join', onJoin);
            gameSocket.on('player-join', onPlayerJoin);
        }
    
        return () => {
            gameSocket.off('connect', onConnect);
            gameSocket.off('ping', onPing);
            gameSocket.off('disconnect', onDisconnect);
            gameSocket.off('on-join', onJoin);
            gameSocket.off('player-join', onPlayerJoin);
            
        };
    }, [state, player, players]);

    useEffect(() => {
        // no-op if the socket is already connected
        if (state.gameState.roomCode && state.gameState.roomId) {
            console.log("Attempting to connect to ", state.gameState.roomCode);
            gameSocket.connect();
        }
        return () => {
            gameSocket.disconnect();
        };
    }, [state]);

    return (
        <div className='game'>
            Playing a game in {roomCode}!
            <GooseCardArea
                players={players}
                activePlayer={activePlayer}
            />
            <h1>You: {player?.nickname}</h1>
            <Card
                rotation={player?.currentRotation}
                active={activePlayer === player?.id}
                image={getCardFile(player?.cardColors)}
            />
            <PlayerButtons
                currentColor={0}
                calledColor={0}
                active={activePlayer === player?.nickname}
                numberQuacked={5}
            />
        </div>
    )
}