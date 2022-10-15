import React from 'react'
import gooseCard1 from '/goose/v2/front-blue1.png'

export default class GooseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotation: 90,
      styles: { 
        transform: `rotate(${0}deg)` 
      }
    };
    this.rotate = this.rotate.bind(this);
  }
  // 0↑, 1←, 2↓, 3→
  orientation = 0;
  colorPattern = ["Orange", "Blue", "Pink", "Yellow"];

  rotate(){
    let newRotation = this.state.rotation + 1;
    if(newRotation >= 4){
      newRotation = 0;
    }
    this.setState({
      rotation: newRotation,
      styles: {
        transform: `rotate(${newRotation * 90}deg)`
      }
    })
  };

  render() {
    const { rotation } =  this.state.rotation;
    return (
      <div>
        <button onClick={this.rotate} />
        <img 
          style={this.state.styles}
          className='goose-card-img'
          src={gooseCard1} 
          alt="Logo"
          width={200}
          height={200} 
        />
      </div>
    )
  }
  
}
