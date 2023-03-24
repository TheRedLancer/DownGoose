/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import Card from './Card'
import gooseCard from '/goose/gooseBack.png'

type props = {
    players: GamePlayer[]
    activePlayer: string
    [key: string]: any
}

/**
 * @param {props} props
 */
export default function GooseCardArea(props: props) {
    return (
        <div>
            {props.players.map(player =>
            <li key={player.id} className='player-card'>
                {player.nickname}
                <Card
                    rotation={player.currentRotation} 
                    active={props.activePlayer === player.id}
                    image={gooseCard}
                />
            </li>)}
        </div>
    )
}
