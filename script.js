function Gameboard(){
    let gameboard = 
    [[null, null, null],
    [null, null, null],
    [null, null, null]];

    function mark(symbol, row, column){
        if(row>=0 && row<=2 && column>=0 && column<=2 && gameboard[row][column] === null){
            gameboard[row][column]=symbol;
        }
        else    
            return "field occupied";
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

    function reset(){
        gameboard = 
        [[null, null, null],
        [null, null, null],
        [null, null, null]];
    }

    function getGameboard(){
        return gameboard;
    }

    return {checkIfGbFull, checkRow, checkColumn, checkTies, mark, getGameboard, reset};
}

function Player(){
    let name = "";
    let symbol = "";

    return {name, symbol};
}

function GameController(){
    const gameboard = Gameboard();
    let isGameActive = false;

    let player1 = Player();
    player1.symbol = 'X';

    let player2 = Player();
    player2.symbol = 'O';

    let activePlayer = player1;

    function startGame(playerXName, playerOName){
        activePlayer=player1;
        if(playerXName==="" || playerOName==="" || playerXName === playerOName){
            console.log("new game error");
            return;
        }
        player1.name=playerXName;
        player2.name=playerOName;
        isGameActive=true;
    }

    function restartGame(){
        isGameActive=true;
        gameboard.reset();
    }

    function checkForGameResult(row, column){
        if(!isGameActive)   return;
        if(
            gameboard.checkColumn(column, activePlayer.symbol) ||
            gameboard.checkRow(row, activePlayer.symbol) ||
            gameboard.checkTies(activePlayer.symbol)
        )
            return activePlayer;
        else if(gameboard.checkIfGbFull())
            return "draw";
        else 
            return false;
    }

    function getActivePlayer(){
        return activePlayer;
    }

    function changeActivePlayer(){
        if(!isGameActive)   return;
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    function playRound(row, column){
        if(!isGameActive)   return;
        let result = gameboard.mark(activePlayer.symbol, row, column);
        if(result === "field occupied")  return;

        result = checkForGameResult(row,column);
        if(result){
            isGameActive=false;
            return result;
        }
        changeActivePlayer();
    }

    return {playRound, getGameboard: gameboard.getGameboard, restartGame, getActivePlayer, startGame}
}

function uiController(){
    const body = document.querySelector("body");
    const game = GameController();
    const boardDiv = document.querySelector('.board');
    const infoBar = document.querySelector('.info-bar');

    //add restart game button after finishing game

    function updateScreen(){
        boardDiv.textContent="";
        infoBar.textContent="";
        
        const activePlayerScreen = document.createElement("p");
        activePlayerScreen.textContent=game.getActivePlayer().name+"'s move ("+game.getActivePlayer().symbol+")";
        infoBar.appendChild(activePlayerScreen);
        
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

    (function displayGetUsernamesDialog(){
        const dialog = document.querySelector(".get-usernames-dialog");
        const confirmBtn = dialog.querySelector(".confirmBtn");
        const userNameInput1 = dialog.querySelector("#username-1");
        const userNameInput2 = dialog.querySelector("#username-2");    
        const errorMsg = document.querySelector(".dialog-error-msg");
        errorMsg.setAttribute("style", "display:none;");

        confirmBtn.addEventListener("click", (e)=>{
            e.preventDefault();
            let username1 = userNameInput1.value;
            let username2 = userNameInput2.value;
            if(username1==="" || username2===""){
                errorMsg.textContent="username should be minimum 1 character long";
                errorMsg.setAttribute("style", "display:block;");
            }
            else if(username1===username2){
                errorMsg.textContent="usernames cannot be the same";
                errorMsg.setAttribute("style", "display:block;");
            }
            else{
                dialog.close();
                game.startGame(username1,username2);
                updateScreen();
            }
        });

        dialog.showModal();
    })();

    function displayGameResultDialog(gameResult){
        const gameResultDialog = document.querySelector(".game-result-dialog");
        let message = "";
        if(typeof(gameResult) === "object"){
            message = gameResult.name+" ("+gameResult.symbol+") Wins the game!";
        }
        else if(gameResult="draw")
            message = "game ended in draw";
        gameResultDialog.textContent = message;
        body.insertBefore(gameResultDialog,infoBar);
        gameResultDialog.showModal();

        gameResultDialog.addEventListener("click", ()=>{
            gameResultDialog.close();
        })
    }

    function createGameRestartBtn(){
        infoBar.textContent="";
        const btn = document.createElement("button");
        btn.textContent="NEW GAME";
        infoBar.appendChild(btn);

        btn.addEventListener("click", (event)=>{
            game.restartGame();
            updateScreen();
        });
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;
        
        let gameResult = game.playRound(selectedRow, selectedColumn);
        
        updateScreen();
        
        if(gameResult){
            displayGameResultDialog(gameResult);
            createGameRestartBtn();
        }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
}

uiController();