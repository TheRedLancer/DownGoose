import { Namespace, Socket } from "socket.io";
import { gameState, getGameData, getLobbyData, readyPlayer, startGame } from "./dbFunctions.js";

const GameManager = {
    /**
     * @param {Namespace} gameIO 
     */
    listen: (gameIO: Namespace) => {
        gameIO.on('connection', async socket => {
            console.log(socket.id, "connected to game");
            
            socket.on('join-game', async (playerId: string, roomId: string) => {
                socket.join(roomId);
                console.log(roomId, "emit player-join", playerId);
                let data = await getGameData(roomId);
                socket.emit('on-join', data);
                socket.to(roomId).emit('player-join', 
                    playerId,
                    data
                );
            });

            socket.on('leave-game', async (playerId: string, roomId: string) => {
                console.log(socket.id, "emit player-leave", roomId);
                socket.to(roomId).emit('player-leave', 
                    playerId,
                    await getGameData(roomId)
                );
                socket.leave(roomId);
            });

            socket.on('choose-action', async (playerId: string, roomId: string, action: number) => {
                console.log(socket.id, "emit player-action", roomId);
                socket.to(roomId).emit('player-action',
                    playerId,
                    action,
                    await getGameData(roomId)
                );
            });

            socket.on('response-action', async (playerId: string, roomId: string, action: number) => {
                console.log(socket.id, "emit player-response-action", roomId);
                socket.to(roomId).emit('player-response-action',
                    playerId,
                    action,
                    await getGameData(roomId)
                );
            });

            socket.on("disconnect", () => {
                console.log(socket.id, "disconnected");
            });
        });
    }
}

export default GameManager;