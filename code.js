<<<<<<< HEAD
(function(){
  // ===== Passwortschutz =====
  const password = "000"; // Passwort einfügen
  const input = document.getElementById("password-input");
  const submit = document.getElementById("password-submit");
  const error = document.getElementById("password-error");
  const main = document.getElementById("main-content");
  const container = document.getElementById("password-container");

  submit.addEventListener("click", () => {
    if(input.value === password){
      container.style.display = "none";
      main.style.display = "block";
    } else {
      error.style.display = "block";
    }
  });

  // ===== Modal =====
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  modalClose.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('open'); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') modal.classList.remove('open'); });

  // ===== Geschenke =====
  const gifts = document.querySelectorAll('.gift');

  gifts.forEach((g, idx) => {
    g.dataset.id = idx + 1; // 1-8
    g.addEventListener('click', () => {
      const id = g.dataset.id;
      const giftName =g.getAttribute('data-gift');
      
      const giftDesc = g.getAttribute('data-hint') || "";

      switch(id){
        case "1":
        case "2":
          showTicTacToe(giftName, giftDesc);
          break;
        case "3":
        case "4":
          showRPS(giftName, giftDesc);
          break;
        case "5":
          startQuiz(quiz1, giftName, giftDesc);
          break;
        case "6":
          startQuiz(quiz2, giftName, giftDesc);
          break;
        case "7":
          showNumberGuess(giftName, giftDesc);
          break;
        case "8":
          showMemory(giftName, giftDesc);
          break;
      }
      modal.classList.add('open');
    });
  });

  // ===== Tic Tac Toe =====
  function showTicTacToe(name, desc){
    let board = Array(9).fill('');
    const player = 'X';
    const aiPlayer = 'O';
    modalContent.innerHTML = `<h3>${name}</h3><div id="ttt-board" style="display:grid;grid-template-columns:repeat(3,60px);gap:5px;margin:10px auto;"></div><p id="ttt-msg"></p>`;
    const boardDiv = document.getElementById('ttt-board');
    const msg = document.getElementById('ttt-msg');

    function render(){
      boardDiv.innerHTML = '';
      board.forEach((cell,i)=>{
        const btn = document.createElement('button');
        btn.style.width='60px'; btn.style.height='60px'; btn.style.fontSize='24px';
        btn.textContent = cell;
        btn.disabled = cell!=='';
        btn.addEventListener('click', ()=>{
          board[i] = player;
          if(checkWin(player)){
            endGame(player);
            render();
            return;
          } 
          if(board.every(c=>c!=='')){
            endGame('draw');
            render();
            return;
          }
          aiMove();
          render();
        });
        boardDiv.appendChild(btn);
      });
    }

    function aiMove(){
      const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
      const choice = empty[Math.floor(Math.random()*empty.length)];
      if(choice!==undefined) board[choice]=aiPlayer;
      if(checkWin(aiPlayer)){
        endGame(aiPlayer);
      }
    }

    function checkWin(p){
      const combos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      return combos.some(c=>c.every(i=>board[i]===p));
    }

    function endGame(winner){
      setTimeout(()=>{
        if(winner===player){
          modalContent.innerHTML = `<h3>${name}</h3><p>${desc}</p>`;
        } else if(winner===aiPlayer){
          modalContent.innerHTML = `<p>Leider hat der Computer gewonnen. Versuche es erneut!</p>`;
        } else {
          modalContent.innerHTML = `<p>Unentschieden! Versuche es erneut!</p>`;
        }
      },200);
    }

    render();
  }

  // ===== Schere-Stein-Papier =====
  function showRPS(name, desc){
    modalContent.innerHTML = `<h3>${name}</h3>
      <p>Wähle Schere ✂️, Stein 🪨 oder Papier 📄:</p>
      <button data-move="Schere">✂️ Schere</button>
      <button data-move="Stein">🪨 Stein</button>
      <button data-move="Papier">📄 Papier</button>
      <p id="rps-msg"></p>
    `;
    const buttons = modalContent.querySelectorAll('button');
    const msg = modalContent.querySelector('#rps-msg');
    buttons.forEach(b=>{
      b.addEventListener('click', ()=>{
        const player = b.getAttribute('data-move');
        const moves = ['Schere','Stein','Papier'];
        const ai = moves[Math.floor(Math.random()*3)];
        let result='';
        if(player===ai) result='draw';
        else if((player==='Schere'&&ai==='Papier')||(player==='Stein'&&ai==='Schere')||(player==='Papier'&&ai==='Stein')) result='win';
        else result='lose';

        if(result==='win'){
          modalContent.innerHTML = `<h3>${name}</h3><p>${desc}</p>`;
        } else if(result==='lose'){
          msg.textContent=`Leider verloren! Computer wählte ${ai}. Versuche es erneut.`;
        } else{
          msg.textContent=`Unentschieden! Computer wählte ${ai}.`;
        }
      });
    });
  }

  // ===== Quiz-Logik =====
  function startQuiz(quizData, giftName, giftDesc) {
    let score = 0;
    let currentQuestion = 0;

    function showQuestion() {
      const q = quizData[currentQuestion];
      modalContent.innerHTML = `
        <h3>${giftName}</h3>
        <p>${q.question}</p>
        ${q.answers.map(a => `<button data-answer="${a}">${a}</button>`).join('')}
        <p id="quiz-msg"></p>
      `;
      const buttons = modalContent.querySelectorAll('button');
      const msg = modalContent.querySelector('#quiz-msg');

      buttons.forEach(b => {
        b.addEventListener('click', () => {
          const answer = b.getAttribute('data-answer');
          if(answer === q.correct) score++;
          currentQuestion++;
          if(currentQuestion < quizData.length) {
            showQuestion();
          } else {
            msg.textContent = `Dein Ergebnis: ${score}/${quizData.length}`;
            if(score === quizData.length){
              modalContent.innerHTML += `<p>Herzlichen Glückwunsch! Du hast das Geschenk freigeschaltet:</p><p><b>${giftName}</b></p><p>${giftDesc}</p>`;
            } else {
              modalContent.innerHTML += `<p>Leider nicht alle Fragen richtig. Versuche es erneut!</p>`;
            }
          }
        });
      });
    }

    showQuestion();
  }

  // ===== Quiz-Daten =====
  const quiz1 = [
    {question:"Was fasziniert mich am meisten?", answers:["Menschen","Meer","Universum","Körper"], correct:"Körper"},
    {question:"Welchen dieser Animes finde ich am besten?", answers:["Maid sama","HunterXHunter","No game no life","Astra lost in space"], correct:"HunterXHunter"},
    {question:"Was lese ich zurzeit?", answers:["Death is the only ending for the villainess","Only for love","Ugly ducking complex","Revelation of youth"], correct:"Revelation of youth"},
    {question:"Lese ich gerade mehr Ebook oder Manhwa?", answers:["Ebook","Manhwa"], correct:"Manhwa"},
    {question:"Was ist zurzeit mein Lieblingsmodul?", answers:["Buchführung","Geschäftsprozesse","Datenbanken","Angewandte Programmierung"], correct:"Datenbanken"}
  ];

  const quiz2 = [
    {question:"Wer würde eher einen Horrorfilm durchschauen?", answers:["Er","Ich"], correct:"Er"},
    {question:"Wer würde eher ein Geheimnis ausplaudern?", answers:["Er","Ich"], correct:"Ich"},
    {question:"Wer würde eher einem Menschen ins Gesicht sagen, was Er denkt?", answers:["Er","Ich"], correct:"Er"},
    {question:"Wer würde eher Faker treffen?", answers:["Er","Ich"], correct:"Ich"},
    {question:"Wer würde eher eine Prüfung ohne Lernen bestehen?", answers:["Er","Ich"], correct:"Er"}
  ];

  // ===== Zahlenraten =====
  function showNumberGuess(name, desc){
    const number = Math.floor(Math.random()*10)+1;
    modalContent.innerHTML = `<h3>${name}</h3>
      <p>Rate die Zahl zwischen 1 und 10:</p>
      <input type="number" id="num-input" min="1" max="10">
      <button id="num-submit">Raten</button>
      <p id="num-msg"></p>
    `;
    const input = modalContent.querySelector('#num-input');
    const submit = modalContent.querySelector('#num-submit');
    const msg = modalContent.querySelector('#num-msg');
    submit.addEventListener('click', ()=>{
      if(Number(input.value)===number){
        modalContent.innerHTML=`<h3>${name}</h3><p>${desc}</p>`;
      } else {
        msg.textContent='Falsch, versuche es erneut!';
      }
    });
  }

  // ===== Memory =====
  function showMemory(name, desc){
  // Emojis für 6 Paare (12 Karten)
  const emojis = ['🍎','🍌','🍇','🍓','🍉','🥝'];
  const pair = [...emojis,...emojis].sort(()=>Math.random()-0.5);
  let flipped = [];
  let found = [];

  modalContent.innerHTML = `<h3>${name}</h3>
    <div id="mem-board" style="display:grid;grid-template-columns:repeat(4,50px);gap:5px;margin:10px auto;"></div>
    <p id="mem-msg"></p>
  `;
  const board = modalContent.querySelector('#mem-board');

  pair.forEach((e,i)=>{
    const btn = document.createElement('button');
    btn.style.width='50px'; btn.style.height='50px';
    btn.dataset.index=i;
    btn.textContent='';
    btn.addEventListener('click',()=>{
      if(flipped.length<2 && !found.includes(i)){
        btn.textContent=e;
        flipped.push({btn,e,i});
        if(flipped.length===2){
          setTimeout(()=>{
            if(flipped[0].e===flipped[1].e){
              found.push(flipped[0].i,flipped[1].i);
              if(found.length===pair.length){
                modalContent.innerHTML=`<h3>${name}</h3><p>${desc}</p>`;
              }
            } else {
              flipped[0].btn.textContent='';
              flipped[1].btn.textContent='';
            }
            flipped=[];
          },700); // etwas kürzeres Aufdecken → schwieriger
        }
      }
    });
    board.appendChild(btn);
  });
}


})();
=======
(function(){
  // ===== Passwortschutz =====
  const password = "000"; // Passwort einfügen
  const input = document.getElementById("password-input");
  const submit = document.getElementById("password-submit");
  const error = document.getElementById("password-error");
  const main = document.getElementById("main-content");
  const container = document.getElementById("password-container");

  submit.addEventListener("click", () => {
    if(input.value === password){
      container.style.display = "none";
      main.style.display = "block";
    } else {
      error.style.display = "block";
    }
  });

  // ===== Modal =====
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  modalClose.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('open'); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') modal.classList.remove('open'); });

  // ===== Geschenke =====
  const gifts = document.querySelectorAll('.gift');

  gifts.forEach((g, idx) => {
    g.dataset.id = idx + 1; // 1-8
    g.addEventListener('click', () => {
      const id = g.dataset.id;
      const giftName =g.getAttribute('data-gift');
      
      const giftDesc = g.getAttribute('data-hint') || "";

      switch(id){
        case "1":
        case "2":
          showTicTacToe(giftName, giftDesc);
          break;
        case "3":
        case "4":
          showRPS(giftName, giftDesc);
          break;
        case "5":
          startQuiz(quiz1, giftName, giftDesc);
          break;
        case "6":
          startQuiz(quiz2, giftName, giftDesc);
          break;
        case "7":
          showNumberGuess(giftName, giftDesc);
          break;
        case "8":
          showMemory(giftName, giftDesc);
          break;
      }
      modal.classList.add('open');
    });
  });

  // ===== Tic Tac Toe =====
  function showTicTacToe(name, desc){
    let board = Array(9).fill('');
    const player = 'X';
    const aiPlayer = 'O';
    modalContent.innerHTML = `<h3>${name}</h3><div id="ttt-board" style="display:grid;grid-template-columns:repeat(3,60px);gap:5px;margin:10px auto;"></div><p id="ttt-msg"></p>`;
    const boardDiv = document.getElementById('ttt-board');
    const msg = document.getElementById('ttt-msg');

    function render(){
      boardDiv.innerHTML = '';
      board.forEach((cell,i)=>{
        const btn = document.createElement('button');
        btn.style.width='60px'; btn.style.height='60px'; btn.style.fontSize='24px';
        btn.textContent = cell;
        btn.disabled = cell!=='';
        btn.addEventListener('click', ()=>{
          board[i] = player;
          if(checkWin(player)){
            endGame(player);
            render();
            return;
          } 
          if(board.every(c=>c!=='')){
            endGame('draw');
            render();
            return;
          }
          aiMove();
          render();
        });
        boardDiv.appendChild(btn);
      });
    }

    function aiMove(){
      const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
      const choice = empty[Math.floor(Math.random()*empty.length)];
      if(choice!==undefined) board[choice]=aiPlayer;
      if(checkWin(aiPlayer)){
        endGame(aiPlayer);
      }
    }

    function checkWin(p){
      const combos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      return combos.some(c=>c.every(i=>board[i]===p));
    }

    function endGame(winner){
      setTimeout(()=>{
        if(winner===player){
          modalContent.innerHTML = `<h3>${name}</h3><p>${desc}</p>`;
        } else if(winner===aiPlayer){
          modalContent.innerHTML = `<p>Leider hat der Computer gewonnen. Versuche es erneut!</p>`;
        } else {
          modalContent.innerHTML = `<p>Unentschieden! Versuche es erneut!</p>`;
        }
      },200);
    }

    render();
  }

  // ===== Schere-Stein-Papier =====
  function showRPS(name, desc){
    modalContent.innerHTML = `<h3>${name}</h3>
      <p>Wähle Schere ✂️, Stein 🪨 oder Papier 📄:</p>
      <button data-move="Schere">✂️ Schere</button>
      <button data-move="Stein">🪨 Stein</button>
      <button data-move="Papier">📄 Papier</button>
      <p id="rps-msg"></p>
    `;
    const buttons = modalContent.querySelectorAll('button');
    const msg = modalContent.querySelector('#rps-msg');
    buttons.forEach(b=>{
      b.addEventListener('click', ()=>{
        const player = b.getAttribute('data-move');
        const moves = ['Schere','Stein','Papier'];
        const ai = moves[Math.floor(Math.random()*3)];
        let result='';
        if(player===ai) result='draw';
        else if((player==='Schere'&&ai==='Papier')||(player==='Stein'&&ai==='Schere')||(player==='Papier'&&ai==='Stein')) result='win';
        else result='lose';

        if(result==='win'){
          modalContent.innerHTML = `<h3>${name}</h3><p>${desc}</p>`;
        } else if(result==='lose'){
          msg.textContent=`Leider verloren! Computer wählte ${ai}. Versuche es erneut.`;
        } else{
          msg.textContent=`Unentschieden! Computer wählte ${ai}.`;
        }
      });
    });
  }

  // ===== Quiz-Logik =====
  function startQuiz(quizData, giftName, giftDesc) {
    let score = 0;
    let currentQuestion = 0;

    function showQuestion() {
      const q = quizData[currentQuestion];
      modalContent.innerHTML = `
        <h3>${giftName}</h3>
        <p>${q.question}</p>
        ${q.answers.map(a => `<button data-answer="${a}">${a}</button>`).join('')}
        <p id="quiz-msg"></p>
      `;
      const buttons = modalContent.querySelectorAll('button');
      const msg = modalContent.querySelector('#quiz-msg');

      buttons.forEach(b => {
        b.addEventListener('click', () => {
          const answer = b.getAttribute('data-answer');
          if(answer === q.correct) score++;
          currentQuestion++;
          if(currentQuestion < quizData.length) {
            showQuestion();
          } else {
            msg.textContent = `Dein Ergebnis: ${score}/${quizData.length}`;
            if(score === quizData.length){
              modalContent.innerHTML += `<p>Herzlichen Glückwunsch! Du hast das Geschenk freigeschaltet:</p><p><b>${giftName}</b></p><p>${giftDesc}</p>`;
            } else {
              modalContent.innerHTML += `<p>Leider nicht alle Fragen richtig. Versuche es erneut!</p>`;
            }
          }
        });
      });
    }

    showQuestion();
  }

  // ===== Quiz-Daten =====
  const quiz1 = [
    {question:"Was fasziniert mich am meisten?", answers:["Menschen","Meer","Universum","Körper"], correct:"Körper"},
    {question:"Welchen dieser Animes finde ich am besten?", answers:["Maid sama","HunterXHunter","No game no life","Astra lost in space"], correct:"HunterXHunter"},
    {question:"Was lese ich zurzeit?", answers:["Death is the only ending for the villainess","Only for love","Ugly ducking complex","Revelation of youth"], correct:"Revelation of youth"},
    {question:"Lese ich gerade mehr Ebook oder Manhwa?", answers:["Ebook","Manhwa"], correct:"Manhwa"},
    {question:"Was ist zurzeit mein Lieblingsmodul?", answers:["Buchführung","Geschäftsprozesse","Datenbanken","Angewandte Programmierung"], correct:"Datenbanken"}
  ];

  const quiz2 = [
    {question:"Wer würde eher einen Horrorfilm durchschauen?", answers:["Er","Ich"], correct:"Er"},
    {question:"Wer würde eher ein Geheimnis ausplaudern?", answers:["Er","Ich"], correct:"Ich"},
    {question:"Wer würde eher einem Menschen ins Gesicht sagen, was Er denkt?", answers:["Er","Ich"], correct:"Er"},
    {question:"Wer würde eher Faker treffen?", answers:["Er","Ich"], correct:"Ich"},
    {question:"Wer würde eher eine Prüfung ohne Lernen bestehen?", answers:["Er","Ich"], correct:"Er"}
  ];

  // ===== Zahlenraten =====
  function showNumberGuess(name, desc){
    const number = Math.floor(Math.random()*10)+1;
    modalContent.innerHTML = `<h3>${name}</h3>
      <p>Rate die Zahl zwischen 1 und 10:</p>
      <input type="number" id="num-input" min="1" max="10">
      <button id="num-submit">Raten</button>
      <p id="num-msg"></p>
    `;
    const input = modalContent.querySelector('#num-input');
    const submit = modalContent.querySelector('#num-submit');
    const msg = modalContent.querySelector('#num-msg');
    submit.addEventListener('click', ()=>{
      if(Number(input.value)===number){
        modalContent.innerHTML=`<h3>${name}</h3><p>${desc}</p>`;
      } else {
        msg.textContent='Falsch, versuche es erneut!';
      }
    });
  }

  // ===== Memory =====
  function showMemory(name, desc){
  // Emojis für 6 Paare (12 Karten)
  const emojis = ['🍎','🍌','🍇','🍓','🍉','🥝'];
  const pair = [...emojis,...emojis].sort(()=>Math.random()-0.5);
  let flipped = [];
  let found = [];

  modalContent.innerHTML = `<h3>${name}</h3>
    <div id="mem-board" style="display:grid;grid-template-columns:repeat(4,50px);gap:5px;margin:10px auto;"></div>
    <p id="mem-msg"></p>
  `;
  const board = modalContent.querySelector('#mem-board');

  pair.forEach((e,i)=>{
    const btn = document.createElement('button');
    btn.style.width='50px'; btn.style.height='50px';
    btn.dataset.index=i;
    btn.textContent='';
    btn.addEventListener('click',()=>{
      if(flipped.length<2 && !found.includes(i)){
        btn.textContent=e;
        flipped.push({btn,e,i});
        if(flipped.length===2){
          setTimeout(()=>{
            if(flipped[0].e===flipped[1].e){
              found.push(flipped[0].i,flipped[1].i);
              if(found.length===pair.length){
                modalContent.innerHTML=`<h3>${name}</h3><p>${desc}</p>`;
              }
            } else {
              flipped[0].btn.textContent='';
              flipped[1].btn.textContent='';
            }
            flipped=[];
          },700); // etwas kürzeres Aufdecken → schwieriger
        }
      }
    });
    board.appendChild(btn);
  });
}


})();
>>>>>>> f905a29c5e6c939dddee8b4954ef435ed66e2a3f
