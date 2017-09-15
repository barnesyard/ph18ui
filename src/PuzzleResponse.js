import React from 'react';
import './index.css';

class PuzzleResponse extends React.Component {
  render() {
    // Set values to default as if there were no Submissions
    let responseText = '';
    let visibility = 'hidden';
    // The response is an element of the Submission object and puzzle object has an array of Submissions
    let subCount=this.props.puzzle.Submissions.length;
    // The list of submissions will be empty with no guesses
    if (subCount > 0 ) {
      responseText = this.props.puzzle.Submissions[0].Response ? this.props.puzzle.Submissions[0].Response : 'Invalid';
      visibility = 'visible'; 
    }
    let solvedTag = '';
    if(this.props.puzzle.Puzzle.Solved) {
      solvedTag = 'correct';
    } else {
      solvedTag = 'incorrect';
    }

    let style = {
      visibility: visibility,
      fontSize: this.props.textSize,
     };
   
    return (
      <div className={`responseBox ${solvedTag}`} style={style}>
        <div className="responseBoxText">
          {responseText}
        </div>
      </div>
    );
  }
}

export default PuzzleResponse;
