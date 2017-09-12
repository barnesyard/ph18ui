import React, { Component } from 'react';
import './index.css';

class AnswerForm extends React.Component {

  handleSubmit(event) {
    event.preventDefault();

    const input = document.getElementById("guessInput");
    console.log("going to guess this: "+input.value);
    this.props.submitGuess(input.value);
    input.value = "";
  }

  render() {
    return (
      <form className="answerForm" onSubmit={e => this.handleSubmit(e)}>
        <input className="btnSubmit" type="submit" value="Submit" />
        <label className="txtInputLabel" >
          <input id="guessInput" className="txtInput" type="text" placeholder="Submit answer here"/>
        </label>
      </form>
    );
  }
}

export default AnswerForm;
