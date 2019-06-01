
   

        // init
        const canvas = document.getElementById('board');
        const ctx = canvas.getContext('2d');
        const msg = document.getElementById('message');
        const emoji = document.getElementById('emoji');


        msg.textContent = 'Click on a square to start the game!'





        // board
        let board = new Array(9).fill(0);
        const patterns = [
            0b111000000, 0b000111000, 0b000000111,  // rows
            0b100100100, 0b010010010, 0b001001001,  // cols
            0b100010001, 0b001010100,               // diagonals
        ];
        const status = {
            playerOne: 1,
            playerTwo: -1,
            empty: 0
        }
        const cellSize = 125;
        canvas.width = 3 * cellSize;
        canvas.height = 3 * cellSize;

        gameOver = false;





        // hooks
        mouse = { 
            x: -1, 
            y: -1 
        };
        currentPlayer = 1;
        canvas.addEventListener('mouseout', () => {
            mouse.x = mouse.y - 1;
        });
        canvas.addEventListener('mousemove', (e) => {
            let x = e.pageX - canvas.offsetLeft;
            let y = e.pageY - canvas.offsetTop;
            // console.log(x, y)
            mouse.x = x;
            mouse.y = y;
            // console.log(getCellByCoords(x, y));
        });
        canvas.addEventListener('click', (e) => {
            // let x = e.pageX - canvas.offsetLeft;
            // let y = e.pageY - canvas.offsetTop;
            // mouse.x = x;
            // mouse.y = y;
            play(getCellByCoords(mouse.x, mouse.y));
        });









        // draw function main
        function draw () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBoard();
            fillBoard();


            // module
            function drawBoard () {
                ctx.strokeStyle = '#212121';
                ctx.lineWidth = 5;

                ctx.beginPath();
                ctx.moveTo(cellSize, 0);
                ctx.lineTo(cellSize, canvas.height);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cellSize * 2, 0);
                ctx.lineTo(cellSize * 2, canvas.height);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, cellSize);
                ctx.lineTo(canvas.width, cellSize);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, cellSize * 2);
                ctx.lineTo(canvas.width, cellSize * 2);
                ctx.stroke();
            }

            // fill
            function fillBoard () {
                for (let i = 0; i < board.length; i += 1) {
                    let coords = getCellCords(i);

                    ctx.save();
                    ctx.translate(coords.x + cellSize / 2, coords.y + cellSize / 2);
                    // So the origin of the canvas is at the center of the current cell, so we can just draw an 'X' or an 'O'
                    if (board[i] == status.playerOne) {
                        putCross();
                    }
                    else if (board[i] == status.playerTwo) {
                        putZero();
                    }
                    ctx.restore();

                }
            }

            // put cross
            function putCross () {
                        ctx.beginPath();
                        ctx.moveTo(-cellSize / 3, -cellSize / 3);
                        ctx.lineTo(cellSize / 3, cellSize / 3);
                        ctx.moveTo(cellSize / 3, -cellSize / 3);
                        ctx.lineTo(-cellSize / 3, cellSize / 3);
                        ctx.strokeStyle = '#80b524';
                        ctx.stroke();
                    }

            // put circle
            function putZero () {
                ctx.beginPath();
                ctx.arc(0, 0, cellSize / 3, 0, Math.PI * 2);
                ctx.strokeStyle = '#449fb7'; 
                ctx.stroke();
            }
            requestAnimationFrame(draw);
        }


        // get coordinates
        function getCellCords (cell) {
            let row = (cell % 3) * cellSize;
            let col = Math.floor(cell / 3) * cellSize;
            return ({ 'x': row, 'y': col });
        }

        // return one value between zero through 8
        function getCellByCoords (x, y) {
            return ((Math.floor(x / cellSize) % 3) + Math.floor(y / cellSize) * 3);
        }

        function checkWinner (player) {
            let check = 0;
            let bitMask = 0;

            for (let i = 0; i < board.length; i += 1) {
                bitMask <<= 1;
                bitMask += (board[i] == player) ? 1 : 0
                for (let i = 0; i < board.length; i++) {
                    if ((bitMask & patterns[i]) == patterns[i])
                        check = patterns[i];
                }
            }
            return (check);
        }

        function play (cell) {
            if (gameOver)
                return ;
            if (board[cell] == status.empty) {
                board[cell] = currentPlayer;
                let gameStatus = checkWinner(currentPlayer);
                if (gameStatus) {
                    gameOver = true;
                    msg.textContent = 'You have won!'
                    emoji.textContent = (currentPlayer == 1 ? '🦖' : '🦕')
                }
                currentPlayer *= -1;
            }
            else {
                msg.textContent = 'Invalid move';
            }
        }

        draw();