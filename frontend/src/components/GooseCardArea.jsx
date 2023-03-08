/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/
import React from 'react'
import gooseCard from '/goose/v2/square-card-back.png'
import utils from '../utils'

/**
 * @param {Object} props
 * @param props.playerNames
 * @param props.playerCardRotations
 * @param props.activePlayer
 */
export default function GooseCardArea(props) {
    return (
        <div>
            {utils.zip(props.playerNames, props.playerCardRotations).map((player) =>
            <li key={player[0].toString()} className='player-card'>
                {player[0]}
                <Card
                    rotation={player[1]} 
                    active={props.activePlayer === player[0]}
                    image={gooseCard}
                />
            </li>)}
        </div>
    )
}
