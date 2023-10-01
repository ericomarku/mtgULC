// function Orientation() {
//   screen.orientation.lock("landscape")
//   console.log(screen.orientation.type);
// }

// addEventListener('load', Orientation)
// addEventListener('orientationchange', Orientation)

$(document).ready(function(){
  let startLife = 40;
  const maxPlayer = 6
  const newGameState = [
    // [life,[cmd1, cmd2, cmd3, cmd4, cmd5, cmd6], dead, poison, monarch, initiative, [w,u,t,r,g]],
    [startLife, [0,0,0,0,0,0], false, 0, false, false, [false, false, false, false, false]],
    [startLife, [0,0,0,0,0,0], false, 0, false, false, [false, false, false, false, false]],
    [startLife, [0,0,0,0,0,0], false, 0, false, false, [false, false, false, false, false]],
    [startLife, [0,0,0,0,0,0], false, 0, false, false, [false, false, false, false, false]],
    [startLife, [0,0,0,0,0,0], false, 0, false, false, [false, false, false, false, false]],
    [startLife, [0,0,0,0,0,0], false, 0, false, false, [false, false, false, false, false]],
    // [playerNumber, monarch, initiative]
    [2, false, false]
  ];

  let aniNames = [
    'ghost',
    'hangman',
    'skull',
    'zombie',
    'zombie-hand',
    'zombie-head'
  ];

  let aniSvg = [
    ['ghost'],
    ['hangman'],
    ['skull'],
    ['zombie'],
    ['moon','zombie-hand'],
    ['zombie-head']
  ]

  let deathAnimations = [];

  for (var i = 0; i < aniNames.length; i++) {
    deathAnimations[i] = document.createElement('div')
    deathAnimations[i].classList.add(aniNames[i]);
    deathAnimations[i].classList.add('death-ani');
    for (var j = 0; j < aniSvg[i].length; j++) {
      let img = document.createElement('img');
      img.setAttribute('src', 'css/img/death-animations/' + aniSvg[i][j] + '.svg');
      img.classList.add(aniSvg[i][j])
      deathAnimations[i].append(img);
    }
  }

  const deathKinds = [
    'Defeated',
    'Destroyed',
    'Crushed',
    'Beaten',
    'Exterminated',
    'Annihilated'
  ];

  const deathMessages = [
    ['Better luck next time buddy.'],
    ['Erhm...', 'Did you misplay?'],
    ['Beware of whom you trust.'],
    ['Don\'t worry,', 'you will get your revenge.'],
    ['Hello darkness my old friend.'],
    ['You fought a good fight,', 'now rest in peace.'],
    ['The battlefield has', 'claimed your soul.'],
    ['You...', 'you did okay...'],
    ['Welcome to the Abyss.'],
    ['Your empire has fallen.'],
    ['A captain goes down with his ship.']
  ];

  let gameState = JSON.parse(localStorage.getItem('gameState'));

  if (gameState == null) {
    gameState = newGameState;
    updateLocalStorage();
  }

  let playerGrid = $('.playersGrid');
  let lifeBtns = $('.lifeBtn');
  let cmdBtns = $('.CMD');

  let deathBtns = $('.deathBtn');
  let defeatBtns = $('.defeat');
  let defiantBtns = $('.defiant');

  let colorMenu = $('.colorSelect');
  let colorBtn = $('.colorSelect').children('.colorContainer').children('input');

  let poisonBtn = $('.poisonContainer');

  let fMonarchBtn = $('.card-face-front').find('.monarch');
  let bMonarchBtn = $('.card-face-back').find('.monarch');

  let fInitiativeBtn = $('.card-face-front').find('.initiative');
  let bInitiativeBtn = $('.card-face-back').find('.initiative');

  let flipBtns = $('.flipBtn');

  let resetBtn = $('.reset');
  let setPlayersBtn = $('.setPlayers');


  let menu = $('.menu');

  // lifeBtns.click(changeLife);
  cmdBtns.on('click mousedown touchstart mouseup mouseleave touchend', changeCmd);

  deathBtns.on('click touchstart', showConcede);
  defeatBtns.click(playerLoses);
  defiantBtns.click(hideConcede);

  colorMenu.click(colorExpand);
  colorBtn.change(setColor);

  poisonBtn.on('click mousedown touchstart mouseup mouseleave touchend', changePoisen);

  fMonarchBtn.on('click touchstart', becomeMonarch);
  bMonarchBtn.click(toggleMonarch);

  fInitiativeBtn.on('click touchstart', takeInitiative);
  bInitiativeBtn.click(toggleInitiative);

  // flipBtns.click(flipCard);

  resetBtn.click(reset);
  setPlayersBtn.click(changePlayers);

  setup();

  menu.on('touchmove', moveMenu);
  function moveMenu(e) {
    let posX = e.touches[0].clientX
    // let posY = e.touches[0].clientY
    // $(this).css('left', posX).css('top', posY);
    $(this).css('left', posX)
  }

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const swipeAble = document.querySelectorAll('.swipeAble');

  swipeAble.forEach(e => {
    e.preventDefault();
    e.addEventListener('touchstart', handleTouchStart);
    e.addEventListener('touchmove', handleTouchMove);
  });

  function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function handleTouchMove(e) {
    const touch = e.touches[0]
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) / Math.abs(deltaY) > 0.5) {
      if (deltaX > 0) {
        alert('right or left', $(this));
      }
    } else {
      if (deltaY > 0) {
        alert('up or down', $(this));
      }
    }
  }

  document.addEventListener("touchend", e => {
    [...e.changedTouches].forEach(touch => {
      var t = $(touch.target)
      var c = t.attr('class');
      console.log(c);
      if (t.hasClass('flipBtn')) {
        flipCard(t)
      }
      if (t.hasClass('lifeBtn')) {
        changeLife(t)
      }

    });

  })

  $(document).on('click touchstart',function () {
    let fs = $(document).fullScreen() ? "on" : "off";
    if (fs == "off") {
      $(document).fullScreen(true)
      screen.orientation.lock("landscape-primary")
      navigator.wakeLock.request('screen')
    }
  });

  screen.orientation.addEventListener('change', function() {
	   console.log('Current orientation is ' + screen.orientation.type);
  });

  // let screenLock;
  // navigator.wakeLock.request('screen').then(lock => {
  //   screenLock = lock;
  // });

  // Or you can make an await call
  // let screenLock = await navigator.wakeLock.request('screen');

  function setup() {

    playerGrid.addClass('numP' + gameState[6][0]).css('opacity', 1);
    let playerCards = $('.playerCard');

    let lifeValues = $('.lValue');
    let cmdValues = $('.CMDValue');
    let poisonValues = $('.pValue');

    let deathCards = $('.card-face-dead');
    let deadCards = $('.dead');
    let flippedCards = $('.flipped');
    let concede = $('.concede');
    let colorBox = $('.colorContainer').children('input')

    lifeValues.each(function (index) {
      $(this).html(gameState[index][0]);
    })

    cmdValues.each(function (index) {
      let p = Math.floor(index / 5);
      let cmdIndex = index % 5;
      if (cmdIndex >= p) {
        cmdIndex++;
      }
      $(this).html(gameState[p][1][cmdIndex])
    })

    poisonValues.each(function (index) {
      let p = Math.floor(index / 2)
      $(this).html(gameState[p][3]);
      if (gameState[p][3] > 0) {
        $(this).parent().addClass('poisonOn');
      }
    })

    fMonarchBtn.each(function (index) {
      if (gameState[index][4]) {
        $(this).addClass('mOn');
        fMonarchBtn.addClass('active');
        bMonarchBtn.addClass('active').addClass('mOn');
      }
    })

    fInitiativeBtn.each(function (index) {
      if (gameState[index][5]) {
        $(this).addClass('iOn');
        fInitiativeBtn.addClass('active');
        bInitiativeBtn.addClass('active').addClass('iOn');
      }
    })

    colorBox.each(function (index) {
      let p = Math.floor(index / 5);
      let colorIndex = index % 5;
      if (gameState[p][6][colorIndex]) {
        $(this).prop('checked', true)
      } else {
        $(this).prop('checked', false)
      }
    });

    deadCards.removeClass('dead');
    playerCards.each(function(index) {
      if (gameState[index][2]) {
        $(this).addClass('dead');
      }
      updateColor($(this))
    });

    flippedCards.removeClass('flipped');
    concede.css('pointer-events', 'none').css('opacity', '0');

    let setDeathAnimations = [];
    let setDeathKinds = [];
    let setDeathMessages = [];

    while (setDeathAnimations.length < maxPlayer) {
      let x = Math.floor(Math.random() * deathAnimations.length);
      if (!setDeathAnimations.includes(x)) {
        setDeathAnimations.push(x);
      }
    }
    while (setDeathKinds.length < maxPlayer) {
      let x = Math.floor(Math.random() * deathKinds.length);
      let kind = deathKinds[x];
      if (!setDeathKinds.includes(kind)) {
        setDeathKinds.push(kind);
      }
    }
    while (setDeathMessages.length < maxPlayer) {
      let x = Math.floor(Math.random() * deathMessages.length);
      let mes = deathMessages[x];
      if (!setDeathMessages.includes(mes)) {
        setDeathMessages.push(mes);
      }
    }
    for (var i = 0; i < maxPlayer; i++) {
      deathCards[i].innerHTML = '';
      deathCards[i].append(deathAnimations[setDeathAnimations[i]]);
      let h1 = document.createElement('h1');
      h1.append(setDeathKinds[i])
      deathCards[i].append(h1);
      for (var j = 0; j < setDeathMessages[i].length; j++) {
        let p = document.createElement('p');
        p.append(setDeathMessages[i][j]);
        deathCards[i].append(p);
      }
    }
  }

  function reset() {
    for (var i = 0; i < gameState.length; i++) {
      for (var j = 0; j < gameState[i].length; j++) {
        if (i < gameState.length - 1 && j != 6) {
          gameState[i][j] = newGameState[i][j]
        }
      }
    }
    poisonBtn.removeClass('poisonOn')
    updateLocalStorage();
    setup();
  }

  function changePlayers() {
    let newPlayers = gameState[6][0] + 1
    playerGrid.removeClass('numP' + gameState[6][0]).css('opacity', 0);
    if (newPlayers > 6) {
      newPlayers = 2;
    }
    gameState[6][0] = newPlayers;
    playerGrid.addClass('numP' + gameState[6][0]).css('opacity', 1);
    updateLocalStorage();
  }

  function changeLife(e) {
    let add = e.hasClass('addLbtn');
    let lifeElement = e.parent().children('.lifeCount').children('.lValue')
    let lifeChange = e.parent().children('.lifeCount').children('.lChange')
    let currentLife = parseFloat(lifeElement.html());
    let resentChange = parseFloat(lifeChange.html());
    let changeBy;

    let pIndex = playerIndex(e);

    if (add) {
      changeBy = 1;
    } else {
      changeBy = -1;
    }

    if (!resentChange) {
      resentChange = 0;
    }

    let newLife;
    let newChange;

    let showing = lifeChange.css("opacity")

    if (showing == 0) {
      resentChange = 0;
    }

    newLife = currentLife + changeBy;
    newChange = resentChange + changeBy;

    if (newChange > 0) {
      newChange = "+" + newChange;
    }
    if (newChange == 0) {
      newChange = "";
    }

    lifeElement.html(newLife);
    lifeChange.html(newChange);

    lifeChange.addClass('showChange');
    setTimeout(function () {
      lifeChange.removeClass('showChange');
    }, 5);

    gameState[pIndex][0] = newLife;
    updateLocalStorage();
  }

  function changeCmd(e) {
    e.preventDefault();
    let action = e.type;

    let cmdElem = $(this).children('.CMDValue');
    let cmd = parseFloat(cmdElem.html());

    let cmdIndex = playerIndex($(this));
    let pIndex = playerIndex($(this).parent());

    if (action == 'mousedown' || action == 'touchstart') {
      isHolding = setTimeout(function () {
        gameState[pIndex][1][cmdIndex] = 0;
        resetCmd(cmdElem);
        cmdElem.addClass('reset');
        return;
      }, 2000);
    }

    if (action == 'click' || action == 'mouseup' || action == 'mouseleave' || action == 'touchend') {
      clearTimeout(isHolding);

      let hasReset = cmdElem.hasClass('reset');

      if (hasReset) {
        cmdElem.removeClass('reset');
      } else {
        cmd++;
        cmdElem.html(cmd);
        gameState[pIndex][1][cmdIndex] = cmd;
      }
    }
    updateLocalStorage();
  }
  function resetCmd(el) {
    el.html(0);
    updateLocalStorage();
  }

  function changePoisen(e) {
    e.preventDefault();
    let action = e.type;

    let poisonCon = detectPlayer($(this)).find('.poisonContainer');
    let poisonElem = detectPlayer($(this)).find('.pValue');
    let poison = parseFloat(poisonElem.html());


    // console.log(frontPoisonCon, frontPoison);

    let pIndex = playerIndex($(this).parent());

    if (action == 'mousedown' || action == 'touchstart') {
      isHolding = setTimeout(function () {
        gameState[pIndex][3] = 0;
        resetPoison(poisonElem);
        poisonCon.removeClass('poisonOn')
        poisonElem.addClass('reset');
        return;
      }, 2000);
    }

    if (action == 'click' || action == 'mouseup' || action == 'mouseleave' || action == 'touchend') {
      clearTimeout(isHolding);

      let hasReset = poisonElem.hasClass('reset');

      if (hasReset) {
        poisonElem.removeClass('reset');
      } else {
        poison++;
        poisonCon.addClass('poisonOn');
        poisonElem.html(poison);
        gameState[pIndex][3] = poison;
      }
    }
    updateLocalStorage();
  }
  function resetPoison(el) {
    el.html(0);
    poisonBtn.removeClass('poisonOn')
    updateLocalStorage();
  }

  function toggleMonarch() {
    let monarchState = $(this).hasClass('active');
    let monarch = $('.monarch');
    let backMonarch = $('.card-face-back').find('.monarch');
    let frontMonarch = $('.card-face-front').find('.monarch');
    let thisFrontMonarch = detectPlayer($(this)).find('.card-face-front').find('.monarch')

    let pIndex = playerIndex($(this));

    if (monarchState) {
      monarch.removeClass('active');
      monarch.removeClass('mOn');
      pIndex = -1;
    } else {
      monarch.addClass('active');
      backMonarch.addClass('mOn');
      frontMonarch.removeClass('mOn');
      thisFrontMonarch.addClass('mOn');
    }
    for (var i = 0; i < gameState.length; i++) {
      gameState[i][4] = false;
      if (i == pIndex) {
        gameState[i][4] = true;
      }
    }
    updateLocalStorage();
  }
  function becomeMonarch() {
    fMonarchBtn.removeClass('mOn');
    $(this).addClass('mOn');
    let pIndex = playerIndex($(this));
    for (var i = 0; i < gameState.length; i++) {
      gameState[i][4] = false;
      if (i == pIndex) {
        gameState[i][4] = true;
      }
    }
    updateLocalStorage();
  }

  function toggleInitiative() {
    let initiativeState = $(this).hasClass('active');
    let initiative = $('.initiative');
    let backInitiative = $('.card-face-back').find('.initiative');
    let frontInitiative = $('.card-face-front').find('.initiative');
    let thisFrontInitiative = detectPlayer($(this)).find('.card-face-front').find('.initiative')

    let pIndex = playerIndex($(this));

    if (initiativeState) {
      initiative.removeClass('active');
      initiative.removeClass('iOn');
      pIndex = -1;
    } else {
      initiative.addClass('active');
      backInitiative.addClass('iOn');
      frontInitiative.removeClass('iOn');
      thisFrontInitiative.addClass('iOn');
    }
    for (var i = 0; i < gameState.length; i++) {
      gameState[i][5] = false;
      if (i == pIndex) {
        gameState[i][5] = true;
      }
    }
    updateLocalStorage();
  }
  function takeInitiative() {
    fInitiativeBtn.removeClass('iOn');
    $(this).addClass('iOn');
    let pIndex = playerIndex($(this));
    for (var i = 0; i < gameState.length; i++) {
      gameState[i][5] = false;
      if (i == pIndex) {
        gameState[i][5] = true;
      }
    }
    updateLocalStorage();
  }

  function showConcede() {
    let concede = $(this).parent().parent().parent().parent().children('.concede');
    concede.css('pointer-events', 'auto').css('opacity', '1');
  }
  function hideConcede() {
    let concede = $(this).parent().parent()
    concede.css('pointer-events', 'none').css('opacity', '0');
  }
  function playerLoses() {
    let player = detectPlayer($(this));
    player.addClass('dead')

    let pIndex = playerIndex($(this));
    gameState[pIndex][2] = true;
    updateLocalStorage();
  }

  function colorExpand() {
    let cSelect = $(this)
    let responsive = cSelect.hasClass('responsive');

    if (!responsive) {
      cSelect.addClass('responsive');

      colorMenu.parent().append('<button class="colorUnselect"></button>')
      $('.colorUnselect').click(function () {
        $('.colorUnselect').remove();
        cSelect.removeClass('responsive');
      })
    }
  }
  function setColor() {
    let colorArray = $(this).parent().parent().children().children('input');

    let pIndex = playerIndex($(this));

    let wubrg = ['W','U','B','R','G'];
    let newColor = 'var(--'

    for (var i = 0; i < colorArray.length; i++) {
      if (colorArray[i].checked) {
        newColor = newColor + wubrg[i];
        gameState[pIndex][6][i] = true;
      } else {
        gameState[pIndex][6][i] = false;
      }
    }

    if (newColor === 'var(--') {
      newColor = newColor + 'N';
    }

    newColor = newColor + ')'

    let p = playerNumber(detectPlayer($(this)));

    $('.c' + p).css('background-color', newColor).css('background-image', newColor);
    updateLocalStorage();
  }
  function updateColor(player) {
    let p = player.children().children('.card-face-front').children('.colorSelect').children('.colorContainer').children('input');

    let wubrg = ['W','U','B','R','G'];

    for (var i = 0; i < p.length; i++) {
      if (!p[i].checked) {
        wubrg[i] = '';
      }
    }

    applyColor(wubrg[0],wubrg[1],wubrg[2],wubrg[3],wubrg[4],player)
  }
  function applyColor(w, u, b, r, g, player) {
    let p = playerNumber(detectPlayer(player));
    let newColor = 'var(--' + w + u + b + r + g + ')';
    if (newColor === 'var(--)') {
      newColor = 'var(--N)';
    }
    $('.c' + p).css('background-color', newColor).css('background-image', newColor);
  }

  function flipCard(e) {
    let card = e.parent().parent();
    let isFlipped = card.hasClass('flipped');
    if (isFlipped) {
      card.removeClass('flipped');
    } else {
      card.addClass('flipped');
    }
  }

  function detectPlayer(el) {
    let p = el
    let isP = [el.hasClass('p1'),
               el.hasClass('p2'),
               el.hasClass('p3'),
               el.hasClass('p4'),
               el.hasClass('p5'),
               el.hasClass('p6')]

    let playerFound = -1;
    for (var i = 0; i < isP.length; i++) {
      if (isP[i]) {
        playerFound = i + 1;
      }
    }

    if (playerFound == -1) {
      p = detectPlayer(el.parent());
    }

    return p;
  }
  function playerNumber(el) {
    let pN = detectPlayer(el);
    for (var i = 1; i <= maxPlayer; i++) {
      let isP = pN.hasClass('p' + i);
      if (isP) {
        return i;
      }
    }
  }
  function playerIndex(el) {
    return playerNumber(el) - 1;
  }

  function updateLocalStorage() {
    localStorage.setItem('gameState',  JSON.stringify(gameState));
  }
});
