/*
alert(data[0].date);
alert(data[0].target);
alert(data[1].date);
alert(data[1].target);
*/

function getRandomTweet() {
    let count = data.length
    let randomTweetNr = Math.floor(Math.random() * count)
    let randomTweet = data[randomTweetNr]
    return randomTweet
}

let randomTweet = getRandomTweet()
$("#random_insult").text(randomTweet.tweet)