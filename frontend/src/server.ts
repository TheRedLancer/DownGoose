async function putRoom(roomCode: string) {
    const res = await fetch('http://localhost:3000/api/room/create', {
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
    const res = await fetch('http://localhost:3000/api/room/add_player', {
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
