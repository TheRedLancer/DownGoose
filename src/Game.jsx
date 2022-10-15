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
  const playerCardRotations = [1, 3, 1, 2, 2, 3];
  const playerColorCard = colorCard1;
  const numPlayers = playerNames.length;
  const activePlayer = "player4";

  return (
    <div className='game'>
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
      <PlayerButtons />
    </div>
  )
}