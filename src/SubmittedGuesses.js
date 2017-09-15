import React from 'react';
import './index.css';

class SubmittedGuesses extends React.Component {
  render() { 
    let subCount=this.props.submissions.length;
    // The list of submissions will be empty with no guesses
    let visibility = 'hidden'
    if (subCount > 0 ) {
      visibility = 'visible'; 
    }
    let style = {
      visibility: visibility,
      fontSize: this.props.textSize,
    }

    return (
      <div className={this.props.tag + "submissions"} style={style}>
        <div className="submissionsLabel">
          Submission History
        </div>
        <div className="submissionsList">
          <ul>
            {this.props.submissions.map(sub => {
              console.log("Busy mapping responses: " + sub.Attempt);
              let response = sub.Response ? sub.Response : '';
              return <li key={sub.SubmissionId}>{sub.Attempt} {response}</li>
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

SubmittedGuesses.defaultProps = {
  tag: ''
}

export default  SubmittedGuesses;
