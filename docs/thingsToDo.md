# TODO
- check name clashes in lobby for join
- Change backend to expect message for when to join or host
- Add data to redis when connecting
- Send redis game state data to frontend
- Add react router to route game codes to games
- Version my json: Add "game-version: 1.0"
- Auto-gen name
- identicon node package

### How to do it
```
onConnect => {
    send data to the client about the requested room
}

attach Redis listeners to all keys with <roomID>:
Send client information when the Redis listeners fire

client sends information about their decision when it's their turn
player can:
    call out a color {
        all players may rotate so that color is up
    }
    quack! {
        yell quack for number of upright geese
        DOWNGOOSE: all players rotate cards 180*
    }
```

```
### backend responsibilities
1. Matchmaking {
    game key (unique and transient) + auth
}

2. Play
```

```
When you go to /game/:roomCode, get the name from localstorage, connect to socket. Socket sends player data currently in the lobby and game state as a response. Set up the listener to redis game instance.
```