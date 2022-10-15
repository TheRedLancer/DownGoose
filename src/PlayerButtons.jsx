/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/
import React, { Component } from 'react'

export default class PlayerButtons extends Component {
  constructor(props) {
    super(props);
    //props.currentColor
    //props.calledColor
    //props.active
    //props.numberQuacked
  }

  render() {
    let buttons = null;
    if (this.props.active) {
      buttons =
        <div>
          <div className='player-choice-color'>
            <button>
              Orange
            </button> 
            <button>
              Yellow
            </button>
            <button>
              Blue
            </button> 
            <button>
              Pink
            </button>
          </div>
          <div>
            <button>
              QUACK!
            </button>
          </div>
        </div>
    } else {
      if (this.props.currentColor === this.props.calledColor) {
        buttons = 
        <div className='player-choice'>
          <button>
            Stay at {this.props.currentColor}
          </button>
        </div>
      } else if (this.props.calledColor === "quack") {
        buttons = 
        <div className='quack-message'>
          Current player quacked {this.props.numberQuacked} times!
        </div>
      } else {
        buttons = 
        <div className='player-choice'>
          <button>
            Stay at {this.props.currentColor}
          </button>
          <button>
            Change to {this.props.calledColor}
          </button>
        </div>
      }

    }
    return (
      <div>
        {buttons}
      </div>
    )
  }
}
