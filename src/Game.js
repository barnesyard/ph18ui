import React, { Component } from 'react';
import './index.css';
import ViewPane from './ViewPane.js';
import ThingsPane from './ThingsPane.js';
import ListPane from './ListPane.js';
import Button from './Button.js';
import FirstPuzzle from './FirstPuzzle.js';
import PuzzleDiag from './PuzzleDiag.js';
import { Database } from './Database.js';

// Data that will not be pulled from the database should be pulled into the UI here
import { viewData } from './viewdata.js';


// The Game class contains all the UI the users will interact with. The view and the list pane and 
// the info pane will all reside in the Game Div. The intent here it to have this div retain the 
// 16:9 ratio.
class Game extends Component {

  constructor(props) {
    super(props);

    //store the original height and width of the window to create a scaling factor
    if ((this.props.appWidth / this.props.appHeight) > 16 / 9 ) {
      this.origWidth = this.props.appHeight / 9 * 16;
      this.origHeight = this.props.appHeight;
    } else {
      this.origHeight = this.props.appWidth / 16 * 9;
      this.origWidth = this.props.appWidth;
    }

    this.db = new Database();
    let thingsInventory = this.db.getThingsInventory();

    this.state = {
      isInfoMode: false,
      renderedPuzzle: null,
      origWidth: this.props.appWidth,
      origHeight: this.props.appHeight,
      thingsInventory: thingsInventory,
      currentView: 0,
      totalPuzzleCount: 0
    };

    // Call this method to set puzzle list, it sets the state 
    this.updatePuzzleList();
    this.showFirstPuzzle();
  }

  updateThingsInventory(thingId) {
    let theThing = this.state.thingsInventory[thingId];
    theThing.selected = !theThing.selected;
    let things = this.state.thingsInventory;
    things[thingId] = theThing;
    this.setState({thingsInventory: things});
  }

  /////////////////////////////////////////////////////////////////////////////
  // Use this to call the backend to get a list of all the currently unlocked
  // puzzles. It makes an ansynchronous call which updates the state.
  updatePuzzleList() {
    console.log("Updating the list of puzzles from the DB");
    //Setting the URI as a relative path that works locally and on server too
    let apiPuzzlesURI = 'api/puzzles';
    
    let apiPuzzles = new XMLHttpRequest();
    apiPuzzles.open('GET', apiPuzzlesURI, true);
    apiPuzzles.onload = () => {
      if (apiPuzzles.status >= 200 && apiPuzzles.status < 400) {
        // Success!
        let puzzles = JSON.parse(apiPuzzles.responseText);
        // We have the list of puzzles now. It is the right time to add stuff
        // needed by the UI.

        // Add path to thumbnails to each item in the puzzle list
        // It passes the list by reference so no need to return a new list
        this.addThumbnailInfo(puzzles);
        
        let totalPuzzleCount = puzzles.length;

        // Create a list of puzzles that have not been viewed and save them in the state
        let viewedPuzzles = this.getViewedPuzzles(puzzles);

        let newPuzzleCount = totalPuzzleCount - viewedPuzzles.length;

        this.setState({ 
          puzzleList: puzzles,
          totalPuzzleCount: totalPuzzleCount,
          viewedPuzzleList: viewedPuzzles,
          newPuzzleCount: newPuzzleCount,
        });
      } else {
        // ERROR HANDLING
        // I really should do something if there is an error but I am not sure what
      }

    }
    apiPuzzles.send();
  }  

  addThumbnailInfo(puzzles) {
    puzzles.map(puzzle => {
      //console.log("the puzzle pdf: " + puzzle.PuzzleURL);

      let pdfPath = puzzle.PuzzleURL ? puzzle.PuzzleURL : "missing.png";
      let lastSlash = pdfPath.lastIndexOf("/");
      let pngPath = "Puzzles/Thumbnails/"
      // This assumes all puzzles have pdf files. Need to see if there is htm or html files
      let pngName = pdfPath.substring(lastSlash+1, pdfPath.length).replace('pdf', 'png');
      if (pdfPath.includes('.htm')) {
        console.log("The Puzzle URL: " + pdfPath);
        pngName = pdfPath.substring(lastSlash+1, pdfPath.length).replace('htm', 'png');
        console.log('The pngName is ' + pngName);
      }
      let pngFullPath = pngPath + pngName;      
      puzzle.PuzzleThumb = pngFullPath;
      //console.log("the puzzle thumbnail: " + puzzle.PuzzleThumb);
    });
  }

  /////////////////////////////////////////////////////////////////////////////
  // The modes we are change to/from is "Information Mode" which shows the
  // list pane and "Full View Mode" which shows just the room.
  handleModeChange() {
    this.setState(oldState => ({ isInfoMode: !oldState.isInfoMode }));
  }

  /////////////////////////////////////////////////////////////////////////////
  // Check the list of current puzzles for the status to determine if and
  // how to render the RoomItem. Passing a puzzleId with the assumption 
  // that we will use IDs instead of titles.
  getRoomItemStatus(puzzleName) {
    let status = 'hidden'
    // Items not assigned to a puzzle should be visible.
    if (puzzleName === "") {
      status = 'visible';
    } else {
      if(this.state.puzzleList) {
        if (puzzleName.includes('estament')) {console.log("room status for purple testament")}
        let puzzle = this.state.puzzleList.find((element) => {
          if(element.PuzzleName.toLowerCase() === puzzleName.toLowerCase()) return element;
        });
        if(puzzle) {
          status = puzzle.Solved ? 'solved' : 'unlocked';
        }
      }
    }

    return status;
  }

  /////////////////////////////////////////////////////////////////////////////
  // When a room item is clicked and there is a puzzle in it we will show a
  // puzzle dialog with the PDF. Need to handle some state information too.
  roomItemClicked(puzzleName, requiredItems) {
    // search through the list of all puzzles and find the puzzle with matching name
    let puzzle = this.state.puzzleList.find((element) => {
      if(element.PuzzleName.toLowerCase() === puzzleName.toLowerCase()) return element;
    });

    // if this is the first time the user viewed the item via the UI then mark it at viewed
    console.log("The puzzle that we clicked: " + puzzle.PuzzleName);
    if(!puzzle.ViewedAt) {
      let apiCall = new XMLHttpRequest(); 
      let phURI = 'api/puzzles/' + puzzle.PuzzleId;
      //console.log("The URL to call: " + phURI);
      // Important to notice that this is a POST
      apiCall.open('POST', phURI, true);
      apiCall.onload = () => {
      if (apiCall.status >= 200 && apiCall.status < 400) {
        // Success!
        //console.log("This is the response text we got back: " + apiCall.responseText)
        
        // The status of an item could have changed so update the state of puzzles
        this.updatePuzzleList();
        }
      }

      //console.log('Time to call the API for setting the puzzle viewed at time');
      apiCall.send();
    }

    if(puzzle) {
      console.log("Opening puzzle with puzzleID: " + puzzle.PuzzleId)
      this.showPuzzle(puzzle.PuzzleId);
    }
  }
  

  /////////////////////////////////////////////////////////////////////////////
  // This method will open the puzzle dialog when clicked on in the puzzle list.
  // This is not needed after switching to use puzzle IDs.
  showPuzzleFromList(puzzleId) {
    let puzzle = this.state.puzzleList.find((element) => {
      if(element.title === puzzleId) return element;
    });

    if(puzzle) {
      this.showPuzzle(puzzle.puzzleId);
    }
    
  }

  /////////////////////////////////////////////////////////////////////////////
  // This method will open the puzzle dialog when exposed from a room or 
  // from the puzzle list.
  showPuzzle(puzzleId) {
    let apiCall = new XMLHttpRequest(); 
    let phURI = 'api/puzzles/' + puzzleId;
    console.log("The URL to call: " + phURI);
    apiCall.open('GET', phURI, true);
    apiCall.onload = () => {
    if (apiCall.status >= 200 && apiCall.status < 400) {
      // Success!
      // console.log("This is the response text we got back: " + apiCall.responseText)
      let puzzle = JSON.parse(apiCall.responseText);
      // console.log("Setting the state for the puzzle to render: " + puzzle.Puzzle.PuzzleName)
      this.setState({ renderedPuzzle: puzzle });
      this.updatePuzzleList();
      }
    }

    //console.log('Time to call the API for the puzzle info');
    apiCall.send();

  }

  /////////////////////////////////////////////////////////////////////////////
  // This method will open the puzzle dialog when exposed from a room or 
  // from the puzzle list.
  showFirstPuzzle() {
    console.log("Updating the list of puzzles from the DB for first time");
    //Setting the URI as a relative path that works locally and on server too
    let apiPuzzlesURI = 'api/puzzles';
    
    let apiPuzzles = new XMLHttpRequest();
    apiPuzzles.open('GET', apiPuzzlesURI, true);
    apiPuzzles.onload = () => {
      if (apiPuzzles.status >= 200 && apiPuzzles.status < 400) {
        // Success!
        let puzzles = JSON.parse(apiPuzzles.responseText);
        // We have the list of puzzles now. It is the right time to add stuff
        // needed by the UI.

        // Add path to thumbnails to each item in the puzzle list
        // It passes the list by reference so no need to return a new list
        this.addThumbnailInfo(puzzles);
        
        let totalPuzzleCount = puzzles.length;

        // Create a list of puzzles that have not been viewed and save them in the state
        let viewedPuzzles = this.getViewedPuzzles(puzzles);

        let newPuzzleCount = totalPuzzleCount - viewedPuzzles.length;

        this.setState({ 
          puzzleList: puzzles,
          totalPuzzleCount: totalPuzzleCount,
          viewedPuzzleList: viewedPuzzles,
          newPuzzleCount: newPuzzleCount,
        });


        let firstPuzzle = puzzles.find(p => p.PuzzleName === "The World Next Door");
        console.log("The first puzzle was found " + firstPuzzle.PuzzleName );
        let apiCall = new XMLHttpRequest(); 
        let phURI = 'api/puzzles/' + firstPuzzle.PuzzleId;
        console.log("The URL to call: " + phURI);
        apiCall.open('GET', phURI, true);
        apiCall.onload = () => {
        if (apiCall.status >= 200 && apiCall.status < 400) {
          // Success!
          // console.log("This is the response text we got back: " + apiCall.responseText)
          let firstPuzzleDetails = JSON.parse(apiCall.responseText);
          // console.log("Setting the state for the puzzle to render: " + puzzle.Puzzle.PuzzleName)
          this.setState({ firstPuzzle: firstPuzzleDetails,  });
          }
        }
    
        //console.log('Time to call the API for the puzzle info');
        apiCall.send();
    


      } else {
        // ERROR HANDLING
        // I really should do something if there is an error but I am not sure what
      }

    }
    apiPuzzles.send();
  }

  submitGuess(puzzleId, guess) {
    // TO DO: verify that it is possible to submit (maybe gray out textbox)

    // TODO: stop using the puzzle title 
    // let puzzle = this.state.puzzleList.find((element) => {
    //   if(element.title === puzzleId) return element;
    // });

    // let renderPuzzle = this.db.submitGuess(puzzleId, guess);
    // this.setState({puzzleList: this.db.getUnlockedPuzzles(),})
    // this.setState( { renderedPuzzle: renderPuzzle });

    // Submit a guess
    console.log("Submitting a guess for puzzle ID: " + puzzleId);
    let apiCall = new XMLHttpRequest(); 
    let phURI = 'api/puzzles/' + puzzleId + "?guess=" + guess;
    apiCall.open('POST', phURI, true);
    apiCall.onload = () => {
    if (apiCall.status >= 200 && apiCall.status < 400) {
      // Success!
      //console.log("This is the response text we got back from submitting a guess: " + apiCall.responseText)
      let puzzle = JSON.parse(apiCall.responseText);
      this.setState({ renderedPuzzle: puzzle });
      this.updatePuzzleList();
      }
    }

    apiCall.send();


  }

  arraysAreEqual(x, y) {
    if (x.length !== y.length) {
      return false;
    }
    for (let i = 0; i < x.length; i++) {
      if (x[i] !== y[i]) {
        return false;
      }
    }
    return true;
  }

  /////////////////////////////////////////////////////////////////////////////
  // This is to allow for users to click outside of puzzle dialog to close it.
  handleGameClick() {
    // as of now we will only dismiss the puzzle dialog but maybe we need to do something else someday
    this.closePuzzleDialog();
  }

  closePuzzleDialog() {
    if (this.state.renderedPuzzle) { // Necessary because the click from opening the puzzle bubbles up
      this.setState( { renderedPuzzle: null } );
    }
  }

  handleMoveViewRight () {
    let currentView = this.state.currentView;
    let newView = viewData.length === currentView + 1 ? 0 : currentView + 1; 
    this.setState({currentView: newView})
  }

  handleMoveViewLeft () {
    let currentView = this.state.currentView;
    let newView =  0 === currentView ? viewData.length - 1 : currentView - 1 ; 
    this.setState({currentView: newView})
  }

  hasBeenViewed(puzzle) {
    //console.log("the viewed at for this puzzle: " + puzzle.ViewedAt);
    if(!puzzle.ViewedAt) {console.log("Has not been viewed")};
    return puzzle.ViewedAt ? true : false;
  }

  getViewedPuzzles(puzzles) {
    const puzzleList = puzzles.filter(puz => this.hasBeenViewed(puz));
    console.log("The number of puzzles to be in the list: " + puzzleList.length);
    return puzzleList;
  }

  render() {
    let gameHeight, gameWidth, scaleFactor;
    // Handle resizing so that the game div stays in a 16:9 ratio
    if ((this.props.appWidth / this.props.appHeight) > 16 / 9 ) {
      gameWidth = this.props.appHeight / 9 * 16;
      gameHeight = this.props.appHeight;
    } else {
      gameHeight = this.props.appWidth / 16 * 9;
      gameWidth = this.props.appWidth;
    }
    scaleFactor = gameHeight / this.origHeight;

    // Let the Game object manage the size of the divs that are its children
    let viewWidth, viewHeight;
    if (this.state.isInfoMode) {
      viewWidth = .8 * gameWidth;
      viewHeight = .8 * gameHeight;
    } else {
      viewWidth = gameWidth;
      viewHeight = gameHeight;
    }

    let listPaneHeight = gameHeight;
    let listPaneWidth = .2 * gameWidth;
    let listPaneLeft = viewWidth;

    let infoPaneWidth, infoPaneHeight, infoPaneTop;
    infoPaneHeight = .2 * gameHeight;
    infoPaneWidth = viewWidth;
    infoPaneTop = viewHeight;

    let puzzDiagLeft, puzzDiagWidth;
      puzzDiagLeft = .1 * gameWidth;
      puzzDiagWidth = .8 * gameWidth; 

    let style = {
      width: gameWidth + 'px',
      height: gameHeight + 'px',
      postion: 'relative',
    };

  return (
      <div className="game" 
        onClick={() => this.handleGameClick()}
        style={style}>
      {true && this.state.firstPuzzle &&
        <FirstPuzzle
          submitGuess = {(puzzleId, guess) => this.submitGuess(puzzleId, guess)}
          puzzle = {this.state.firstPuzzle}
        />  
      }
      { false &&
      <ViewPane
        viewData = {viewData[this.state.currentView]}
        viewWidth = {gameWidth}
        viewHeight = {gameHeight}
        getRoomItemStatus ={(puzzleName) => this.getRoomItemStatus(puzzleName)}
        roomItemClicked ={(puzzleName, requiredItems) => this.roomItemClicked(puzzleName, requiredItems)}
        totalPuzzleCount = {this.state.totalPuzzleCount}
        newPuzzleCount = {this.state.newPuzzleCount}
        isInfoMode = {this.state.isInfoMode}
        scaleFactor = {scaleFactor}
      />
      }
      <Button
        onClick={() => this.handleModeChange()}
        modeBtnTop = {viewHeight - 70}
        modeBtnLeft = {viewWidth -70 }
        btnLabel = "i"
      />
      <Button
        onClick={() => this.handleMoveViewRight()}
        modeBtnTop = {viewHeight / 2}
        modeBtnLeft = {viewWidth -40 }
        btnLabel = ">"
      />
      <Button
        onClick={() => this.handleMoveViewLeft()}
        modeBtnTop = {viewHeight / 2}
        modeBtnLeft = { 10 }
        btnLabel = "<"
      />
      { this.state.isInfoMode &&
        <ListPane
          arcData = {this.db.getArcData()}
          listPaneHeight = {listPaneHeight}
          listPaneWidth = {listPaneWidth}
          listPaneLeft = {listPaneLeft}
          puzzleList = {this.state.viewedPuzzleList}
          showPuzzle = {(puzzleId) => this.showPuzzle(puzzleId)}
        />
      }
      {false && this.state.isInfoMode &&
        <ThingsPane
          infoPaneHeight = {infoPaneHeight}
          infoPaneWidth = {infoPaneWidth}
          infoPaneTop = {infoPaneTop}
          thingsInventory = {this.state.thingsInventory}
          updateThingsInventory = {(thingId) => this.updateThingsInventory(thingId)}
        />
      }
      { this.state.renderedPuzzle &&
        <PuzzleDiag
          puzzDiagLeft = {puzzDiagLeft}
          puzzDiagWidth = {puzzDiagWidth}
          puzzDiagHeight = {gameHeight}
          submitGuess = {(puzzleId, guess) => this.submitGuess(puzzleId, guess)}
          close = {() => this.closePuzzleDialog()}
          puzzle = {this.state.renderedPuzzle}
        />
      }
        <div className="phhomelink">
            <a href="default.aspx">PH 18 Home</a>
        </div>
      </div>
    );
  }
}

export default Game;
