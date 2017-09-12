import React, { Component } from 'react';
import './index.css';
import door from './assets/svg/door.svg'
import AnswerForm from './AnswerForm.js';
import SubmittedGuesses from './SubmittedGuesses.js';
import PuzzleAnswer from './PuzzleAnswer.js';
import PuzzleResponse from './PuzzleResponse.js';


/////////////////////////////////////////////////////////////////////////////
// This class will only be used when it is the first puzzle of the event
class FirstPuzzle extends Component {

  render() {

    
    return (
      <div className="firstScene">
        <div className='eventTitle'>The Puzzling Zone</div>
        <div className="firstPuzzle">
          <img src={door} 
          className='doorItem' 
          alt={'door'} />
          <AnswerForm submitGuess={guess => this.props.submitGuess(this.props.puzzle.Puzzle.PuzzleId, guess)}/>
          <PuzzleResponse puzzle={this.props.puzzle}/>
          <PuzzleAnswer puzzle={this.props.puzzle}/>
          <SubmittedGuesses submissions={this.props.puzzle.Submissions}/>
        </div>     
      </div>     
      );
  }
}

export default FirstPuzzle;
