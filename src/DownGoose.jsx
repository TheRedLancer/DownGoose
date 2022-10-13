import { usePubNub } from 'pubnub-react'
import React, { useState, useEffect } from 'react'
import { customAlphabet } from 'nanoid'
import Game from './Game'

export default function DownGoose() {
  const pubnub = usePubNub();
  const nanoid = customAlphabet('1234567890', 5);
  const [isDisabled, setDisabled] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [nickname, setNickname] = useState("");

  const lobbyChannel = null;
  const gameChannel = null;
  const roomID = null;
  
  return (
    <div>
      <div className="title">
        <h1>DownGoose!</h1>
      </div>
      <div className='logo'>
        GooseImageHere
      </div>
      {
        !{isPlaying} &&
        <div className='lobby-form'>
          <textarea 
            className="nickname" 
            style={{
              resize:"none"
            }} 
            value={nickname} 
            onChange={e => {
              const value = e.target.value.replace(/[\r\n\v" "]+/g, "");
              setNickname(value)
            }} 
            rows="1"
            maxLength={16}
          />
          <button
            className="create-button"
            disabled={isDisabled}
            onClick={(e) => this.onPressCreate()}
            > Create
          </button>
          <button
            className="join-button"
            onClick={(e) => this.onPressJoin()}
            > Join
          </button>
        </div>
      }
      {
        {isPlaying} &&
        <Game
          pubnub={pubnub}
          gameChannel={gameChannel}
          isHost={isHost}
          myTurn={myTurn}
          playerNames={playerNames}
          endGame={endGame}
        />
      }
    </div>
  )
}
