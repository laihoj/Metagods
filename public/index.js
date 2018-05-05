// var playerNames = ["default", "Jaakko", "Rynde", "Matias", "Valtteri", "Tommi", "Markus", "Jonne", "Joel", "Tino"];

var playersAndDecks = {};
playersAndDecks["Matias"] = ["Thrasios Silas", "Yidris"];
playersAndDecks["jaakko"] = ["Zur", "Breya", "Tymna Kraum"];
playersAndDecks["Tommi"] = ["Tymna Thrasios"];
playersAndDecks["Valtteri"] = ["Gitrog"];
playersAndDecks["Rynde"] = ["Mad farm"];

function changeDeckList(i) {
  var playerList = document.getElementById("player"+i+"pilot");
  var deckList = document.getElementById("player"+i+"decklist");
  var selectedPlayer = playerList.options[playerList.selectedIndex].value;
  while (deckList.options.length) {
        deckList.remove(0);
  }
  var decks = playersAndDecks[selectedPlayer];
  if (decks) {
        var i;
        for (i = 0; i < decks.length; i++) {
            var deck = new Option(decks[i], i);
            deckList.options.add(deck);
        }
    }
}