/**
    Author: Zach Burnaby
    Project: DownGoose
*/
import React from 'react'

/**
 * @param {Object} props
 * @param props.currentColor
 * @param props.calledColor
 * @param props.active
 * @param props.numberQuacked
 */
export default function PlayerButtons(props) {
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
            {(!props.active && props.currentColor === props.calledColor) &&
                <div className='player-choice'>
                    <button>
                        Stay at {props.currentColor}
                    </button>
                </div>
            }
            {(!props.active && props.currentColor != props.calledColor && props.calledColor === "quack") &&
                <div className='quack-message'>
                    Current player quacked {props.numberQuacked} times!
                </div>
            }
            {(!props.active && props.currentColor != props.calledColor && props.calledColor != "quack") &&
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
