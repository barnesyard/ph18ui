import React, { Component } from 'react';
import './index.css';
import Button from './Button.js';
import AnswerForm from './AnswerForm.js';
import SubmittedGuesses from './SubmittedGuesses.js';
import PuzzleResponse from './PuzzleResponse.js';
import closeIcon from './assets/img/close.svg';
import openIcon from './assets/img/open.svg';

class PuzzleDiag extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: null,
      pageNumber: null,
      total: null,
      stuff: null,
    };
  }

  handleClick(e) {
    e.stopPropagation();
  }

  handleKeyPress(e) {
    console.log("the key pressed: " + e.key)
    if(e.key === 'escape') {
      this.props.close();
    }
  }

  handleOpenPdf() {
    window.open(this.props.puzzle.Puzzle.PuzzleURL);
  }
  handleClose() {
    this.props.close();
  }

  render() {
    //get the path to the thumbnail
    let pdfPath = this.props.puzzle["Puzzle"].PuzzleURL;
    let lastSlash = pdfPath.lastIndexOf("/");
    let pngPath = "Puzzles/Thumbnails/"
    let pngName = pdfPath.substring(lastSlash+1, pdfPath.length).replace('pdf', 'png');
    if (pdfPath.includes('.htm')) {
      console.log("The Puzzle URL: " + pdfPath);
      pngName = pdfPath.substring(lastSlash+1, pdfPath.length).replace('htm', 'png');
      console.log('The pngName is ' + pngName);
    }
    if (pdfPath.includes('.aspx')) {
      console.log("The Puzzle URL: " + pdfPath);
      pngName = pdfPath.substring(lastSlash+1, pdfPath.length).replace('aspx', 'png');
      console.log('The pngName is ' + pngName);
    }
    let pngFullPath = pngPath + pngName;

    let style = {
      width: this.props.puzzDiagWidth + 'px',
      height: this.props.puzzDiagHeight + 'px',
      left: this.props.puzzDiagLeft,
    };

    // we want the PDF to be 0.8* height of the puzzle dialog
    //assuming the PDF pages are all 8.5x11 we can calculate the width we want
    let pdfWidth = ( 0.8 * this.props.puzzDiagHeight * 8.5 / 11); 
    let pdfStyle = {
      width: pdfWidth + 'px',
    };

    let titleSize, submitSize, summarySize;
    if(this.props.viewIsWide) {
      titleSize = 'calc(10/9 * 5vh)';
      submitSize = 'calc(10/9 * 2.4vh)';
      summarySize = 'calc(10/9 * 2.1vh)';
    } else {
      titleSize = 'calc(10/16 * 5vw)';
      submitSize = 'calc(10/16 * 2.4vw)';
      summarySize = 'calc(10/16 * 2.1vw)';
    }

    let titleStyle = {fontSize: titleSize}
    return (
      <div className="puzzleDiag" style={style}
        onClick={(event) => this.handleClick(event)}
        onKeyPress = {(event) => {this.handleKeyPress(event)}}>
        <div className="puzzleTitle" style={titleStyle}>{this.props.puzzle.Puzzle.PuzzleName}</div>
        <div className="answersPane">
          <AnswerForm submitGuess={guess => this.props.submitGuess(this.props.puzzle.Puzzle.PuzzleId, guess)} 
            textSize={submitSize} 
            submitability={this.props.puzzle.SubmissionAbilityReason}
            lockedTimeRemaining={this.props.puzzle.TimeUntilBanRemoved}/>
          <PuzzleResponse puzzle={this.props.puzzle} textSize={summarySize}/>
          <SubmittedGuesses 
            submissions={this.props.puzzle.Submissions} 
            textSize={summarySize}/>
        </div>
        <Button key="openPdfButton"
          onClick={() => this.handleOpenPdf()}
          modeBtnTop={10}
          modeBtnLeft={this.props.puzzDiagWidth - 100 }
          btnLabel="^"
          img={openIcon}
        />
        <Button key="closeButton"
          onClick={() => this.handleClose()}
          modeBtnTop={10}
          modeBtnLeft={this.props.puzzDiagWidth - 40 }
          btnLabel="X"
          img={closeIcon}
        />
        <div className="pdfViewer" style={pdfStyle} onClick={() => this.handleOpenPdf()}>
          <img src={pngFullPath} alt='puzzleIcon' style={{width: '95%'}} />
        </div>
      </div>
    );
  }
}

export default PuzzleDiag;
