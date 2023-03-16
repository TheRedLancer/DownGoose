/**
    Author: Zach Burnaby
    Project: DownGoose
*/
type props = {
    currentColor: number
    calledColor: number
    active: boolean
    numberQuacked: number
    [key: string]: any
}

/**
 * @param {props} props
 */
export default function PlayerButtons(props: props) {
    return (
        <div>
            {props.active && 
                <div>
                    <div className='player-choice-color'>
                        <button>Orange</button> 
                        <button>Yellow</button>
                        <button>Blue</button> 
                        <button>Pink</button>
                    </div>
                    <div>
                        <button>QUACK</button>
                    </div>
                </div>
            }
            {(!props.active && props.currentColor) &&
                <div className='player-choice'>
                    <button>
                        Stay at {props.currentColor}
                    </button>
                </div>
            }
            {(!props.active && props.currentColor != props.calledColor && props.calledColor === 4) &&
                <div className='quack-message'>
                    Current player quacked {props.numberQuacked} times!
                </div>
            }
            {(!props.active && props.currentColor != props.calledColor && props.calledColor != 4) &&
                <div className='player-choice'>
                <button>
                    Stay at {props.currentColor}
                </button>
                <button>
                    Change to {props.calledColor}
                </button>
                </div>
            }
        </div>
    )
}
