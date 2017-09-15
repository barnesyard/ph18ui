import React from 'react';
import './index.css';

class AnswerForm extends React.Component {

  handleSubmit(event) {
    event.preventDefault();

    const input = document.getElementById("guessInput");
    console.log("going to guess this: "+input.value);
    if (input.value !== '' && this.props.submitability === 0) {
      this.props.submitGuess(input.value);
      input.value = "";
    }
  }

  render() {
    let placeHolderText = 'Submit answer here';
    let labelClassName = 'txtInputLabel';
    let inputClassName = 'txtInput';
    // Handle temporary lockout
    if(this.props.submitability === 3) {
      console.log("We are temporary locking the UI");
      placeHolderText = 'Locked out. Remaining time: ' + this.props.lockedTimeRemaining;
      labelClassName = 'txtInputLabeltemplock';
      inputClassName = 'txtInputtemplock';
    } 
    // Handle permanent lockout
    if(this.props.submitability === 4) {
      console.log("We are permanently locking the UI");
      placeHolderText = 'Permanently locked out. Send email to resolve. ';      
      labelClassName = 'txtInputLabelpermanentlock';
      inputClassName = 'txtInputpermanentlock';
    } 
    return (
      <form className={this.props.tag + 'answerForm'} onSubmit={e => this.handleSubmit(e)}>
        <input className="btnSubmit" type="submit" value="Submit" style={{fontSize: this.props.textSize}}/>
        <label className={labelClassName}  style={{fontSize: this.props.textSize}}>
          <input id="guessInput" className={inputClassName} type="text" placeholder={placeHolderText}/>
        </label>
      </form>
    );
  }
}

AnswerForm.defaultProps = {
  tag: ''
}

export default AnswerForm;
