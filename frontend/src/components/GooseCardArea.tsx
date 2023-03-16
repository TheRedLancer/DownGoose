/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import Card from './Card'
import gooseCard from '/goose/v2/square-card-back.png'
import utils from '../utils'

type props = {
    playerNames: string[]
    playerCardRotations: number[]
    activePlayer: string
}

/**
 * @param {props} props
 */
export default function GooseCardArea(props: props) {
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
