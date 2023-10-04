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
  let commandMode = false;

  if (gameState == null) {
    gameState = newGameState;
    updateLocalStorage();
  }

  let playerGrid = $('.playersGrid');
  let lifeBtns = $('.lifeBtn');
  // let cmdBtns = $('.CMD');

  let deathBtns = $('.deathBtn');
  let defeatBtns = $('.defeat');
  let defiantBtns = $('.defiant');

  let colorMenu = $('.colorSelect');
  let colorBtn = $('.colorSelect').children('.colorContainer').children('input');

  let poisonBtn = $('.poisonContainer');

  let flipBtns = $('.flipBtn');

  let resetBtn = $('.reset');
  let setPlayersBtn = $('.setPlayers');


  let menu = $('.menu');

  deathBtns.on('click touchstart', showConcede);
  defeatBtns.click(playerLoses);
  defiantBtns.click(hideConcede);

  colorMenu.click(colorExpand);
  colorBtn.change(setColor);

  poisonBtn.on('click mousedown touchstart mouseup mouseleave touchend', changePoisen);

  flipBtns.click(flipCard);

  resetBtn.click(reset);
  setPlayersBtn.click(changePlayers);



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
  let preventer = false;

  const swipeAble = document.querySelectorAll('.swipeAble');

  swipeAble.forEach(e => {
    e.preventDefault;
    e.addEventListener('touchstart', handleTouchStart);
    e.addEventListener('touchmove', handleTouchMove);
    e.addEventListener('touchend', handleTouchEnd);
  });

  function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function handleTouchMove(e) {
    preventer = true;
    const touch = e.touches[0]
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
  }

  function handleTouchEnd(e) {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) + Math.abs(deltaX) > window.screen.width*0.2 && preventer) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) / Math.abs(deltaY) > 0.25) {
        //Left and Right
        flipCard($(this).find('.flipBtn'));
        preventer = false;
      } else if (Math.abs(deltaX) < Math.abs(deltaY) && Math.abs(deltaX) / Math.abs(deltaY) < 0.25) {
        //Up and Down
      }
    }
    touchStartX = touchEndX;
    touchStartY = touchEndY;
    setTimeout(function () {
      preventer = false;
    }, 50);
  }

  document.addEventListener("touchend", e => {
    [...e.changedTouches].forEach(touch => {
      var t = $(touch.target)
      var c = t.attr('class');
      // console.log(t);
      if (!preventer) {
        if (!commandMode) {
          if (t.hasClass('flipBtn')) {
            flipCard(t)
          }
          if (t.hasClass('lifeBtn')) {
            changeLife(t)
          }
        } else {
          if (t.hasClass('cmdBtn')) {
            changeCmd(t)
          }
        }
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

  setup();

  function setup() {

    playerGrid.addClass('numP' + gameState[6][0]).css('opacity', 1);
    let playerCards = $('.playerCard');

    let lifeValues = $('.lValue');
    let cmdValues = $('.cmdValue');
    let poisonValues = $('.pValue');

    let deathCards = $('.card-face-dead');
    let deadCards = $('.dead');
    let flippedCards = $('.flipped');
    let commandCards = $('.cmd');
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

    mainState();

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
    mainState();

    let newPlayers = gameState[6][0] + 1
    playerGrid.removeClass('numP' + gameState[6][0]).css('opacity', 0);
    if (newPlayers > 6) {
      newPlayers = 2;
    }
    gameState[6][0] = newPlayers;
    playerGrid.addClass('numP' + gameState[6][0]).css('opacity', 1);

    let cmdCards = $('.cmd');
    cmdCards.removeClass('cmd')
    for (var i = 1; i <= 6; i++) {
      cmdCards.removeClass('cd' + i);
    }

    updateLocalStorage();
  }

  function changeLife(e) {
    let add = e.hasClass('addbtn');
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
    let add = e.hasClass('addbtn');
    let activeCmd = e.parent().parent().attr('class').replace(/\D/g,'');
    let cmdElement = e.parent().children('.cmdCount').children('.command' + activeCmd);
    let cmdChange = e.parent().children('.cmdCount').children('.cmdChange')
    let currentCmd = parseFloat(cmdElement.html());
    let resentChange = parseFloat(cmdChange.html());
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

    let newCmd;
    let newChange;

    let showing = cmdChange.css("opacity")

    if (showing == 0) {
      resentChange = 0;
    }

    newCmd = currentCmd + changeBy;
    newChange = resentChange + changeBy;

    if (newChange > 0) {
      newChange = "+" + newChange;
    }
    if (newChange == 0) {
      newChange = "";
    }

    cmdElement.html(newCmd);
    cmdChange.html(newChange);

    cmdChange.addClass('showChange');
    setTimeout(function () {
      cmdChange.removeClass('showChange');
    }, 5);

    gameState[pIndex][1][activeCmd - 1] = newCmd;
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
  function resetPoison(e) {
    e.html(0);
    poisonBtn.removeClass('poisonOn')
    updateLocalStorage();
  }

  function showConcede() {
    let concede = $(this).parent().parent().children('.concede');
    concede.css('pointer-events', 'auto').css('opacity', '1');
  }
  function hideConcede() {
    let concede = $(this).parent().parent()
    concede.css('pointer-events', 'none').css('opacity', '0');
  }
  function playerLoses() {
    let player = detectPlayer($(this));
    player.addClass('dead')

    mainState()

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
      $('.colorUnselect').on('touchstart', function () {
        $('.colorUnselect').remove();
        $('.responsive').removeClass('responsive');
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
    let cards = $('.playerCard:not(.dead)').children();
    let numFlipped = document.getElementsByClassName('flipped');
    let isFlipped = card.hasClass('flipped');
    let p = card.parent().attr('class').replace(/\D/g,'');
    if (isFlipped) {
      card.removeClass('flipped');
      commandMode = false;
      cards.removeClass('cmd cd' + p)
    } else {
      commandMode = true;
      if (numFlipped.length <= 0) {
        card.addClass('flipped');
        cards.addClass('cmd cd' + p)
        card.removeClass('cmd cd' + p)
      }
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

  function mainState() {
    let flippedCards = $('.flipped');
    flippedCards.removeClass('flipped');
    let cmdCards = $('.cmd');
    cmdCards.removeClass('cmd')
    for (var i = 1; i <= 6; i++) {
      cmdCards.removeClass('cd' + i);
    }
  }

  function updateLocalStorage() {
    localStorage.setItem('gameState',  JSON.stringify(gameState));
  }
});
