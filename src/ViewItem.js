import React, { Component } from 'react';
import './index.css';

class ViewItem extends Component {

  handleClick() {
    // There will be decorative objects that won't be clickable. Those won't have a puzzle associated with them.
    if (this.props.puzzleName) {
      // Pass the puzzle Name that is associated with the room items back up to game object
      // where it will do the right thing. Some puzzles may require an object before the item is clickable. 
      this.props.roomItemClicked(this.props.puzzleName, this.props.requiredItems);
    }
  }

  render() {
    let status = this.props.getRoomItemStatus(this.props.puzzleName);
    let grayscale = status === 'unlocked' ? 'grayscale(100%)' : 'grayscale(0%)';
    // console.log ("The name: " + this.props.name);
    if (this.props.name.includes('Background')) {
      // console.log("The name contained background so use grayscale: " + this.props.roomGrayScale);
      grayscale = 'grayscale(' + Math.round(this.props.roomGrayScale) + '%)';
      // console.log('Now the grayscale is:' + grayscale);
    }
    let style = {
      width: this.props.width,
      position: 'absolute',
      top: this.props.top,
      left: this.props.left,
      filter: grayscale, // this will allow us to idicate things that have not been clicked
    };

    //let className = this.props.name.includes('Background') ? 'viewItem.Background' : 'viewItem';
    let className = 'viewItem';
    return (
      (status === 'hidden') ?  null : 
      <img src={this.props.svg} 
          className={className} 
          alt={this.props.name} 
          style={style} 
          onClick={() => this.handleClick()}/>
    );
  }
}

export default ViewItem;