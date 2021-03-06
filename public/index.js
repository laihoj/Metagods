
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
  var players = document.getElementById("players");
  var player1 = players.getElementsByClassName("player-badge")[0];
  var newplayer = player1.cloneNode(true);
  players.appendChild(newplayer);
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


function removeClassNameFromEachElement(className, elementList) {
  for(var i = 0; i < elementList.length; i++) {
    elementList[i].classList.remove(className);
  }
}

function isNumeric(obj) {
    var realStringObj = obj && obj.toString();
    return !jQuery.isArray(obj) && (realStringObj - parseFloat(realStringObj) + 1) >= 0;
}

/*****************************************
Source: w3schools.com
*****************************************/

function sortTable(id, n, numeric) {
  var table, headers, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(id);
  headers = table.getElementsByTagName("TH");
  removeClassNameFromEachElement("sorted-ascending", headers);
  removeClassNameFromEachElement("sorted-descending", headers);
  header = table.getElementsByTagName("TH")[n];
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if(numeric) {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        } else if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if(numeric) {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        } else if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
        header.classList.add("sorted-descending");
      } else {
        header.classList.add("sorted-descending");
      }
    }
  }
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