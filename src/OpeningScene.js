import React, { Component } from 'react';
import './index.css';
import door from './assets/svg/door.svg'
import AnswerForm from './AnswerForm.js';
import SubmittedGuesses from './SubmittedGuesses.js';


/////////////////////////////////////////////////////////////////////////////
// This class will only be used when it is the first puzzle of the event
class OpeningScene extends Component {

  render() {
    console.log("This is number of submissions: " + this.props.puzzle.Submissions.length);
    return (
      <div className="openingScene">
        <div className='eventTitle'>The Puzzling Zone</div>
        <div className="firstPuzzle">
          <img src={door} className='doorItem' alt={'door'} />
        </div>
        {this.props.eventStarted && 
        <AnswerForm tag='opening' submitGuess={guess => this.props.submitGuess(this.props.puzzle.Puzzle.PuzzleId, guess)}/>
        }
        {this.props.eventStarted && this.props.puzzle.Submissions.length &&
        <SubmittedGuesses submissions={this.props.puzzle.Submissions}/>
        }
      </div>     
      );
  }
}

export default OpeningScene;
