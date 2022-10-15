/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import { usePubNub } from 'pubnub-react'
import React, { useState, useEffect } from 'react'
import { customAlphabet } from 'nanoid'
import Game from './Game'
import Lobby from './Lobby'

export default function DownGoose() {
  const pubnub = usePubNub();
  const nanoid = customAlphabet('1234567890', 5);
  const [isDisabled, setDisabled] = useState(false);
  const isPlaying = true;
  const [nickname, setNickname] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerNames, setPlayerNames] = useState(null);
  const [endGame, setEndGame] = useState(false);

  const lobbyChannel = null;
  const gameChannel = null;
  const roomID = null;

  // let display = (isPlaying === true) ?
  //   <Lobby
  //     onPressHost = {() => {
  //       console.log("onPressHost()");
  //       console.log(isPlaying);
  //     }}
  //     onPressJoin = {() => {
  //       console.log("onPressJoin()");
  //     }}
  //     nickname = {nickname}
  //     setNickname = {setNickname}
  //   /> :
    let display = <Game
      pubnub={pubnub}
      gameChannel={gameChannel}
      isHost={isHost}
      currentPlayer={currentPlayer}
      playerNames={playerNames}
      endGame={endGame}
    />
  ;
  

  return (
    <div>
      {display}
    </div>
  )
}
