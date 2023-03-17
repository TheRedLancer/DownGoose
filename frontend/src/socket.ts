import { io } from 'socket.io-client';

export const lobbySocket = io("http://10.0.0.103:8000/lobby", {
    autoConnect: false,
    withCredentials: false,
});

export const gameSocket = io("http://10.0.0.103:8000/game", {
    autoConnect: false,
    withCredentials: false,
});