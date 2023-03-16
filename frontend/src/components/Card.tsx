/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import React from 'react'

type props = {
    active: boolean
    rotation: number
    image: string
}

/**
 * @param {props} props 
 */
export default function Card(props: props) {
    return (
        <div className='player-card'>
            <img
                style={{
                    transform: `rotate(${(props.rotation % 4) * 90}deg)` 
                }}
                className={"card" + props.active ? "active" : ""}
                src={props.image} 
                alt="Card"
                width={50}
                height={50} 
            />
        </div>
    )  
}
