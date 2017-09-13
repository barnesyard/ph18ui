import React from 'react';
import './index.css';

class SubmittedGuesses extends React.Component {
  render() { 
    return (
      <div className="submissions">
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

export default  SubmittedGuesses;
