import React, { Component } from 'react';
import './index.css';

class ThingsPane extends Component {
  
  updateThingInventory(thingID){
    this.props.updateThingsInventory(thingID);
  }
  renderThings(width) {

    return (
      <ul className="thingsList">
        {Object.entries(this.props.thingsInventory).map(([k,v]) => 
        <li className="thingListItem" >
          <Thing thingId={k} thing={v} width={width} updateThingInventory={(thingID) => this.updateThingInventory(thingID)}/>
        </li>
        )}
      </ul>
    )
  }

  render() {
    let style = {
     width: this.props.infoPaneWidth + 'px',
     height: this.props.infoPaneHeight + 'px',
     top: this.props.infoPaneTop + '0px',
     left: '0px',
    };

    return (
      <div className="thingsPane" style={style}>
        {this.renderThings(this.props.infoPaneWidth)}
      </div>
    );
  }
}

export default ThingsPane;

class Thing extends Component {

  handleClick(thing) {
    //alert("Clicked thing: " + thing);
    this.props.updateThingInventory(this.props.thingId);
  }

  render() {
    let bottomColor = 'lightgray';
    let leftColor = 'gray';
    let topColor = 'gray';
    let rightColor = 'lightgray';
    let backgroundColor = 'white'
    if(this.props.thing.selected) {
      bottomColor = 'gray';
      leftColor = 'lightgray';
      topColor = 'lightgray';
      rightColor = 'gray';
      backgroundColor = 'gray';
      
    }
    let style = {
      width: this.props.width / 14,
      height: this.props.width / 14,
      borderColor: topColor + ' ' + rightColor + ' ' + bottomColor + ' ' + leftColor,
      backgroundColor: backgroundColor,
    }

    return (
      <div className="thing" style={style} onClick={() => this.handleClick(this.props.thingId) }>   
        {this.props.thing.name}
      </div>
    );
  }
}