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