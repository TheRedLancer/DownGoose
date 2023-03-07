/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/
import React, { Component } from 'react'
import GooseCard from './GooseCard'

export default class GooseCardArea extends Component {
  constructor(props) {
    //props.playerNames
    //props.playerCardRotations
    //props.activePlayer
    super(props);
  }

  merge = (first, second) => {
    let out = []
    for (let i=0; i < first.length; ++i) {
      out.push([first[i], second[i]]);
    }
    return out;
  }

  render() {
    let players = this.merge(this.props.playerNames, this.props.playerCardRotations);
    const playerCards = players.map((player) =>
      <li key={player[0].toString()} className='player-card'>
        {player[0]} 
        <GooseCard
          rotation={player[1]} 
          active={this.props.activePlayer === player[0]}
        />
      </li>
    );
    return (
      <div>
          {playerCards}
      </div>
    )
  }
}
