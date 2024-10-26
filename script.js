function Gameboard(){
    gameboard = 
    [[null, null, null],
    [null, null, null],
    [null, null, null]];

    function checkIfGbFull(){
        for(row of gameboard)
            for(e of row)
                if(e === null)  return false;
        return true;
    }
    
    function checkRow(rowNumber, symbol){
        for(let i=0; i<3; i++){
            if(gameboard[rowNumber][i] !== symbol)  return false;
        }
        return true;
    }

    function checkCollumn(columnNumber, symbol){
        for(let i=0; i<3; i++){
            if(gameboard[i][columnNumber] !== symbol)   return false;
        }
        return true;
    }

    function checkTies(symbol){
        let firstTie, secondTie = true;

        for(let i=0; i<3; i++){
            if(gameboard[i][i] !== symbol){
                firstTie=false;
                break;
            }
        }

        for(let i=0; i<3; i++){
            if(gameboard[2-i][i] !== symbol){
                secondTie=false;
                break;
            }
        }

        return firstTie || secondTie;
    }

    function printGameboard(){
        let message = "";
        for(row of gameboard){
            for(e of row){
                message += e+" ";
            }
            message += "\n";
        }
        console.log(message);
    }

    return {checkIfGbFull, checkRow, checkCollumn, checkTies, printGameboard};
}

function Player(){
    let name = "";
    let symbol = "";

    return {name, symbol};
}

function gameController(){
    let player1, player2;
    let activePlayer;

    function getUserMove(){}

    function checkForGameResult(){}

    function announceGameResult(){}
}

function uiController(){}