var players = {};
players["Matias"] = ["Thrasios Silas", "Yidris"];
players["Jaakko"] = ["Zur", "Breya", "Tymna Kraum"];
players["Tommi"] = ["Tymna Thrasios"];
players["Valtteri"] = ["Gitrog"];
players["Rynde"] = ["Mad-farm"];

function changeDeckList(i) {
  var playerList = document.getElementById("player"+i+"pilot");
  var deckList = document.getElementById("player"+i+"decklist");
  var selectedPlayer = playerList.options[playerList.selectedIndex].value;
  while (deckList.options.length) {
        deckList.remove(0);
  }
  var decks = players[selectedPlayer];
  if (decks) {
        var i;
        for (i = 0; i < decks.length; i++) {
            var deck = new Option(decks[i], i);
            deckList.options.add(deck);
        }
    }
}