import { io } from 'socket.io-client';

export const lobbySocket = io("http://localhost:8000/lobby", {
    autoConnect: false,
    withCredentials: false,
});

export const gameSocket = io("http://localhost:8000/game", {
    autoConnect: false,
    withCredentials: false,
});