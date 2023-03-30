import { Manager } from 'socket.io-client';

const manager = new Manager("http://localhost:3000", {
    reconnectionDelayMax: 10000,
    autoConnect: false,
    withCredentials: false
})

export const lobbySocket = manager.socket("/lobby");

export const gameSocket = manager.socket("/game");