/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import React from 'react'
import ColorCard from './ColorCard'
import GooseCardArea from './GooseCardArea'
import PlayerButtons from './PlayerButtons';
import colorCard1 from '/goose/v2/front-blue1.png'

export default function Game() {
  
  const playerNames = ["player1", "player2", "player3", "player4", "player5", "player6"];
  const playerCardRotations = [3, 2, 3, 1, 2, 2];
  const playerColorCard = colorCard1;
  const numPlayers = playerNames.length;
  const activePlayer = "player2";
  const playerColorCardColors = ["blue", "pink", "yellow", "orange"];
  const calledColor = "blue";
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
        colorCard={playerColorCard}
        active={activePlayer === playerNames[0]}
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