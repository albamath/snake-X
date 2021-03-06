// Snake in pure js. Simple as it gets. 
// But in a "cross view" of an L translation 
// surface instead of a "square view" of a flat 
// torus. Duplicated from snake-L.js which was 
// forked from zprima/snake-js-game, adapted by 
// myself. Just run a server or test it at 
// http://albamath.com/snake-X.

      var canvas, ctx;

      window.onload = function() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        document.addEventListener("keydown", keyDownEvent);
        document.addEventListener("touchstart", touchEvent);
        document.addEventListener("touchmove", touchEvent);

        // render fr times per second
        var f = 8;
        setInterval(draw, 1000 / f);
      };

      // game world
      var gridSize = 2*(halfGridSize = 2*(quartGridSize = 5)); // 20 x 20 - 4 x 5 x 5
      var tileSize = 18;
      var nextX = (nextY = 0);
      var diffX = (diffY = 0);
      var cX = (cY = 0);

      // snake
      var defaultTailSize = 3;
      var tailSize = defaultTailSize;
      var snakeTrail = [];
      var snakeY = (snakeX = halfGridSize);

      // apple
      var appleX = 18;
      var appleY = 8;

      // draw
      function draw() {
        // move snake in next pos along X
        if (nextX != 0) {
          snakeX += nextX;
          // snake over game world?
          if (snakeX < 0) {
            snakeX = gridSize - 1;
          }          
          if (snakeX >= gridSize) {
            snakeX = 0;
          }
          cX = snakeX - halfGridSize;
          if (   (cX < -quartGridSize
               || cX >= quartGridSize)
              && (cY < -quartGridSize
               || cY >= quartGridSize)
             ) {
            if (snakeX < quartGridSize) {
              snakeX = 3*quartGridSize - 1;
            }
            if (snakeX >= 3*quartGridSize ) {
              snakeX = quartGridSize;
            }
            cX = snakeX - halfGridSize;
          }
        }
        // move snake in next pos along Y
        if (nextY != 0) {
          snakeY += nextY;
          // snake over game world?
          if (snakeY < 0) {
            snakeY = gridSize - 1;
          }  
          if (snakeY >= gridSize) {
            snakeY = 0;
          }
          cY = snakeY - halfGridSize;
          if (   (cX < -quartGridSize
               || cX >= quartGridSize)
              && (cY < -quartGridSize
               || cY >= quartGridSize)) {
            if (snakeY < quartGridSize) {
              snakeY = 3*quartGridSize - 1;
            }
            if (snakeY >= 3*quartGridSize) { 
              snakeY = quartGridSize;
            }
            cY = snakeY - halfGridSize;
          }
        }  

        //snake bite apple?
        if (snakeX == appleX && snakeY == appleY) {
          tailSize++;
          
          // apple initially random at the central piece
          appleX = quartGridSize + Math.floor(Math.random() * halfGridSize);
          appleY = quartGridSize + Math.floor(Math.random() * halfGridSize);
          // then displace to the side pieces 
          // (the central region remains twice as likely though)
          if (Math.floor(2*Math.random()) == 1) {
            if (Math.floor(2*Math.random()) == 1) {
              appleX += quartGridSize
            } else {
              appleX -= quartGridSize
            }
          } else {
            if (Math.floor(2*Math.random()) == 1) {
              appleY += quartGridSize
            } else {
              appleY -= quartGridSize
            }
          }
        }

        //paint background
        ctx.fillStyle = "black";
        ctx.fillRect(quartGridSize*tileSize, 0, halfGridSize*tileSize, gridSize*tileSize);  
        ctx.fillRect(0, quartGridSize*tileSize, quartGridSize*tileSize, halfGridSize*tileSize);  
        ctx.fillRect(3*quartGridSize*tileSize, quartGridSize*tileSize, quartGridSize*tileSize, halfGridSize*tileSize);
       

        // paint snake
        ctx.fillStyle = "green";
        for (var i = 0; i < snakeTrail.length; i++) {
          ctx.fillRect(
            snakeTrail[i].x * tileSize,
            snakeTrail[i].y * tileSize,
            tileSize,
            tileSize
          );

          //snake bites it's tail?
          if (snakeTrail[i].x == snakeX && snakeTrail[i].y == snakeY) {
            tailSize = defaultTailSize;
          }
        }

        // paint apple
        ctx.fillStyle = "red";
        ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);

        //set snake trail
        snakeTrail.push({ x: snakeX, y: snakeY });
        while (snakeTrail.length > tailSize) {
          snakeTrail.shift();
        }
      }

      // keyboard input
      function keyDownEvent(e) {
        switch (e.keyCode) {
          case 37:
            if (nextX != 1) {
              nextX = -1; 
              nextY = 0;
            }
            break;
          case 38:
            if (nextY != 1) {
              nextX = 0;
              nextY = -1;
            }
            break;
          case 39:
            if (nextX != -1) {
              nextX = 1;
              nextY = 0;
            }
            break;
          case 40:
            if (nextY != -1) {
              nextX = 0;
              nextY = 1;
            }
            break;
        }
      }
      
      // touch input
      function touchEvent(e) {
        if (e.touches) {
          diffX = e.touches[0].pageX - canvas.offsetLeft - snakeX*tileSize;
          diffY = e.touches[0].pageY - canvas.offsetTop  - snakeY*tileSize;
          if (diffX == 0 && diffY == 0) {
            return;
          }
          if (Math.abs(diffX) > Math.abs(diffY) 
              && nextX + Math.sign(diffX) != 0) {
            nextX = Math.sign(diffX);
            nextY = 0;
          } else if (Math.abs(diffX) < Math.abs(diffY) 
                     && nextY + Math.sign(diffY) != 0) {
            nextX = 0;
            nextY = Math.sign(diffY);
          }
          //// Uncomment for touch debugging
          //output.innerHTML = "Rel. touch: "
          //                   +  " x: " + Math.ceil(diffX/tileSize) 
          //                   + ", y: " + Math.ceil(diffY/tileSize);
          e.preventDefault();
        }
      }
    
