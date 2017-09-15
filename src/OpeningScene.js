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

    let submitability = -1;
    let submissions = [];
    let lockedTime = 0;
    console.log("Render the opening scene!");
    if (this.props.puzzle){
      submitability = this.props.puzzle.SubmissionAbilityReason;
      submissions = this.props.puzzle.Submissions;
      lockedTime = this.props.puzzle.TimeUntilBanRemoved;
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
            textSize={submitSize} 
            submitGuess={guess => this.props.submitGuess(this.props.puzzle.Puzzle.PuzzleId, guess)}
            submitability={submitability}
            lockedTimeRemaining={lockedTime}/>
        }
        {this.props.eventStarted &&
          <SubmittedGuesses tag='opening' submissions={submissions}/>
        }
      </div>     
      );
  }
}

export default OpeningScene;
