import { Namespace, Socket } from "socket.io";
import { gameState, getLobbyData, readyPlayer, startGame } from "./dbFunctions.js";

const LobbyManager = {
    /**
     * @param {Namespace} lobbyIO 
     */
    listen: (lobbyIO: Namespace) => {
        lobbyIO.on('connection', async socket => {
            console.log(socket.id, "connected to lobby");
            
            socket.on('join-room', async (playerId: string, playerName: string, roomId: string) => {
                socket.join(roomId);
                console.log(roomId, "emit player-join", playerName);
                let data = await getLobbyData(roomId);
                socket.emit('on-join', data);
                socket.to(roomId).emit('player-join', 
                    playerId,
                    data
                );
            }); 

            socket.on('leave-room', async (playerId: string, roomId: string) => {
                console.log(socket.id , "emit player-leave", roomId);
                socket.to(roomId).emit('player-leave', 
                    playerId,
                    await getLobbyData(roomId)
                );
                socket.leave(roomId);
            });

            socket.on('ready', async (playerId: string, roomId: string) => {
                console.log(socket.id , "emit player-ready", roomId);
                await readyPlayer(playerId, true);
                socket.to(roomId).emit('player-ready', 
                    playerId,
                    await getLobbyData(roomId)
                );
            });

            socket.on('unready', async (playerId: string, roomId: string) => {
                console.log(socket.id , "emit player-unready", roomId);
                await readyPlayer(playerId, false);
                socket.to(roomId).emit('player-unready', 
                    playerId,
                    await getLobbyData(roomId)
                );
            });

            socket.on('start-game', async (playerId: string, roomId: string) => {
                console.log(socket.id , "emit start-game", roomId);
                let state = await Promise.all(await startGame(roomId));
                let gS = gameState(state[0], state[1]);
                console.log("Game state on start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", gS);
                lobbyIO.in(roomId).emit('game-start',
                    playerId,
                    gS
                );
            });

            socket.on("disconnect", () => {
                console.log(socket.id, "disconnected");
            });
        });
    }
}

export default LobbyManager;