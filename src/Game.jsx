/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import React from 'react'
import ColorCard from './ColorCard'
import GooseCardArea from './GooseCardArea'
import PlayerButtons from './PlayerButtons';
import colorCardData from './colorCardData.json';

export default function Game() {
  /* Props:
    gameChannel
    isHost
    currentPlayer
    playerNames
    endGame
  */
  
  const playerNames = ["player1", "player2", "player3"];
  const playerCardRotations = [2, 2, 3];
  const numPlayers = playerNames.length;
  const activePlayer = "player1";
  const playerColorCardColors = ["blue", "pink", "orange", "yellow"];
  const playerColorCard = colorCardData[
    playerColorCardColors[0] + "_" +
    playerColorCardColors[1] + "_" +
    playerColorCardColors[2] + "_" +
    playerColorCardColors[3]];
  const calledColor = "orange";
  const numberQuacked = 3;

  let notification = "";
  if (activePlayer === playerNames[0]) {
    notification = "It's your turn!"
  } else if (calledColor === "quack") {
    notification = "Active Player Quacked!";
  } else {
    notification = "Called color: " + calledColor;
  }

  return (
    <div className='game'>
      <h2>
        Notification: {notification}
      </h2>
      <GooseCardArea
        playerNames={playerNames.slice(1, numPlayers)}
        playerCardRotations={playerCardRotations.slice(1, numPlayers)}
        activePlayer={activePlayer}
      />
      {playerNames[0]}
      <ColorCard
        playerName={playerNames[0]}
        rotation={playerCardRotations[0]}
        active={activePlayer === playerNames[0]}
        colorCardImg={playerColorCard}
      />
      <PlayerButtons
        currentColor={playerColorCardColors[playerCardRotations[0]]}
        calledColor={calledColor}
        active={activePlayer === playerNames[0]}
        numberQuacked={numberQuacked}
      />
    </div>
  )
}