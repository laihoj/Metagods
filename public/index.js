
/*
https://stackoverflow.com/questions/21172889/express-send-a-page-and-custom-data-to-the-browser-in-a-single-request
*/



function customValidation() {
  // return boolean
}

function resetTempMatchData() {
  deletePlayerTempData(1);
  deletePlayerTempData(2);
  deletePlayerTempData(3);
  deletePlayerTempData(4);
  refresh();
}

function deletePlayerTempData(i) {
  deleteCookie("player"+i+"hand");
  deleteCookie("player"+i+"start");
  deleteCookie("player"+i+"win");
}

function updateBottomBar(wins, winrate, games) {
  setWinCount(wins);
  setWinRate(winrate);
  setGameCount(games);
}

function setWinCount(wins) {
  document.getElementById("wincount").textContent = wins;
}

function setWinRate(winrate) {
  document.getElementById("winrate").textContent = winrate;
}

function setGameCount(games) {
  document.getElementById("gamecount").textContent = games;
}

function requestResults(player, callback) {
  var client = new HttpClient();
  client.get(window.location.origin + '/api/results/' + player + '/recent', function(response) {
    callback(JSON.parse(response));
  });
}

function getResults(player) {
  requestResults(player, function(results) {
    var wins = 0;
    var games = 0;
    results.forEach(function(result) {
      games++;
      if(result.winner) {
        wins++;
      }
    });
    var winrate = wins / games * 100;
    updateBottomBar(wins, winrate, games);
  });
}

function fillFormWithTemp(n) {
  for(var i = 1; i <= n; i++) {
    fillPlayerRowWithTemp(i);
  }
}

function fillPlayerRowWithTemp(i) {
  document.getElementById("player"+i+"hand").value = getCookie("player"+i+"hand");
  if(getCookie("player"+i+"start") === "true") {
    check("player"+i+"start","starter");
  }
  if(getCookie("player"+i+"win") === "true") {
    check("player"+i+"win","winner");
  }
}

function fillFormWithCookie(n) {
  for(var i = 1; i <= n; i++) {
    fillPlayerRowWithCookie(i);
  }
  // fillFormWithTemp();
}

function fillPlayerRowWithCookie(i) {
  document.getElementById("player"+i+"pilot").value = getCookie("player"+i+"pilot");
  document.getElementById("player"+i+"deck").value = getCookie("player"+i+"deck");
  document.getElementById("player"+i+"firstletter").innerHTML = getCookie("player"+i+"pilot").charAt(0).toUpperCase();
}

function toggle(id) {
  var element = document.getElementById(id);
  if(element.classList.contains("no-display")) {
    element.classList.remove("no-display");
  } else {
    element.classList.add("no-display");
  }
}

function check(id, name) {
  var checkboxes = document.getElementsByClassName(name);
  for(var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].classList.remove("selected");
  }
  if(document.getElementById(id).checked) {
    document.getElementById(id).checked = false;
    document.getElementById(id+"icon").classList.remove("selected");
  } else {
    document.getElementById(id).checked = true;
    document.getElementById(id+"icon").classList.add("selected");
  }
}

function removePlayer() {
  alert("remove player pressed. NOT FUNCTIONAL");
}


/*
USE AS REFERENCE: https://stackoverflow.com/questions/4427094/how-can-i-duplicate-a-div-onclick-with-javascript
*/
function addPlayer() {
  alert("add player pressed. NOT FUNCTIONAL");
  // var form = document.getElementById("newMatchForm");
  // var div = document.createElement("DIV")
  // var text = document.createTextNode("hello");
  // div.appendChild(text);
  // form.appendChild(div);
  // document.body.appendChild(form);

  // var client = new HttpClient();
  // client.get('http://localhost:3000/api/addplayer', function(response) {
  //   console.log(response);
  //   var parser = new DOMParser();
  //   var html = parser.parseFromString(response, "text/xml").
  //   parser.getElementById("nextPlayer").innerHTML = html;
  //   // response.forEach(function(deck) {
  //     // deckList.options.add(deck);
  //   // });
  // });
}

function saveMatch(n) {
  for(var i = 1; i <= n; i++) {
    savePlayerRow(i);
  }
}

function savePlayerRow(i) {
  setCookie("player"+i+"pilot", document.getElementById("player"+i+"pilot").value);
  setCookie("player"+i+"deck", document.getElementById("player"+i+"deck").value);
  setCookie("player"+i+"hand", document.getElementById("player"+i+"hand").value);
  setCookie("player"+i+"start", document.getElementById("player"+i+"start").checked);
  setCookie("player"+i+"win", document.getElementById("player"+i+"win").checked);
}

function refresh() {
  location.reload();
}

function refresh(message) {
  location.reload();
  alert(message);
}

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}



function setCookie(name, value) {
  document.cookie = name + "=" + value;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if(parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

function deleteCookie(cookie) {
  document.cookie = name + "=; max-age=0;";
  alert("cookie deleted?")
}

/*****************************************
NOT IN USE
*****************************************/

function populateOptions(i) {
  var playername = document.getElementById("player" + i + "pilot").value;
  console.log(playername);
  getPlayer(playername, i);
}

function getPlayer(player, i) {
  var deckList = document.getElementById("player"+i+"deck");
  while (deckList.options.length) {
    deckList.remove(0);
  }
  var client = new HttpClient();
  client.get('http://localhost:3000/api/players/' + player, function(response) {
    console.log(response);
    response.forEach(function(deck) {
      deckList.options.add(deck);
    });
  });
}

function parseObjectFromCookie(cookie) {
  var decodedCookie = decodeURIComponent(cookie);
  return JSON.parse(decodedCookie);
}



function changeDeckList(i) {
  var playerList = document.getElementById("player"+i+"pilot");
  var deckList = document.getElementById("player"+i+"deck");
  var selectedPlayer = playerList.options[playerList.selectedIndex].value;
  while (deckList.options.length) {
        deckList.remove(0);
  }
  var decks = parseObjectFromCookie(getCookie[selectedPlayer.toString()]);
  if (decks) {
        var i;
        for (i = 0; i < decks.length; i++) {
            var deck = new Option(decks[i], i);
            deckList.options.add(deck);
        }
    }
}

function submitMatch() {
  // var form = document.getElementById("newMatchForm");
  document.getElementById("newMatchForm").submit();
  resetTempMatchData();
  alert("fancy submit");
}