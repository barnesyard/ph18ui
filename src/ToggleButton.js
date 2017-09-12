import React, { Component } from 'react';

class ToggleButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
        down: true,
    };
  }

  handleClick(event) {
    let pressedState = this.state.down;
    this.setState({down: !pressedState})
    this.props.onClick(event, this.props.descriptor, 'filteredArcs')
  }

  render () {
    let imgSrc = this.props.img

    return (
      <div
        key={this.props.key}
        className={`toggleBtn ${this.state.down ? 'toggleBtnDown' : 'toggleBtnUp'}`}
        onClick={(e) => this.handleClick(e)}
      >
        {this.props.img && <img src={imgSrc} className="btnImage" alt={this.props.altText}/>}
      </div>
    );
  }
}

export default ToggleButton;