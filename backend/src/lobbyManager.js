import { Namespace, Socket } from "socket.io";

const LobbyManager = {
    /**
     * @param {Namespace} lobbyIO 
     */
    listen: (lobbyIO) => {
        lobbyIO.on('connection', async socket => {
            console.log(socket.id, "connected to lobby");

            socket.on('join-room', async (playerId, playerName, roomId) => {
                console.log("RoomId:", roomId)
                console.log(roomId, "join-room", playerName);
                socket.join(roomId);
                console.log(roomId, "emit player-join ", playerName)
                socket.to(roomId).emit('player-join', playerId, playerName);
            });

            socket.on('leave-room', async (playerId, playerName, roomId) => {
                console.log(socket.id, "leave-room", roomId);
                console.log(socket.id , "emit player-leave ", roomId)
                socket.to(roomId).emit('player-leave', playerId, playerName);
                socket.leave(roomId);
            });

            socket.on('ready', async (playerId, playerName, roomId) => {
                console.log(socket.id, "ready", roomId);
                console.log(socket.id , "emit player-ready ", roomId);
                socket.to(roomId).emit('player-ready', playerId, playerName);
            });

            socket.on('unready', async (playerId, playerName, roomId) => {
                console.log(socket.id, "unready", roomId);
                console.log(socket.id , "emit player-unready ", roomId)
                socket.to(roomId).emit('player-unready', playerId, playerName);
            });

            socket.on("disconnect", () => {
                console.log(socket.id, "disconnected");
            });
        });
    }
}

export default LobbyManager;