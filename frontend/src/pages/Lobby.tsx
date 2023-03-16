/*
  Author: Zach Burnaby
  Project: DownGoose
*/

import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom"
import PlayerReadyDisplay from '../components/PlayerReadyDisplay';
import { lobbySocket } from '../socket';

export default function Lobby() {
    const [parsedLocationState, setParsedLocationState] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [player, setPlayer] = useState<LobbyPlayer | undefined>(undefined);
    const [players, setPlayers] = useState<LobbyPlayers>([]);
    const [isReady, setIsReady] = useState(false);

    const {state} = useLocation();

    useEffect(() => {
        if (!parsedLocationState) {
            setPlayer({
                nickname: state.playerName,
                id: state.playerId,
                isReady: false,
            });
            setParsedLocationState(true);
        }
    }, [state]);

    useEffect(() => {
        // no-op if the socket is already connected
        if (state.roomCode && state.roomId) {
            console.log("Attempting to connect to ", state.roomCode);
            lobbySocket.connect();
        }
        return () => {
            lobbySocket.disconnect();
        };
    }, [state]);

    useEffect(() => {
        console.log("Players were updated!", players);
    }, [players])

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log("Connected to:", state.roomId);
            lobbySocket.emit('join-room', player!.id, player!.nickname, state.roomId);
        }

        function onPing() {
            console.log("got ping");
            lobbySocket.volatile.emit('pong');
        }

        function onPlayerJoin(otherPlayerId: string, otherPlayerName: string) {
            console.log("Got player-join:", otherPlayerId);
            console.log("oldPlayers", players);
            if (players.findIndex(p => p.id === otherPlayerId ) != -1) {
                return;
            }
            let newPlayers = [...players];
            newPlayers.push({
                nickname: otherPlayerName,
                isReady: false,
                id: otherPlayerId
            });
            console.log("newPlayers", newPlayers)
            setPlayers(newPlayers);
        }

        function onPlayerLeave(otherPlayerId: string) {
            console.log("Got player-leave:", otherPlayerId);
            let newPlayers = [...players];
            const otherPlayerIndex = players.findIndex(p => p.id === otherPlayerId );
            delete newPlayers[otherPlayerIndex]
            setPlayers(newPlayers);
        } 

        function onPlayerReady(otherPlayerId: string) {
            console.log("Got player-ready:", otherPlayerId);
            let newPlayers = [...players];
            const otherPlayerIndex = players.findIndex(p => p.id === otherPlayerId );
            newPlayers[otherPlayerIndex].isReady = true;
            setPlayers(newPlayers);
        }

        function onPlayerUnready(otherPlayerId: string) {
            console.log("Got player-unready:", otherPlayerId);
            let newPlayers = [...players];
            const otherPlayerIndex = players.findIndex(p => p.id === otherPlayerId );
            newPlayers[otherPlayerIndex].isReady = false;
            setPlayers(newPlayers);
        }

        function onDisconnect() {
            console.log("got disconnect");
            setIsConnected(false);
        }
        if (player) {
            lobbySocket.on('connect', onConnect);
            lobbySocket.on('ping', onPing);
            lobbySocket.on('player-join', onPlayerJoin);
            lobbySocket.on('player-leave', onPlayerLeave);
            lobbySocket.on('player-unready', onPlayerUnready);
            lobbySocket.on('player-ready', onPlayerReady);
            lobbySocket.on('disconnect', onDisconnect);
        }
    
        return () => {
            lobbySocket.off('connect', onConnect);
            lobbySocket.off('ping', onPing);
            lobbySocket.off('player-join', onPlayerJoin);
            lobbySocket.off('player-leave', onPlayerLeave);
            lobbySocket.off('player-ready', onPlayerReady);
            lobbySocket.off('player-unready', onPlayerUnready);
            lobbySocket.off('disconnect', onDisconnect);
        };
    }, [state, player, players]);

    function toggleReady() {
        if (!isConnected) {
            console.log("Not Connected!");
            return;
        }
        if (!player) {
            console.log("no player");
            return;
        }
        if (player.isReady) {
            lobbySocket.emit('unready', player.id, player.nickname, state.roomId);
            let newPlayer = player;
            newPlayer.isReady = false;
            setIsReady(newPlayer.isReady);
            setPlayer(newPlayer)
        } else {
            lobbySocket.emit('ready', player.id, player.nickname, state.roomId);
            let newPlayer = player;
            newPlayer.isReady = true;
            setIsReady(newPlayer.isReady);
            setPlayer(newPlayer)
        }
    }

    return (
        <div className='lobby'>
            <h1>
                Join Code: {state.roomCode || "No room code"}
            </h1>
            <h3>You: {player?.nickname}</h3>
            <h2>Are you ready? {player?.isReady.toString()}</h2>
            <button onClick={() => {toggleReady()}}>{isReady ? "Unready" : "Ready Up"}</button>
            <PlayerReadyDisplay players={players} />
        </div>
    )
}

