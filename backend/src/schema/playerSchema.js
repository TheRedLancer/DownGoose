const Player = (username) => {
    return {
        version: "1",
        username: username,
        id: "",
        joinTime: Date.now(),
        cardColors: [], // ['1', '0', '3', '2']
        currentRotation: 0,
        ready: false,
        action: 0, // 1: DownGoose!, 2: Color
        colorChoice: 0,
        doneRotating: false,
    }
}

export default Player;