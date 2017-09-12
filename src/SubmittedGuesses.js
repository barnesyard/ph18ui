import React, { Component } from 'react';
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
            {this.props.submissions.map(sub => <li key={sub.SubmissionId}>{sub.Attempt} response {sub.Response}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

export default  SubmittedGuesses;
