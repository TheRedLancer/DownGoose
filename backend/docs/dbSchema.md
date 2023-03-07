# Redis db "schema"

| Field | Description | Type | Notes |
|-------|-------------|------|-------|
| `rooms` | Set of all room IDs | List | N/A |
| `<roomID>:ID` | Room code | String | N/A |
| `<roomID>:players` | Ordered list of player IDs | List | Order matters because of player turns |
| `<roomID>:active-player` | Active player ID | String | N/A |
| `<roomID>:host` | Host player ID | String | N/A |
| `<roomID>:status` | Game status | String | enum {waiting, playing, gameover} |
| `<roomID>:<playerID>:ID` | Player ID | String | N/A |
| `<roomID>:<playerID>:username` | Player's username | String | N/A |
| `<roomID>:<playerID>:card-colors` | 4-length list of card colors | List | N/A |
| `<roomID>:<playerID>:current-rotation` | Index of player's current card rotation | Integer | N/A |
