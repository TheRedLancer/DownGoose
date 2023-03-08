/*
  Author: Zach Burnaby
  Project: DownGoose
*/
import React from 'react'

/**
 * 
 * @param {Object} props 
 * @param props.active
 * @param props.rotation
 * @param props.image
 */
export default function Card(props) {
    return (
        <div className='player-card'>
            <img
                style={{
                    transform: `rotate(${(props.rotation % 4) * 90}deg)` 
                }}
                className={"card" + props.active ? "active" : ""}
                src={props.image} 
                alt="ColorCard"
                width={50}
                height={50} 
            />
        </div>
    )  
}
