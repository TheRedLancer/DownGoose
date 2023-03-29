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
// import { GamePlayer, GameState, LobbyPlayer, LobbyPlayers } from '../global';
import getCardFile from '../colorCardData';

export default function Game() {    
    /*calledColor values:
        -1: not set
        0-3: colors,
        4: downgoose
    */
    const [isConnected, setIsConnected] = useState(false);
    const [player, setPlayer] = useState<GamePlayer>();
    const [players, setPlayers] = useState<GamePlayer[]>([]);
    const [activePlayer, setActivePlayer] = useState("");
    const [roomId, setRoomId] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [numberQuacked, setNumberQuacked] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const {state} = useLocation();

    function parseGameData(data: GameState) {
        console.log("New GameState:", data);
        setPlayers(data.players.filter((p: GamePlayer) => {
            if (p.id === player?.id) {
                setPlayer(p);
            }
            return p.id !== player?.id
        }));
        setActivePlayer(data.activePlayer);
        setNumberQuacked(data.numberQuacked);
        setGameOver(data.gameOver);
    }

    useEffect(() => {
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
    }, []);

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
            console.log("got player-join");
            console.log(playerId + " joined");
            console.log("Game data:", gameData);
            parseGameData(gameData);
        }

        function onPlayerActionColor(playerId: string, color: number, gameData: GameState) {
            console.log("got player-action-color");
            parseGameData(gameData);
        }

        function onPlayerResponseColor(playerId: string, isRotating: boolean, gameData: GameState) {
            console.log("got player-response-color");
            parseGameData(gameData);
        }

        function onPlayerActionQuack(playerId: string, gameData: GameState) {
            console.log("got player-action-quack");
            parseGameData(gameData);
        }

        function onPlayerResponseQuack(playerId: string, gameData: GameState) {
            console.log("got player-response-quack");
            parseGameData(gameData);
        }

        if (isConnected) {
            gameSocket.on('connect', onConnect);
            gameSocket.on('ping', onPing);
            gameSocket.on('disconnect', onDisconnect);
            gameSocket.on('on-join', onJoin);
            gameSocket.on('player-join', onPlayerJoin);
            gameSocket.on('player-action-color', onPlayerActionColor);
            gameSocket.on('player-response-color', onPlayerResponseColor);
            gameSocket.on('player-action-quack', onPlayerActionQuack);
            gameSocket.on('player-response-quack', onPlayerResponseQuack);
        }
    
        return () => {
            gameSocket.off('connect', onConnect);
            gameSocket.off('ping', onPing);
            gameSocket.off('disconnect', onDisconnect);
            gameSocket.off('on-join', onJoin);
            gameSocket.off('player-join', onPlayerJoin);
            gameSocket.off('player-action-color', onPlayerActionColor);
            gameSocket.off('player-response-color', onPlayerResponseColor);
            gameSocket.off('player-action-quack', onPlayerActionQuack);
            gameSocket.off('player-response-quack', onPlayerResponseQuack);
        };
    }, [isConnected]);

    useEffect(() => {
        // no-op if the socket is already connected
        if (state.gameState.roomCode && state.gameState.roomId) {
            console.log("Attempting to connect to ", state.gameState.roomCode);
            gameSocket.connect();
            setIsConnected(true);
        }

        return () => {
            gameSocket.disconnect();
            setIsConnected(false);
        };
    }, []);

    function select(action: number) {
        if (action === 4) {
            //Quack
            gameSocket.emit('choose-quack', player?.id, roomId);
        } else {
            // Call color
            gameSocket.emit('choose-color', player?.id, roomId, action);
        }
    }

    function respondColor(isRotating: boolean) {
        gameSocket.emit('response-color', player?.id, roomId, isRotating);
    }

    function respondQuack() {
        gameSocket.emit('response-quack', player?.id, roomId);
    }

    let playerColor = -1;
    if (player) {
        playerColor = +player?.cardColors[player.currentRotation]
    }

    let action = -1;
    if (player?.id === activePlayer) {
        action = player.action;
    } else {
        for (const p of players) {
            if (p.id == activePlayer) {
                action = p.action;
            }
        }
    }

    return (
        <div className='game'>
            Playing a game in {roomCode}!
            <GooseCardArea
                players={players}
                activePlayer={activePlayer}
            />
            <h3>You: {player?.nickname}</h3>
            <Card
                rotation={player?.currentRotation}
                active={activePlayer === player?.id}
                image={getCardFile(player?.cardColors)}
            />
            <PlayerButtons
                currentColor={playerColor}
                action={action}
                active={activePlayer === player?.id}
                numberQuacked={numberQuacked}
                select={select}
                respondColor={respondColor}
                respondQuack={respondQuack}
                ready={player?.ready}
                gameOver={gameOver}
            />
        </div>
    )
}