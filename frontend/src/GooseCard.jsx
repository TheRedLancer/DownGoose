/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/
import React, { Component } from 'react'
import gooseCard from '/goose/v2/square-card-back.png'

export default class GooseCard extends Component {
  constructor(props) {
    super(props);
    //props.rotation
    //props.active
  }

  render() {
    const rotateDeg = (this.props.rotation % 4) * 90;
    const imgClassName = this.props.active ? "card-active" : "card"
    return (
      <div
        className="goose-card">
      <img
          style={{
            transform: `rotate(${rotateDeg}deg)` 
          }}
          className={imgClassName}
          src={gooseCard} 
          alt="ColorCard"
          width={50}
          height={50} 
        />
      </div>
    )
  }
}
