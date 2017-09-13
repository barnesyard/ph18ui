import React, { Component } from 'react';
import './index.css';
import Button from './Button.js';
import AnswerForm from './AnswerForm.js';
import SubmittedGuesses from './SubmittedGuesses.js';
import PuzzleAnswer from './PuzzleAnswer.js';
import PuzzleResponse from './PuzzleResponse.js';

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

    return (
      <div className="puzzleDiag" style={style}
        onClick={(event) => this.handleClick(event)}>
        <div className="puzzleTitle">{this.props.puzzle["Puzzle"].PuzzleName}</div>
        <AnswerForm submitGuess={guess => this.props.submitGuess(this.props.puzzle.Puzzle.PuzzleId, guess)}/>
        <PuzzleResponse puzzle={this.props.puzzle}/>
        <PuzzleAnswer puzzle={this.props.puzzle}/>
        <SubmittedGuesses submissions={this.props.puzzle.Submissions}/>
        <Button key="openPdfButton"
          onClick={() => this.handleOpenPdf()}
          modeBtnTop={10}
          modeBtnLeft={this.props.puzzDiagWidth - 100 }
          btnLabel="^"
        />
        <Button key="closeButton"
          onClick={() => this.handleClose()}
          modeBtnTop={10}
          modeBtnLeft={this.props.puzzDiagWidth - 40 }
          btnLabel="X"
        />
        <div className="pdfViewer" style={pdfStyle} onClick={() => this.handleOpenPdf()}>
          <img src={pngFullPath} alt='puzzleIcon' style={{width: '95%'}} />
        </div>
      </div>
    );
  }
}

export default PuzzleDiag;
