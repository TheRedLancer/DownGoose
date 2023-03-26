import { colorMap } from '../colorCardData';

/**
    Author: Zach Burnaby
    Project: DownGoose
*/
type props = {
    currentColor: number
    action: number
    active: boolean | undefined
    numberQuacked: number
    select: (action: number) => void
    respondColor: (isRotating: boolean) => void
    respondQuack: () => void
    [key: string]: any
}

/**
 * @param {props} props
 */
export default function PlayerButtons(props: props) {
    const activeOptions = <div>
            <div className='player-choice-color'>
                <button onClick={() => props.select(0)} color={colorMap[0]}>{colorMap[0]}</button> 
                <button onClick={() => props.select(1)} color={colorMap[1]}>{colorMap[1]}</button>
                <button onClick={() => props.select(2)} color={colorMap[2]}>{colorMap[2]}</button> 
                <button onClick={() => props.select(3)} color={colorMap[3]}>{colorMap[3]}</button>
            </div>
            <div>
                <button onClick={() => props.select(4)}>QUACK</button>
            </div>
        </div>
    
    const quackMessage = <div className='quack-message'>
            Current player quacked {props.numberQuacked} times!
            <button onClick={() => props.respondQuack()}>ready</button>
        </div>

    const responseOptions = <div className='player-choice'>
        <button onClick={() => props.respondColor(false)}>
            Stay at {colorMap[props.currentColor]}
        </button>
        <button onClick={() => props.respondColor(true)}>
            Change to {colorMap[props.action]}
        </button>
        </div>
    
    const waiting = <div className="waiting">
            Waiting for current player...
        </div>

    if (props.active) {
        return activeOptions;
    } else if (props.action === 4) {
        return quackMessage;
    } else if (props.action !== -1) {
        return responseOptions;
    } else {
        return waiting;
    }
}
