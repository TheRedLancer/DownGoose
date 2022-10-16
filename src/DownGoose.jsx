/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import { usePubNub } from 'pubnub-react'
import React, { useState, useEffect, useCallback } from 'react'
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
  const [playerNames, setPlayerNames] = useState([]);
  const [endGame, setEndGame] = useState(false);
  const [gameChannel, setGameChannel] = useState("");
  const [gameID, setGameID] = useState("");
  const [playerID, setPlayerID] = useState(nanoid());
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
        gameID = {gameID}
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
          const tempGameChannel = "downgoosegame--" + tempGameID;
          console.log(tempGameChannel);
          setGameID(tempGameID);
          setGameChannel(tempGameChannel);
          pubnub.subscribe({
            channels: [{gameChannel}],
            withPresence: true
          });
          pubnub.addListener({
            message: function(receivedMessage) {
                // handle message
                console.log("The message text is: ", receivedMessage.message);
                console.log("Sent by: ", receivedMessage.publisher);
                const messageJSON = JSON.parse(receivedMessage.message["text"]);
                if (messageJSON["type"] === "addPlayer") {
                  let l = {playerNames}["playerNames"];
                  l.push(messageJSON["addPlayer"]);
                  setPlayerNames(l);
                };
                sleep(500);
                forceUpdate();
            }
          });
          const nicknameStr = nickname.toString();
          const message = {
            "type": "addPlayer",
            "addPlayer": nicknameStr
          }
          pubnub.publish(
            {
              channel: {gameChannel},
              message: {"text": JSON.stringify(message)}
            },
            function(status, response) {
              console.log(status);
              console.log(response);
              sleep(500);
              forceUpdate();
            }
          );
          setIsHost(true);
          setInLobby(true);
        }}
        onPressJoin = {() => {
          console.log("onPressJoin()");
          const tempGameID = {gameID}["gameID"];
          const tempGameChannel = "downgoosegame--" + tempGameID.toString();
          setGameID(tempGameID);
          setGameChannel(tempGameChannel);
          pubnub.subscribe({
            channels: [{gameChannel}],
            withPresence: true
          });
          pubnub.addListener({
            message: function(receivedMessage) {
                // handle message
                console.log("The message text is: ", receivedMessage.message);
                console.log("Sent by: ", receivedMessage.publisher);
                const messageJSON = JSON.parse(receivedMessage.message["text"]);
                if (messageJSON["type"] === "addPlayer") {
                  let l = {playerNames}["playerNames"];
                  l.push(messageJSON["addPlayer"]);
                  setPlayerNames(l);
                };
                sleep(500);
                forceUpdate();
            }
          });
          const nicknameStr = nickname.toString();
          const message = {
            "type": "addPlayer",
            "addPlayer": nicknameStr
          }
          
          pubnub.publish(
            {
              channel: [{gameChannel}["gameChannel"]],
              message: {"text": JSON.stringify(message)}
            },
            function(status, response) {
              console.log(status);
              console.log(response);
              sleep(500);
              forceUpdate();
            }
          );
          setIsHost(false);
          setInLobby(true);
        }}
        nickname = {nickname}
        setNickname = {setNickname}
        gameID = {gameID}
        setGameID = {setGameID}
      />
    }
  }; 

  return (
    <div>
      {display}
    </div>
  )
}
