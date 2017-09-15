import React, { Component } from 'react';
import './index.css';
import ViewPane from './ViewPane.js';
import ThingsPane from './ThingsPane.js';
import ListPane from './ListPane.js';
import Button from './Button.js';
import OpeningScene from './OpeningScene.js';
import PuzzleDiag from './PuzzleDiag.js';
import { Database } from './Database.js';
import leftArrowIcon from './assets/img/leftarrow.svg';
import rightArrowIcon from './assets/img/rightarrow.svg';
import openInfoIcon from './assets/img/openinfo.svg';
import closeInfoIcon from './assets/img/closeinfo.svg';
import homeIcon from './assets/img/home.svg';

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
      totalPuzzleCount: 0,
      introSolved: false,
      eventStarted: false,
      roomGrayScale: 1,
    };
  }

  /////////////////////////////////////////////////////////////////////////////
  // This method will be called as soon as the DOM for this object (Game)
  // is mounted. So do whatever asynchronous stuff you want to do here.
  componentDidMount(){
    // Call this method to set puzzle list, it sets the state 
    this.updatePuzzleList();
    // Call update puzzles every minute if the list is empty
    this.interval = setInterval(this.startEvent.bind(this), 30000);
  }

  /////////////////////////////////////////////////////////////////////////////
  // This method will be called when the DOM for this object (Game)
  // will be unmounted. Here you can stop timers and clean up.
  componentWillUnmount(){
    // add stuff here as needed. Leaving this here as a reminder to use it.
  }

  //TODO Remove this once the mechanism for the opening event is known
  startEvent() {
    console.log("Checking to see if the event has started.");
    if (this.state.eventStarted) {
      //console.log("It has started, so removed the callback interval.");
      clearInterval(this.interval);
    } else {
      this.updatePuzzleList();    
    }
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
    console.log("Updating the list of puzzles");
    //Setting the URI as a relative path that works locally and on server too
    let apiPuzzlesURI = 'api/puzzles';
    
    let apiPuzzles = new XMLHttpRequest();   
    apiPuzzles.open('GET', apiPuzzlesURI, true);
    apiPuzzles.onload = () => {
      if (apiPuzzles.status >= 200 && apiPuzzles.status < 400 ) {
        // Success!
        let puzzles = JSON.parse(apiPuzzles.responseText);
        // We have the list of puzzles now. It is the right time to add stuff
        // needed by the UI.

        // Add path to thumbnails to each item in the puzzle list
        // It passes the list by reference so no need to return a new list
        this.addThumbnailInfo(puzzles);

        if(puzzles.length > 0 && !this.state.eventStarted) {
          // console.log("The puzzle list is greater than 1, it is: " + puzzles.length)
           console.log("Setting the event to 'started'");
          this.setState({eventStarted: true})
        }
        
        //Total haxin but subtract 1 because the intro puzzle is not included
        let totalPuzzleCount = puzzles.length -1;
        // console.log("After getting the puzzle list we are setting the number of unlocked puzzles to: " + totalPuzzleCount);
        // Create a list of puzzles that have not been viewed and save them in the state
        let viewedPuzzles = this.getViewedPuzzles(puzzles);
        let solvedPuzzlesCount = puzzles.map(p => p.Solved).length;
        let newPuzzleCount = totalPuzzleCount - viewedPuzzles.length;

        // SPECIAL CASE: Intro puzzle will only be shown at the beginning so if it has
        if(!this.state.introSolved) {
          // console.log("The intro puzzle has not been solved.")
          // not been solved then handle showing it here.
          // Find the intro puzzle by title
          let introTitle = "The World Next Door";
          let introPuzzle = puzzles.find(puzzle => puzzle.PuzzleName === introTitle);

          if (introPuzzle) {
            // console.log("Found the intro puzzle in the list of puzzles, setting its solved state is: " + introPuzzle.Solved);
            this.setState({introSolved: introPuzzle.Solved});
            if (introPuzzle.Solved ) {
              // console.log("Closing the puzzle dialog to set the rendered puzzle null.");
              this.closePuzzleDialog();
            } else { 
              if(!this.state.renderedPuzzle) {
                // console.log("Rendering the intro puzzle since it's state says it is not solved.");
                this.showPuzzle(introPuzzle.PuzzleId)
              }
            }
          } else {
            // we didn't expect this so log something in the cosole
            console.log("Unable to find the intro puzzle in list using name: " + introTitle);
          }
        }
        
        this.setState({ 
          totalPuzzleCount: totalPuzzleCount,
          newPuzzleCount: newPuzzleCount,
          viewedPuzzleList: viewedPuzzles,
          puzzleList: puzzles,
          roomGrayScale: solvedPuzzlesCount*100,
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
      let pdfPath = puzzle.PuzzleURL ? puzzle.PuzzleURL : "missing.png";
      let lastSlash = pdfPath.lastIndexOf("/");
      let pngPath = "Puzzles/Thumbnails/"
      // This assumes all puzzles have pdf files. Need to see if there is htm or html files
      let pngName = pdfPath.substring(lastSlash+1, pdfPath.length).replace('pdf', 'png');
      if (pdfPath.includes('.htm')) {
        // console.log("The Puzzle URL for puzzle that doesn't use PDF: " + pdfPath);
        pngName = pdfPath.substring(lastSlash+1, pdfPath.length).replace('htm', 'png');
        //console.log('The pngName is ' + pngName);
      }
      if (pdfPath.includes('.aspx')) {
        // console.log("The Puzzle URL for puzzle that doesn't use PDF: " + pdfPath);
        pngName = pdfPath.substring(lastSlash+1, pdfPath.length).replace('aspx', 'png');
        //console.log('The pngName is ' + pngName);
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
      // console.log("Opening puzzle with puzzleID: " + puzzle.PuzzleId)
      this.showPuzzle(puzzle.PuzzleId);
    }
  }
  
  /////////////////////////////////////////////////////////////////////////////
  // This method will open the puzzle dialog when exposed from a room or 
  // from the puzzle list. Call the DB to get all puzzle details used in dialog.
  showPuzzle(puzzleId) {
    console.log("Opening puzzle dialog for: " + puzzleId)
    let apiCall = new XMLHttpRequest(); 
    let phURI = 'api/puzzles/' + puzzleId;
    // console.log("The URL to call: " + phURI);
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
  // Submit answer to backend then update state.
  submitGuess(puzzleId, guess) {
    console.log("Submitting a guess for puzzle ID: " + puzzleId);
    let apiCall = new XMLHttpRequest(); 
    let phURI = 'api/puzzles/' + puzzleId + "?guess=" + guess;
    apiCall.open('POST', phURI, true);
    apiCall.onload = () => {
    if (apiCall.status >= 200 && apiCall.status < 400) {
      // Success!
      //console.log("This is the response text we got back from submitting a guess: " + apiCall.responseText)
      let puzzle = JSON.parse(apiCall.responseText);

      // Set the renderstate again so the list of guesses in UI is refreshed
      this.setState({ renderedPuzzle: puzzle });
      // In case the answer is right the puzzle list should be udpated
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
    // don't do this if it is the opening scene
    if (this.state.introSolved) {
      this.closePuzzleDialog();
    }
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
    return puzzle.ViewedAt ? true : false;
  }

  getViewedPuzzles(puzzles) {
    const puzzleList = puzzles.filter(puz => this.hasBeenViewed(puz));
    //console.log("The number of puzzles to be in the viewed list: " + puzzleList.length);
    //puzzleList.map(p => console.log("This puzzle is in the list to be viewed: " + p.PuzzleName))
    return puzzleList;
  }

  renderOpeningScene(eventStarted, viewIsWide) {
    //console.log("passing the puzzle to opening scene: " + this.state.renderedPuzzle.Puzzle.PuzzleName);
    return (
      <OpeningScene
        submitGuess = {(puzzleId, guess) => this.submitGuess(puzzleId, guess)}
        puzzle = {this.state.renderedPuzzle}
        eventStarted = {eventStarted}
        viewIsWide = {viewIsWide}
        homeIcon = {homeIcon}
      />  
    )
  }

  renderGame(gameWidth, gameHeight, scaleFactor, viewIsWide) {
    // Let the Game object manage the size of the divs that are its children
    let viewWidth, viewHeight, modeIcon;
    if (this.state.isInfoMode) {
      modeIcon = closeInfoIcon;
      viewWidth = .8 * gameWidth;
      viewHeight = .8 * gameHeight;
    } else {
      modeIcon = openInfoIcon;
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

    return (
      <div className='normalScene'>
        {this.state.puzzleList && 
        <ViewPane
          newPuzzleCount= {this.state.newPuzzleCount}
          totalPuzzleCount= {this.state.totalPuzzleCount}
          viewData = {viewData[this.state.currentView]}
          viewWidth = {gameWidth}
          viewHeight = {gameHeight}
          getRoomItemStatus ={(puzzleId) => this.getRoomItemStatus(puzzleId)}
          roomItemClicked ={(puzzleId, requiredItems) => this.roomItemClicked(puzzleId, requiredItems)}
          isInfoMode = {this.state.isInfoMode}
          scaleFactor = {scaleFactor}
          roomGrayScale = {this.state.roomGrayScale}
        />
        }
        <Button
          onClick={() => {window.location.href="default.aspx"}}
          modeBtnTop = {10}
          modeBtnLeft = {10}
          btnLabel = "H"
          img={homeIcon}
        />
        <Button
          onClick={() => this.handleModeChange()}
          modeBtnTop = {viewHeight - 70}
          modeBtnLeft = {viewWidth -70 }
          btnLabel = "i"
          img={modeIcon}
        />
        <Button
          onClick={() => this.handleMoveViewRight()}
          modeBtnTop = {viewHeight / 2}
          modeBtnLeft = {viewWidth -40 }
          btnLabel = ">"
          img = {rightArrowIcon}
        />
        <Button
          onClick={() => this.handleMoveViewLeft()}
          modeBtnTop = {viewHeight / 2}
          modeBtnLeft = { 10 }
          btnLabel = "<"
          img = {leftArrowIcon}
        />
        {this.state.isInfoMode &&
          <ListPane
            arcData = {this.db.getArcData()}
            viewIsWide = {viewIsWide}
            listPaneHeight = {listPaneHeight}
            listPaneWidth = {listPaneWidth}
            listPaneLeft = {listPaneLeft}
            puzzleList = {this.state.viewedPuzzleList}
            showPuzzle = {(puzzleId) => this.showPuzzle(puzzleId)}
          />
        }
        { this.state.isInfoMode && false &&
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
            viewIsWide = {viewIsWide}
            puzzDiagLeft = {puzzDiagLeft}
            puzzDiagWidth = {puzzDiagWidth}
            puzzDiagHeight = {gameHeight}
            submitGuess = {(puzzleId, guess) => this.submitGuess(puzzleId, guess)}
            close = {() => this.closePuzzleDialog()}
            puzzle = {this.state.renderedPuzzle}
          />
        }
      </div>
      );
  }


  render() {
    let gameHeight, gameWidth, scaleFactor, viewIsWide;
    // Handle resizing so that the game div stays in a 16:9 ratio
    if ((this.props.appWidth / this.props.appHeight) > 16 / 9 ) {
      viewIsWide = true;
      gameWidth = this.props.appHeight / 9 * 16;
      gameHeight = this.props.appHeight;
    } else {
      false;
      gameHeight = this.props.appWidth / 16 * 9;
      gameWidth = this.props.appWidth;
    }
    scaleFactor = gameHeight / this.origHeight;

    let style = {
      width: gameWidth + 'px',
      height: gameHeight + 'px',
      postion: 'relative',
    };
    // console.log("The value of this.state.introSolved: " + this.state.introSolved);

    // If the state says "The intro is not solved" we render the opening scene.
    let scene = this.state.introSolved ? 
      this.renderGame(gameWidth, gameHeight, scaleFactor, viewIsWide) : 
      this.renderOpeningScene(this.state.eventStarted, viewIsWide);
    
  return (
    <div className="game" 
      onClick={() => this.handleGameClick()}
      style={style}>
      {scene}
    </div>)
  }
}

export default Game;
