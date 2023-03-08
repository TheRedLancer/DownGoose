/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/
import React from 'react'
const playerList = ["Zach", "Maddie", "Dan"];

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
                {/* Join Code: {props.roomCode} */}
                Join Code: ABCD
            </h1>
            {playerList.map((playerName) => 
                <li key={playerName}>
                    {playerName}
                </li>
            )}
            {/* <button onClick={props.onStartGame} disabled={!props.isHost}>Start game</button> */}
        </div>
    )
}

