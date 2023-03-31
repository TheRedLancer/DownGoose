import {Namespace, Socket} from 'socket.io';
import {
    colorResponse,
    gameState,
    getGameData,
    getLobbyData,
    quackResponse,
    readyPlayer,
    setColorAction,
    setQuackAction,
    startGame,
} from './dbFunctions.js';

const GameManager = {
    /**
     * @param {Namespace} gameIO
     */
    listen: (gameIO: Namespace) => {
        gameIO.on('connection', async (socket) => {
            console.log(socket.id, 'connected to game');

            socket.on('join-game', async (playerId: string, roomId: string) => {
                socket.join(roomId);
                console.log(roomId, 'emit player-join', playerId);
                let data = await getGameData(roomId);
                gameIO.in(roomId).emit('player-join', playerId, data);
            });

            socket.on(
                'leave-game',
                async (playerId: string, roomId: string) => {
                    console.log(socket.id, 'emit player-leave', roomId);
                    gameIO
                        .in(roomId)
                        .emit(
                            'player-leave',
                            playerId,
                            await getGameData(roomId)
                        );
                    socket.leave(roomId);
                }
            );

            socket.on(
                'choose-color',
                async (playerId: string, roomId: string, color: number) => {
                    console.log(socket.id, 'emit player-action-color', roomId);
                    const data = await setColorAction(playerId, roomId, color);
                    gameIO
                        .in(roomId)
                        .emit('player-action-color', playerId, color, data);
                }
            );

            socket.on(
                'response-color',
                async (playerId: string, roomId: string, isRotating) => {
                    console.log(
                        socket.id,
                        'emit player-response-color',
                        roomId
                    );
                    const data = await colorResponse(
                        playerId,
                        roomId,
                        isRotating
                    );
                    gameIO
                        .in(roomId)
                        .emit(
                            'player-response-color',
                            playerId,
                            isRotating,
                            data
                        );
                }
            );

            socket.on(
                'choose-quack',
                async (playerId: string, roomId: string) => {
                    console.log(socket.id, 'emit player-action-quack', roomId);
                    const data = await setQuackAction(playerId, roomId);
                    gameIO
                        .in(roomId)
                        .emit('player-action-quack', playerId, data);
                }
            );

            socket.on(
                'response-quack',
                async (playerId: string, roomId: string) => {
                    console.log(
                        socket.id,
                        'emit player-response-quack',
                        roomId
                    );
                    const data = await quackResponse(playerId, roomId);
                    gameIO
                        .in(roomId)
                        .emit('player-response-quack', playerId, data);
                }
            );

            socket.on('disconnect', () => {
                console.log(socket.id, 'disconnected');
            });
        });
    },
};

export default GameManager;
