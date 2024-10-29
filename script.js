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

    function getGameboard(){
        return gameboard;
    }

    return {checkIfGbFull, checkRow, checkColumn, checkTies, mark, getGameboard};
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

    let activePlayer = player1;

    function markSymbol(){
        gameboard.mark(activePlayer.symbol, lastMove.row, lastMove.column);
    }

    function checkForGameResult(){
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

    function getActivePlayer(){
        return activePlayer;
    }

    function changeActivePlayer(){
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    function playRound(row, column){
        lastMove.row = row;
        lastMove.column = column;
        markSymbol();
        result = checkForGameResult();
        if(result){
            return result;
        }
        changeActivePlayer();
    }

    return {playRound, getGameboard: gameboard.getGameboard, getActivePlayer}
}

function uiController(){
    const game = GameController();
    const boardDiv = document.querySelector('.board');

    function updateScreen(){
        boardDiv.textContent = "";
        
        let gameboard = game.getGameboard();
        
        gameboard.forEach((row, rowNumber )=> {
            row.forEach((cell, columnNumber)=>{
            const cellButton = document.createElement('button');
            cellButton.setAttribute("class","cell");

            cellButton.dataset.column = columnNumber;
            cellButton.dataset.row = rowNumber;

            if(cell){
                cellButton.setAttribute("class","cell marked-"+cell.toString().toLowerCase());
            }

            boardDiv.appendChild(cellButton);
            });
        });
    }

    function displayGameResult(){}

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;
        
        let gameResult = game.playRound(selectedRow, selectedColumn);
        updateScreen();

        if(gameResult)
            alert(gameResult);
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

uiController();