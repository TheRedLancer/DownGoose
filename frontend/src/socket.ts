import {Manager} from 'socket.io-client';
const baseURL = import.meta.env.VITE_BASE_URL || '';
const manager = new Manager(baseURL, {
    reconnectionDelayMax: 10000,
    autoConnect: false,
    withCredentials: false,
});

export const lobbySocket = manager.socket('/lobby');

export const gameSocket = manager.socket('/game');
