# TODO

- Change backend to expect message for when to join or host
- Add data to redis when connecting
- Send redis game state data to frontend


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