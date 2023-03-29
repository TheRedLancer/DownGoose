# Redis db "schema"

Room: 
```
{
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
```

Player: 
```
{
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
```

| Field | Description | Type | Notes |
|-------|-------------|------|-------|
| `rooms` | Set of all room IDs | List | N/A |
| `<roomID>:version` | version of game | String | N/A |
| `<roomID>:create-time` | version of game | String | N/A |
| `<roomID>:player-join` | Time when player joined | String | N/A |
| `<roomID>:start-game` | Time of player start | String | N/A |
| `<roomID>:last-interaction` | Latest player action time | String | N/A |
| `<roomID>:ID` | Room code | String | N/A |
| `<roomID>:players` | Ordered list of player IDs | List | Order matters because of player turns |
| `<roomID>:active-player` | Active player ID | String | N/A |
| `<roomID>:next-player` | Active player ID | String | N/A |
| `<roomID>:host` | Host player ID | String | N/A |
| `<roomID>:gameState` | Game status | String | enum {lobby, playing, gameover} |
| `<roomID>:<playerID>:ID` | Player ID | String | N/A |
| `<roomID>:<playerID>:username` | Player's username | String | N/A |
| `<roomID>:<playerID>:card-colors` | 4-length list of card colors | List | [1, 3, 0, 2] |
| `<roomID>:<playerID>:current-rotation` | Index of player's current card rotation | Integer | N/A |
| `<roomID>:<playerID>:ready` | Is the player ready to start playing | String | Used in the lobby |
| `<roomID>:<playerID>:action` | Action player chose for their turn | Integer | enum {DOWNGOOSE:0, COLOR:1}. If 'color', expects to have :color-choice set |
| `<roomID>:<playerID>:color-choice` | Color chosen for player action | Integer | enum {BLUE:0, PINK:1, ORAGNE:2, YELLOW:3}. Not used if action is 'downgoose' |
| `<roomID>:<playerID>:done-rotating` | Player has responded to 'color' action | Boolean | N/A |