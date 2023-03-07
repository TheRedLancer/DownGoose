import React, { Component } from 'react'
import Game from './Game'

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
    this.roomID = null;
  }

  onPressCreate = (e) => {
    shortid.characters('0123456789');
    this.roomID = shortid.generate().substring(0,5);
    this.lobbyChannel = "downgooselobby".concat("--", this.roomID); // Lobby channel name
    if (import.meta.env.VITE_DEV === "true") {
      console.log("Room ID:" + this.roomID);
      console.log("lobbyChannel:" + this.lobbyChannel);
    }
    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true // Checks the number of people in the channel
    });
  }

  onPressJoin = (e) => {
    console.log("PressedJoin");
  }

  render() {
    return (
      <div>
        <div className="title">
          <h1>DownGoose!</h1>
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