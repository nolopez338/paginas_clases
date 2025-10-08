// Juego Snake en una sola página.
    (function(){
      const canvas = document.getElementById('game');
      const ctx = canvas.getContext('2d');
      const startBtn = document.getElementById('startBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const resetBtn = document.getElementById('resetBtn');
      const speedRange = document.getElementById('speedRange');
      const speedVal = document.getElementById('speedVal');
      const scoreEl = document.getElementById('score');
      const levelEl = document.getElementById('level');
      const lengthEl = document.getElementById('length');
      const saveBtn = document.getElementById('saveBtn');
      const loadBtn = document.getElementById('loadBtn');

      // Config
      const tileSize = 20;
      let cols = Math.floor(canvas.width / tileSize);
      let rows = Math.floor(canvas.height / tileSize);

      // Estado del juego
      let snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
      let dir = {x: 1, y: 0};
      let nextDir = {x:1,y:0};
      let apple = null;
      let score = 0;
      let level = 1;
      let paused = true;
      let running = false;
      let speed = Number(speedRange.value); // ticks per second
      let tickInterval = null;

      function resetGame(){
        cols = Math.floor(canvas.width / tileSize);
        rows = Math.floor(canvas.height / tileSize);
        snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
        dir = {x:1,y:0}; nextDir = {x:1,y:0};
        score = 0; level = 1; paused = true; running = false;
        placeApple();
        updateUI();
        draw();
      }

      function placeApple(){
        let x,y,collision;
        do{
          x = Math.floor(Math.random()*cols);
          y = Math.floor(Math.random()*rows);
          collision = snake.some(s=>s.x===x && s.y===y);
        }while(collision);
        apple = {x,y};
      }

      function update(){
        if(paused) return;
        dir = nextDir;
        const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
        // Check walls
        if(head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows){
          gameOver();
          return;
        }
        // Check self collision
        if(snake.some(seg => seg.x===head.x && seg.y===head.y)){
          gameOver();
          return;
        }
        snake.unshift(head);
        // Eat apple?
        if(head.x === apple.x && head.y === apple.y){
          score += 10;
          level = Math.floor(score/50) + 1;
          placeApple();
        } else {
          snake.pop();
        }
        updateUI();
      }

      function gameOver(){
        paused = true;
        running = false;
        clearInterval(tickInterval);
        alert('¡Fin del juego! Puntuación: ' + score);
      }

      function draw(){
        // clear
        ctx.fillStyle = '#061320';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // draw grid (subtle)
        ctx.strokeStyle = 'rgba(255,255,255,0.02)';
        ctx.lineWidth = 1;
        for(let x=0;x<=cols;x++){
          ctx.beginPath();ctx.moveTo(x*tileSize,0);ctx.lineTo(x*tileSize,rows*tileSize);ctx.stroke();
        }
        for(let y=0;y<=rows;y++){
          ctx.beginPath();ctx.moveTo(0,y*tileSize);ctx.lineTo(cols*tileSize,y*tileSize);ctx.stroke();
        }

        // draw apple
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.rect(apple.x*tileSize + 3, apple.y*tileSize + 3, tileSize-6, tileSize-6);
        ctx.fill();

        // draw snake
        for(let i=0;i<snake.length;i++){
          const s = snake[i];
          if(i===0){
            // head
            ctx.fillStyle = '#10b981';
            ctx.fillRect(s.x*tileSize, s.y*tileSize, tileSize, tileSize);
            // eye
            ctx.fillStyle = '#052018';
            const ex = s.x*tileSize + (dir.x>=0? tileSize-6:4);
            const ey = s.y*tileSize + 6;
            ctx.fillRect(ex, ey, 4, 4);
          } else {
            const shade = 200 - Math.min(160, i*6);
            ctx.fillStyle = `rgb(${shade}, ${shade+20}, ${shade-30})`;
            ctx.fillRect(s.x*tileSize, s.y*tileSize, tileSize-1, tileSize-1);
          }
        }

        // schedule next paint
        if(!paused) requestAnimationFrame(draw);
      }

      // Input
      window.addEventListener('keydown', e=>{
        const key = e.key;
        if(['ArrowUp','w','W'].includes(key)) setNextDir(0,-1);
        if(['ArrowDown','s','S'].includes(key)) setNextDir(0,1);
        if(['ArrowLeft','a','A'].includes(key)) setNextDir(-1,0);
        if(['ArrowRight','d','D'].includes(key)) setNextDir(1,0);
        if(key === ' '){ togglePause(); e.preventDefault(); }
      });

      function setNextDir(x,y){
        // prevent reversing
        if(dir.x === -x && dir.y === -y) return;
        nextDir = {x,y};
      }

      // Controls
      startBtn.addEventListener('click', ()=>{
        if(running) return; // already running
        paused = false; running = true;
        startTicker(); draw();
      });
      pauseBtn.addEventListener('click', togglePause);
      resetBtn.addEventListener('click', ()=>{ resetGame(); });

      function togglePause(){
        paused = !paused;
        if(!paused && !running){ running = true; startTicker(); draw(); }
        if(paused){ clearInterval(tickInterval); }
      }

      function startTicker(){
        clearInterval(tickInterval);
        speed = Number(speedRange.value);
        const ms = 1000 / speed; // ms per tick
        tickInterval = setInterval(()=>{ update(); }, ms);
      }

      speedRange.addEventListener('input', ()=>{
        speedVal.textContent = speedRange.value;
        if(running && !paused) startTicker();
      });

      function updateUI(){
        scoreEl.textContent = score;
        levelEl.textContent = level;
        lengthEl.textContent = snake.length;
      }

      // Save / Load high score basic (localStorage)
      saveBtn.addEventListener('click', ()=>{
        const prev = Number(localStorage.getItem('snake_high')||0);
        if(score > prev) localStorage.setItem('snake_high', String(score));
        alert('Record guardado: ' + Math.max(score, prev));
      });
      loadBtn.addEventListener('click', ()=>{
        alert('Mejor puntuación guardada: ' + (localStorage.getItem('snake_high')||0));
      });

      // Resize handling (responsive)
      function fitCanvas(){
        // keep aspect ratio — fit within parent width
        const maxW = Math.min(720, window.innerWidth - 120);
        const maxH = Math.min(520, window.innerHeight - 160);
        // choose tileSize so we have an integer grid
        const preferredTile = 20;
        const newCols = Math.floor(maxW / preferredTile) || 20;
        const newRows = Math.floor(maxH / preferredTile) || 15;
        canvas.width = newCols * preferredTile;
        canvas.height = newRows * preferredTile;
        // update tile size derived values
        // note: tileSize constant is used for drawing — keep consistent
        cols = newCols; rows = newRows;
        resetGame();
      }

      window.addEventListener('resize', ()=>{
        // don't be too aggressive on resize
        clearTimeout(window._resizeTO);
        window._resizeTO = setTimeout(fitCanvas, 120);
      });

      // Inicialización
      fitCanvas();

    })();