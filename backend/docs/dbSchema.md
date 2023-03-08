# Redis db "schema"

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
| `<roomID>:<playerID>:card-colors` | 4-length list of card colors | List | N/A |
| `<roomID>:<playerID>:current-rotation` | Index of player's current card rotation | Integer | N/A |
| `<roomID>:<playerID>:ready` | Is the player ready to start playing | String | Used in the lobby |
| `<roomID>:<playerID>:action` | Action player chose for their turn | String | enum {downgoose, color}. If 'color', expects to have :color-choice set |
| `<roomID>:<playerID>:color-choice` | Color chosen for player action | String | enum {blue, pink, orange, yellow}. Not used if action is 'downgoose' |
| `<roomID>:<playerID>:done-rotating` | Player has responded to 'color' action | bool | N/A |