// Referenz zum Random Button speichern.
let randomTweetButton = $("#randomTweetButton");
let random_insult = $("#random_insult");
let date = $("#date");
let target = $("#target");
let tweet_nr = $("#tweet-nr");

// Click Handler für Random Button registrieren.
// in "click" ist eine Funktion gespeichert.
// "function" -> wenn geklickt wird, führe folgende Funktion aus.
// "data" = Antwort vom Server, also ein Random Tweet aus dem JSON File
randomTweetButton.click(function (event) {
    $.get("/random_tweet", function (data) {
        random_insult.text(data.tweet)
        date.text(data.date)
        target.text(data.target)
        tweet_nr.text(data.FIELD1)
        console.log(data)
    })
})