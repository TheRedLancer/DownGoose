/*
  Author: Zach Burnaby
  Project: DownGoose
*/
import React from 'react'

export default function Lobby(props) {
    /* Props
      playerList
      isHost
      roomCode
      onStartGame()
    */
    return (
        <div className='lobby'>
            <h1>
                Join Code: {props.roomCode || "No room code"}
            </h1>
            {(props.playerList || []).map((playerName) => 
                <li key={playerName}>
                    {playerName}
                </li>
            )}
            {/* <button onClick={props.onStartGame} disabled={!props.isHost}>Start game</button> */}
        </div>
    )
}

