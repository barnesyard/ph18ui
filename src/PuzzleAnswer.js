import React from 'react';
import './index.css';

class PuzzleAnswer extends React.Component {
  render() {
    let answerText = '';
    let visibility = 'hidden';
    if (this.props.puzzle.Puzzle.Solved) {
      visibility = 'visible';
      answerText = this.props.puzzle.Submissions[0].Attempt;
    }
    let style = {
      visibility: visibility,
     };
  
    return (
      <div className={`answerBox`} style={style}>
        <div className="answerBoxLabel">
          Answer
          <div className="answerBoxText">
            {answerText}
          </div>
        </div>
      </div>
    
    );
  }
}

export default PuzzleAnswer;
