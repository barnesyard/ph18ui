// In general, the "RealDatabase" class will look similar to this. It will still
// keep track of the puzzleData, but it will also make web calls to the .net code
// on the server. Permissions, rate-limiting, etc will happen there.
// The real impl will also need a way to save & load state from the server,
// a way to sync between users, and a way to push things from the hunt organizers
// to the users (it's likely the last two will share a single implementation).

import { PuzzleData } from './puzzledata.js';
import { thingData } from './thingData.js';
import { ArcData } from './arcdata.js';

class FakeDatabase {
  constructor() {
    // The arcData comes in as a class to handle importing of images locally
    this.arcData = new ArcData().getArcData();
    // This is simulating the DB with the entire list. This app will never contain the entire list of puzzles.
    //this.allPuzzleData = new PuzzleData().getPuzzleData();
    this.allPuzzleData = PuzzleData;
    this.thingData = thingData;
  }

  getThingsInventory() {
    return this.thingData;
  }

  getArcData() {
    return this.arcData;
  }

  /////////////////////////////////////////////////////////////////////////////
  // This method gets the list of puzzles that are unlocked and are associated
  // with items in the room that have not been clicked ("opened") yet.
  getUnlockedPuzzles() {
    // This was the code when the puzzle list was a list of objects.
    // let puzzles = Object.values(this.allPuzzleData);
    // return puzzles.filter(puzzle => puzzle.status !== "locked");
    return this.allPuzzleData;

    // let puzzles;
    // // Make a call to the PH API to get the list of puzzles
    // let apiCall = new XMLHttpRequest();
    // apiCall.open('GET', 'api/puzzles', true);
    
    // apiCall.onload = () => {
    //   if (apiCall.status >= 200 && apiCall.status < 400) {
    //     // Success!
    //     puzzles = JSON.parse(apiCall.responseText);
    //   } else {
    //     // We reached our target server, but it returned an error
    
    //   }
    // };

    // apiCall.send();
  }

  /////////////////////////////////////////////////////////////////////////////
  // This method gets the puzzles that have been opened by clicking on an
  // item in the room (that is the "open" state). This is the list
  // that should be rendered in the list pane.
  getOpenPuzzles() {
    let puzzles = Object.values(this.allPuzzleData);
    return puzzles.filter(puzzle => (puzzle.status === "open"));       
  }

  // Not sure if this is the right approach here. In this method we pass in the 
  // puzzle id so that we can get back the details about the puzzle 
  // using the puzzle id to get it from the list of puzzles
  getPuzzleInfo(puzzleId) {
    //let puzzleInfo = this.allPuzzleData.filter(puzzle => (puzzle.PuzzleId === puzzleId))[0];
    let puzzleInfo = this.allPuzzleData.find(puzzle => (puzzle.PuzzleId === puzzleId));
    console.log("Looking at puzzleInfo.PuzzleName: " + puzzleInfo.PuzzleName);
    //console.log("Looking at puzzleInfo[0].PuzzleName: " + puzzleInfo[0].PuzzleName);
    puzzleInfo.Submissions = [];
    // puzzleInfo.Submissions = [
    //   {
    //     "SubmissionId": 294230,
    //     "FullName": "Puzzle Control",
    //     "SubmitterIP": "127.0.0.1",
    //     "Submitted": "2017-09-08T18:18:42.6194612Z",
    //     "Attempt": "THREETESTS",
    //     "Response": null,
    //     "IsSolution": false
    //   },
    //   {
    //     "SubmissionId": 294229,
    //     "FullName": "troy",
    //     "SubmitterIP": "puzzlehunt.localtest.me:44300",
    //     "Submitted": "2017-09-08T18:17:34.4616903Z",
    //     "Attempt": "TESTAGAIN",
    //     "Response": null,
    //     "IsSolution": false
    //   },
    //   {
    //     "SubmissionId": 294228,
    //     "FullName": "troy",
    //     "SubmitterIP": "puzzlehunt.localtest.me:44300",
    //     "Submitted": "2017-09-08T18:16:08.1446024Z",
    //     "Attempt": "TEST",
    //     "Response": null,
    //     "IsSolution": false
    //   }
    // ];
    return puzzleInfo;
  }


  // TODO: deal with selectedItems
  showPuzzleIfAllowed(puzzleId, selectedItems) {
    //TODO: Use ID instead of title
    let puzzle = this.allPuzzleData[puzzleId];
    if (puzzle && puzzle.status !== "locked") {
      return puzzle;
    } else {
      return null;
    }
  }

  setPuzzleStatusOpen(puzzleId) {
    this.allPuzzleData[puzzleId].status = 'open';
  }

  submitGuess(puzzleId, guess) {
    let puzzle = this.allPuzzleData[puzzleId];
    if (puzzle.answer === guess) {
      puzzle.status = "complete";

      //unlock the next puzzle based on position
      console.log("The position of the solved puzzle: " + puzzle.position)
      //get the puzzles from this arc
      let allPuzzles = Object.values(this.allPuzzleData);
      let arcPuzzles = allPuzzles.filter((p) => {return p.arc === puzzle.arc})
      console.log("The length of " + puzzle.arc + " puzzle list: " + arcPuzzles.length);
      if(puzzle.position !== -1 && arcPuzzles.length - 2 > puzzle.position + 1) {
        let puzzleToUnlock = arcPuzzles.find((p) => {return p.position === puzzle.position + 1 });
        console.log("Setting puzzle " + this.allPuzzleData[puzzleToUnlock.puzzleId].title + " to unlocked");
        this.allPuzzleData[puzzleToUnlock.puzzleId].status = "unlocked";
        console.log("This should be meta puzzle: " + arcPuzzles.find((p) => {return p.position === -1 }).title);        
      }

      // If it is the 3rd solve unlock the meta too (this is fake, used for testing)
      if(puzzle.position === 2) {
        this.allPuzzleData[arcPuzzles.find((p) => {return p.position === -1 }).puzzleId].status = "unlocked";
      }
      
    }
    puzzle.guesses.push(guess);

    // returns updated puzzle
    return puzzle;
  }
}

export { FakeDatabase as Database };
