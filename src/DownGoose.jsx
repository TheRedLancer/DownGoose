import React, { Component } from 'react'
import Game from './Game';

export default class DownGoose extends Component {
  constructor(props) {
    super();
    this.state = {
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
      joinCode: ""
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;
  }

  render() {
    return (
      <div>
        <div className="title">
          <p>DownGoose!</p>
        </div>
        {
          !this.state.isPlaying &&
          <div className="lobby">
            <div className="button-container">
              <button
                className="create-button "
                disabled={this.state.isDisabled}
                onClick={(e) => this.onPressCreate()}
                > Create
              </button>
              <button
                className="join-button"
                onClick={(e) => this.onPressJoin()}
                > Join
              </button>
            </div>
          </div>
        }
        {
        this.state.isPlaying &&
        <Game
          pubnub={this.pubnub}
          gameChannel={this.gameChannel}
          piece={this.state.piece}
          isRoomCreator={this.state.isRoomCreator}
          myTurn={this.state.myTurn}
          xUsername={this.state.xUsername}
          oUsername={this.state.oUsername}
          endGame={this.endGame}
        />
      }
      </div>
    )
  }
}