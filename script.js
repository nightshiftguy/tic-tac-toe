function Gameboard(){
    let gameboard = 
    [[null, null, null],
    [null, null, null],
    [null, null, null]];

    function mark(symbol, row, column){
        if(row>=0 && row<=2 && column>=0 && column<=2 && gameboard[row][column] === null){
            gameboard[row][column]=symbol;
            return "added mark";
        }
        else    
            return "error";
    }

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

    function checkColumn(columnNumber, symbol){
        for(let i=0; i<3; i++){
            if(gameboard[i][columnNumber] !== symbol)   return false;
        }
        return true;
    }

    function checkTies(symbol){
        let firstTie = true;
        let secondTie = true;

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

    return {checkIfGbFull, checkRow, checkColumn, checkTies, printGameboard, mark};
}

function Player(){
    let name = "";
    let symbol = "";

    return {name, symbol};
}

function GameController(){
    const gameboard = Gameboard();

    let player1 = Player();
    player1.name = 'firstPlayer';
    player1.symbol = 'X';

    let player2 = Player();
    player2.name = 'secondPlayer';
    player2.symbol = 'O';

    let lastMove = {row: -1, column: -1};
    let isGameUp = true;

    let activePlayer = player1;

    function getAndMarkSymbol(){
        let message;
        do{
            alert(activePlayer.name+" mark "+activePlayer.symbol+" on gameboard");
            lastMove.column = Number(prompt("x: "));
            lastMove.row = Number(prompt("y: "));
            message =  gameboard.mark(activePlayer.symbol, lastMove.row, lastMove.column);
            gameboard.printGameboard();
        }
        while(message === "error");
    }

    function checkForGameResult(){
        console.log(lastMove);
        if(
            gameboard.checkColumn(lastMove.column,activePlayer.symbol) ||
            gameboard.checkRow(lastMove.row, activePlayer.symbol) ||
            gameboard.checkTies(activePlayer.symbol)
        )
            return activePlayer.name;
        else if(gameboard.checkIfGbFull())
            return "draw";
        else 
            return false;
    }

    function announceGameResult(result){
        if(result === "draw")   console.log(draw);
        else    console.log('Congratulations: '+activePlayer.name+' you win!');
    }

    function changeActivePlayer(){
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    let gameResult;
    while(isGameUp){
        getAndMarkSymbol();
        result = checkForGameResult();
        if(result){
            announceGameResult(gameResult);
            break;
        }
        changeActivePlayer();
    }

    return {getAndMarkSymbol}
}

function uiController(){}
