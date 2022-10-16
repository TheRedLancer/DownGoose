/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import React, { Component } from 'react'

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    /* Props
      playerList
      isHost
      onStartGame()
    */
  }

  render() {
    const playerNames = this.props.playerList.map((playerName) => 
      <li key={playerName}>
        {playerName}
      </li>
    );
    let startButton = null
    if (this.props.isHost) {
      startButton = <button onClick={this.props.onStartGame}>Start game</button>
    }
    return (
      <div className='lobby'>
        <h1>
          Join Code: {this.props.gameID}
        </h1>
        {playerNames}
        {startButton}
      </div>
    )
  }
}

