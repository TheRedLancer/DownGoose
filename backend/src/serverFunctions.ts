import {createGameRoom, roomExists} from './dbFunctions.js';
import {Request} from 'express';

/**
 * @throws {DGERROR.FailCreateRoom}
 * @throws {DGERROR.RoomExists}
 * @param roomCode
 */
async function createRoom(roomCode: string): Promise<Room> {
    if (await roomExists(undefined, roomCode)) {
        throw new Error(DGERROR.RoomExists);
    }
    try {
        let room = await createGameRoom(roomCode);
        if (!room) {
            throw new Error(DGERROR.FailCreateRoom);
        }
        return room;
    } catch (e) {
        if (e instanceof Error) {
            if (e.message === DGERROR.UnknownRedisError) {
                throw new Error(DGERROR.FailCreateRoom, {cause: e});
            }
        }
    }
    throw new Error(DGERROR.FailCreateRoom);
}

export {createRoom};
