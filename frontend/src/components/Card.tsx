/**
  Author: Zach Burnaby
  Project: DownGoose
*/
type props = {
    active: boolean
    rotation: number
    image: string
    [key: string]: any
}

/**
 * @param {props} props 
 */
export default function Card(props: props) {
    return (
        <div className='player-card'>
            {props.image && 
            <img
                style={{
                    transform: `rotate(${(props.rotation % 4) * 90}deg)` 
                }}
                className={"card" + props.active ? "active" : ""}
                src={props.image} 
                alt="Card"
                width={50}
                height={50} 
            />}
        </div>
    )  
}
