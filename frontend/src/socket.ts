import {Manager} from 'socket.io-client';

const manager = new Manager(
    import.meta.env.VITE_SERVER_URL + ':' + import.meta.env.VITE_SERVER_PORT,
    {
        reconnectionDelayMax: 10000,
        autoConnect: false,
        withCredentials: false,
    }
);

export const lobbySocket = manager.socket('/lobby');

export const gameSocket = manager.socket('/game');
