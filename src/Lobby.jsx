import React from 'react'

export default function Lobby(props) {
  return (
    <div>
      <div className="title">
          <h1>DownGoose!</h1>
        </div>
        <div className='logo'>
          GooseImageHere
        </div>
      <div className='lobby-form'>
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
