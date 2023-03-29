/**
  Author: Zach Burnaby
  Project: DownGoose
*/
type props = {
    active: boolean
    rotation: number | undefined
    image: string
    [key: string]: any
}

/**
 * @param {props} props 
 */
export default function Card(props: props) {
    let rotation = props.rotation || 0;

    return (
        <div className='player-card'>
            {props.image && 
            <img
                style={{
                    transform: `rotate(${(rotation % 4) * 90}deg)` 
                }}
                className={props.active ? "active" : ""}
                src={props.image} 
                alt="Card"
                width={50}
                height={50} 
            />}
        </div>
    )  
}
