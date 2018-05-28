// var playerNames = ["default", "Jaakko", "Rynde", "Matias", "Valtteri", "Tommi", "Markus", "Jonne", "Joel", "Tino"];

// var playersAndDecks = {};
// playersAndDecks["Matias"] = ["Thrasios Silas", "Yidris"];
// playersAndDecks["jaakko"] = ["Zur", "Breya", "Tymna Kraum"];
// playersAndDecks["Tommi"] = ["Tymna Thrasios"];
// playersAndDecks["Valtteri"] = ["Gitrog"];
// playersAndDecks["Rynde"] = ["Mad farm"];

/*
https://stackoverflow.com/questions/21172889/express-send-a-page-and-custom-data-to-the-browser-in-a-single-request
*/

function fillFormWithCookie() {
  // alert(getCookie("player1pilot").charAt(0).toUpperCase());
  document.getElementById("player1pilot").value = getCookie("player1pilot");
  document.getElementById("player1deck").value = getCookie("player1deck");
  document.getElementById("player1firstletter").innerHTML = getCookie("player1pilot").charAt(0).toUpperCase();
  document.getElementById("player2pilot").value = getCookie("player2pilot");
  document.getElementById("player2deck").value = getCookie("player2deck");
  document.getElementById("player2firstletter").innerHTML = getCookie("player2pilot").charAt(0).toUpperCase();
  document.getElementById("player3pilot").value = getCookie("player3pilot");
  document.getElementById("player3deck").value = getCookie("player3deck");
  document.getElementById("player3firstletter").innerHTML = getCookie("player3pilot").charAt(0).toUpperCase();
  document.getElementById("player4pilot").value = getCookie("player4pilot");
  document.getElementById("player4deck").value = getCookie("player4deck");
  document.getElementById("player4firstletter").innerHTML = getCookie("player4pilot").charAt(0).toUpperCase();
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

function fillInMeta() {
  for(var i = 1; i < 5; i++) {
    document.getElementById("player1pilot").value = "Rynde";

  }
}

function removePlayer() {
  alert("remove player pressed");
}

function addPlayer() {
  alert("add player pressed");
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

function saveMatch() {
  setCookie("player1pilot", document.getElementById("player1pilot").value);
  setCookie("player1deck", document.getElementById("player1deck").value);
  setCookie("player2pilot", document.getElementById("player2pilot").value);
  setCookie("player2deck", document.getElementById("player2deck").value);
  setCookie("player3pilot", document.getElementById("player3pilot").value);
  setCookie("player3deck", document.getElementById("player3deck").value);
  setCookie("player4pilot", document.getElementById("player4pilot").value);
  setCookie("player4deck", document.getElementById("player4deck").value);
  alert("Current match set as default");
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

function setCookie(name, value) {
  // alert("Cookie set: " + name + "=" + value);
  // document.cookie = name + "=" + value + "; expires=31 Dec 2018 12:00:00 UTC";
  document.cookie = name + "=" + value;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if(parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

function parseObjectFromCookie(cookie) {
  var decodedCookie = decodeURIComponent(cookie);
  return JSON.parse(decodedCookie);
}

function deleteCookie(cookie) {
  document.cookie = name + "=; max-age=0;";
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