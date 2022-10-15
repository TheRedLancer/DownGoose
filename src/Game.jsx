import React from 'react'
import GooseCard from './GooseCard'

export default function Game() {

  const playerNames = ["player1", "player2", "player3", "player4"]
  const playerCards = [<GooseCard />, <GooseCard />, <GooseCard />, <GooseCard />]

  return (
    <div><GooseCard /></div>
  )
}