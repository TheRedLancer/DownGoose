const baseURL =
    import.meta.env.VITE_SERVER_URL + ':' + import.meta.env.VITE_SERVER_PORT;
async function putRoom(roomCode: string) {
    const res = await fetch(baseURL + '/api/room/create', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            roomCode: roomCode,
        }),
    }).catch((error) => console.log(error));
    return res;
}

async function putPlayerInRoom(roomCode: string, nickname: string) {
    const res = await fetch(baseURL + '/api/room/add_player', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            roomCode: roomCode,
            nickname: nickname,
        }),
    }).catch((error) => console.log(error));
    return res;
}

export {putRoom, putPlayerInRoom};
