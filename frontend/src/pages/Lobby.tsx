/*
  Author: Zach Burnaby
  Project: DownGoose
*/
import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import PlayerReadyDisplay from '../components/PlayerReadyDisplay';
import {lobbySocket} from '../socket';

export default function Lobby() {
    const [isConnected, setIsConnected] = useState(false);
    const [player, setPlayer] = useState<LobbyPlayer | undefined>(undefined);
    const [players, setPlayers] = useState<LobbyPlayers>([]);
    const [ready, setReady] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [roomId, setRoomId] = useState('');

    const {statePlayer, stateRoomId} = useLocation().state as {
        statePlayer: Player;
        stateRoomId: string;
    };
    const navigate = useNavigate();
    if (!(statePlayer || player) && (stateRoomId || roomId)) {
        navigate(`/`);
    }
    // console.log(statePlayer, stateRoomId);

    useEffect(() => {
        setPlayer({
            nickname: statePlayer.nickname,
            id: statePlayer.id,
            ready: false,
        });
        setRoomCode(statePlayer.roomCode);
        setRoomId(stateRoomId);
    }, []);

    useEffect(() => {
        // no-op if the socket is already connected
        if (roomCode && roomId) {
            console.log('Attempting to connect to ', roomCode);
            lobbySocket.connect();
        }
        return () => {
            lobbySocket.disconnect();
        };
    }, [roomCode, roomId]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log('Connected to:', roomId);
            lobbySocket.emit('join-room', player!.id, player!.nickname, roomId);
        }

        function onPing() {
            console.log('got ping');
            lobbySocket.volatile.emit('pong');
        }

        function onJoin(playerData: LobbyPlayers) {
            setPlayers(playerData.filter((pd) => pd.id !== player!.id));
        }

        function onPlayerJoin(otherPlayerId: string, playerData: LobbyPlayers) {
            console.log('Got player-join:', otherPlayerId);
            setPlayers(playerData.filter((pd) => pd.id !== player!.id));
        }

        function onPlayerLeave(
            otherPlayerId: string,
            playerData: LobbyPlayers
        ) {
            console.log('Got player-leave:', otherPlayerId);
            setPlayers(playerData.filter((pd) => pd.id !== player!.id));
        }

        function onPlayerReady(
            otherPlayerId: string,
            playerData: LobbyPlayers
        ) {
            console.log('Got player-ready:', otherPlayerId);
            setPlayers(playerData.filter((pd) => pd.id !== player!.id));
        }

        function onPlayerUnready(
            otherPlayerId: string,
            playerData: LobbyPlayers
        ) {
            console.log('Got player-unready:', otherPlayerId);
            setPlayers(playerData.filter((pd) => pd.id !== player!.id));
        }

        function onDisconnect() {
            console.log('got disconnect');
            setIsConnected(false);
        }

        function onGameStart(playerId: string, gameState: GameState) {
            console.log('gotGameStart');
            let data = {
                gameState: gameState,
                player: player,
            };
            // console.log(data);
            navigate(`/${gameState.roomCode}/game`, {state: data});
        }

        if (player) {
            lobbySocket.on('connect', onConnect);
            lobbySocket.on('ping', onPing);
            lobbySocket.on('player-join', onPlayerJoin);
            lobbySocket.on('player-leave', onPlayerLeave);
            lobbySocket.on('player-unready', onPlayerUnready);
            lobbySocket.on('player-ready', onPlayerReady);
            lobbySocket.on('on-join', onJoin);
            lobbySocket.on('game-start', onGameStart);
            lobbySocket.on('disconnect', onDisconnect);
        }

        return () => {
            lobbySocket.off('connect', onConnect);
            lobbySocket.off('ping', onPing);
            lobbySocket.off('player-join', onPlayerJoin);
            lobbySocket.off('player-leave', onPlayerLeave);
            lobbySocket.off('player-ready', onPlayerReady);
            lobbySocket.off('player-unready', onPlayerUnready);
            lobbySocket.off('on-join', onJoin);
            lobbySocket.off('game-start', onGameStart);
            lobbySocket.off('disconnect', onDisconnect);
        };
    }, [player, players]);

    function toggleReady() {
        if (!isConnected) {
            console.log('Not Connected!');
            return;
        }
        if (!player) {
            console.log('no player');
            return;
        }
        if (player.ready) {
            lobbySocket.emit('unready', player.id, roomId);
            let newPlayer = player;
            newPlayer.ready = false;
            setReady(newPlayer.ready);
            setPlayer(newPlayer);
        } else {
            lobbySocket.emit('ready', player.id, roomId);
            let newPlayer = player;
            newPlayer.ready = true;
            setReady(newPlayer.ready);
            setPlayer(newPlayer);
        }
    }

    function startGame() {
        if (!isConnected) {
            console.log('Not Connected!');
            return;
        }
        if (!player) {
            console.log('no player');
            return;
        }
        // TODO: Uncomment to make people wait till everyone is ready
        let allReady = ready;
        for (const p of players) {
            if (!p.ready) {
                allReady = false;
            }
        }
        if (allReady) {
            lobbySocket.emit('start-game', player.id, roomId);
        } else {
            console.log("Someone isn't ready");
        }
    }

    const isPlayerReady = player?.ready.toString();

    return (
        <div className="lobby">
            <h1>Join Code: {roomCode || 'No room code'}</h1>
            <h3>You: {player?.nickname}</h3>
            <h2>Are you ready? {isPlayerReady}</h2>
            <button
                onClick={() => {
                    toggleReady();
                }}>
                {ready ? 'Unready' : 'Ready Up'}
            </button>
            <button
                onClick={() => {
                    startGame();
                }}>
                Start game!
            </button>
            <PlayerReadyDisplay players={players} />
        </div>
    );
}
