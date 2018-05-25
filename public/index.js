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

function fillInMeta() {
  for(var i = 1; i < 5; i++) {
    document.getElementById("player1pilot").value = "Rynde";

  }
}

function addPlayer() {
  var client = new HttpClient();
  client.get('http://localhost:3000/api/addplayer', function(response) {
    console.log(response);
    var parser = new DOMParser();
    var html = parser.parseFromString(response, "text/xml").
    parser.getElementById("nextPlayer").innerHTML = html;
    // response.forEach(function(deck) {
      // deckList.options.add(deck);
    // });
  });
}

function saveMatch() {
  setCookie("player1pilot", document.forms[0][3].value);
  setCookie("player1deck", document.forms[0][4].value);
  setCookie("player2pilot", document.forms[0][8].value);
  setCookie("player2deck", document.forms[0][9].value);
  setCookie("player3pilot", document.forms[0][13].value);
  setCookie("player3deck", document.forms[0][14].value);
  setCookie("player4pilot", document.forms[0][18].value);
  setCookie("player4deck", document.forms[0][19].value);
  // setCookie("form", document.forms[0].innerHTML);
  // document.forms['newMatchForm'].action = "/metas";
  // document.forms['newMatchForm'].target = "formResponse";
  // document.forms['newMatchForm'].method = "POST";
  // document.forms['newMatchForm'].submit();
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