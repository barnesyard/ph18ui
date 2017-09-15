import React, { Component } from 'react';

class Button extends Component {
  renderIcon() {
    if (this.props.img) {
      return <img src={this.props.img} alt={this.props.btnLabel} style={{maxHeight: '100%', maxWidth: '100%'}}/> 
    } else {
      return this.props.btnLabel;
    }
  }
  render () {
    let buttonStyle = {
      top: this.props.modeBtnTop + 'px',
      left: this.props.modeBtnLeft + 'px',
    };
    
    return (
      <button
        className="btn"
        style={buttonStyle}
        onClick={this.props.onClick}
        >
          {this.renderIcon()}
        </button>
    );
  }
}

export default Button;