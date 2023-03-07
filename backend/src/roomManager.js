import { Server, Socket } from 'socket.io';
import { config } from "./config.js"
const { DEFAULT_MAX_PLAYERS } = config;

export default class RoomManager {
    constructor(io, socket, roomId, action) {
        /** @type { Server } */
        this.io = io;
        /** @type { Server } */
        this.socket = socket;
        this.roomId = roomId;
        this.action = action; // [join, create]
        this.options = {
            maxPlayersLimit: DEFAULT_MAX_PLAYERS,
        };
    }

    /**
     * Initialises steps on first connection.
     *
     * Checks if room available:
     *   If yes, then joins the room
     *   If no, then creates new room.
     * 
     * @return {bool} success
     */
    async init(username) {
        const clients = this.io.in(this.roomId).fetchSockets();
        if (!clients) {
            console.error("[INTERNAL ERROR] Room creation failed!");
            return false;
        }

        if (this.action === 'join') {
            if (clients.size > 0) {
                await this.socket.join(this.roomId);
                this.socket.data.username = username;
                this.socket.emit('join-success', {
                    roomId: this.roomId
                });
                console.log(`[JOIN] Client joined room ${this.roomId}`);
                return true;
            }
            console.warn(`[JOIN FAILED] Client denied join, as roomId ${this.roomId} not created`);
            this.socket.emit("join-failed");
            return false;
        }

        if (this.action === "host") {
            if (clients.size === 0) {
                await this.socket.join(this.roomId);
                this.socket.data.username = username;
                console.info(`[CREATE] Client created and joined room ${this.roomId}`);
                this.socket.emit('host-success', {
                    roomId: this.roomId
                });
                return true;
            }
            console.warn(`[JOIN FAILED] Client denied join, as roomId ${this.roomId} not created`);
            this.socker.emit("host-failed");
            return false;
        }
    }

    /**
     * Gracefully disconnect the user from the game
     * Preserving the gameState
     */
    onDisconnect() {
        this.socket.on('disconnect', () => {
            console.log(this.socket.id , "disconnected from", this.roomId);
            try {
                this.showPlayers();
            } catch {
                console.log('[FORCE DISCONNECT] Server closed forcefully');
            }
        });
    }
}