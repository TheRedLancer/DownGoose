/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import React from 'react'

export default class ColorCard extends React.Component {
  constructor(props) {
    //props.playerName
    //props.colorCard
    //props.rotation
    super(props);
  }

  render() {
    const rotateDeg = (this.props.rotation % 4) * 90;
    const imgClassName = this.props.active ? "card-active" : "card"
    return (
      <div className='color-card'>
        <img
          style={{ 
            transform: `rotate(${rotateDeg}deg)` 
          }}
          className={imgClassName}
          src={this.props.colorCard} 
          alt="ColorCard"
          width={50}
          height={50} 
        />
      </div>
    )
  }
  
}
