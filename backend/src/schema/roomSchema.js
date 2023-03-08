const Room = (roomCode) => {
    return {
        version: "1",
        createTime: Date.now(),
        playerJoined: -1,
        startGame: -1,
        lastInteraction: Date.now(),
        code: roomCode,
        players: [],
        activePlayer: "",
        nextPlayer: "",
        gameState: "lobby",
    }
}

export default Room;