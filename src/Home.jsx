/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import React from 'react'

export default function Home(props) {
  return (
    <div>
      <div className="title">
          <h1>DownGoose!</h1>
        </div>
        <div className='goose-image'>
          <img
            className="home-goose-image"
            src="/goose/goose.png"
            alt="ColorCard"
            width={100}
            height={100} 
          />
        </div>
      <div className='lobby-form'>
        <p>Nickname:</p>
        <textarea 
          className="nickname" 
          style={{
            resize:"none"
          }}
          value={props.nickname} 
          onChange={e => {
            const value = e.target.value.replace(/[\r\n\v" "]+/g, "");
            props.setNickname(value)
          }} 
          rows="1"
          maxLength={16}
        />
        <p>Join Code</p>
        <textarea 
          className="gameJoinCode" 
          style={{
            resize:"none"
          }}
          value={props.gameJoinCode} 
          onChange={e => {
            const value = e.target.value.replace(/[\r\n\v" "]+/g, "");
            props.setGameID(value)
          }} 
          rows="1"
          maxLength={16}
        />
        <p></p>
        <button
          className="host-button"
          onClick={props.onPressHost}
          > Host
        </button>
        <button
          className="join-button"
          onClick={props.onPressJoin}
          > Join
        </button>
      </div>
    </div>
  )
}
