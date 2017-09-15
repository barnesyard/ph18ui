import React, { Component } from 'react';
import './index.css';
import door from './assets/svg/door.svg'
import AnswerForm from './AnswerForm.js';
import SubmittedGuesses from './SubmittedGuesses.js';
import Button from './Button.js';


/////////////////////////////////////////////////////////////////////////////
// This class will only be used when it is the first puzzle of the event
class OpeningScene extends Component {

  render() {
    let submitSize;
    if(this.props.viewIsWide) {
      submitSize = 'calc(10/9 * 2.7vh)';
    } else {
      submitSize = 'calc(10/16 * 2.7vw)';
    }

return (
      <div className="openingScene">
        <div className='eventTitle'>The Puzzling Zone</div>
        <Button
          onClick={() => {window.location.href="default.aspx"}}
          modeBtnTop = {10}
          modeBtnLeft = {10}
          btnLabel = "H"
          img={this.props.homeIcon}
        />
        <div className="firstPuzzle">
          <img src={door} className='doorItem' alt={'door'} style={{maxHeight: '100%', maxWidth: '100%'}}/>
        </div>
        {this.props.eventStarted && 
          <AnswerForm 
            tag='opening'
            testSize={submitSize} 
            submitGuess={guess => this.props.submitGuess(this.props.puzzle.Puzzle.PuzzleId, guess)}/>
        }
        {this.props.eventStarted && this.props.puzzle &&
          <SubmittedGuesses tag='opening' submissions={this.props.puzzle.Submissions}/>
        }
      </div>     
      );
  }
}

export default OpeningScene;
