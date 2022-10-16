/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import { usePubNub } from 'pubnub-react'
import React, { useState, useEffect } from 'react'
import PubNub from 'pubnub'
import { customAlphabet, nanoid } from 'nanoid'
import Game from './Game'
import Home from './Home'
import Lobby from './Lobby'

export default function DownGoose() {
  const pubnub = new PubNub({
    publishKey: import.meta.env.VITE_PUBNUB_PUBLISH_KEY,
    subscribeKey: import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY,
    uuid: 'myUniqueUUID'
  });
  const nanoid_room = customAlphabet('1234567890', 5);
  const [isDisabled, setDisabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inLobby, setInLobby] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerNames, setPlayerNames] = useState(["player1", "player2", "player3"]);
  const [endGame, setEndGame] = useState(false);
  const [gameChannel, setGameChannel] = useState("");
  const [gameID, setGameID] = useState("");
  const [playerID, setPlayerID] = useState(nanoid());

  let display = null;
  if (isPlaying) {
    display = <Game
      pubnub={pubnub}
      gameChannel={gameChannel}
      isHost={isHost}
      currentPlayer={currentPlayer}
      playerNames={playerNames}
      endGame={endGame}
    />
  } else {
    if (inLobby) {
      display = <Lobby
        playerList = {playerNames}
        isHost = {isHost}
        onStartGame = {() => {
          console.log("onStartGame");
        }}
      />
    } else {
      display = <Home
        onPressHost = {() => {
          console.log("onPressHost()");
          const tempGameID = nanoid_room();
          setGameID(tempGameID);
          setGameChannel('downgoosegame--' + tempGameID);
          pubnub.subscribe({
            channels: [{gameChannel}],
            withPresence: true
          });
          pubnub.publish(
            {
              channel: {gameChannel},
              message: {"text": "Start game"}
            },
            function(status, response) {
              console.log(status);
              console.log(response);
            }
          );
        }}
        onPressJoin = {() => {
          console.log("onPressJoin()");
        }}
        nickname = {nickname}
        setNickname = {setNickname}
      />
    }
  }; 

  return (
    <div>
      {display}
    </div>
  )
}
