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

$(document).ready(function()
{

    // $.getJSON("/static/json/trump_insult_tweets_2014_to_2021.json", function(data){
    // }).fail(function(){
    //     console.log("An error has occurred.");
    // });
    

	$("#wordCloud").jQWCloud({

		words: [
				{word: 'highly overrated', weight: 40},
				{word: 'DOPE', weight: 39},
				{word: 'total hypocrite', weight: 11, color: 'green'},
				{word: 'didnt love it', weight: 27},
				{word: 'a disaster', weight: 36},
				{word: 'dopey clown', weight: 39},
				{word: 'not our friend', weight: 12, color: 'green'},
				{word: 'love watching him fail', weight: 27},
				{word: 'pathetic', weight: 36},
				{word: 'sleepy eyes', weight: 22},
				{word: 'clown', weight: 40},
				{word: 'total loser', weight: 39},
				{word: 'incapable of doing anything', weight: 11, color: 'green'},
				{word: 'I am no fan', weight: 27},
				{word: 'dumb guy with no clue', weight: 36},
				{word: 'Crazy Nancy', weight: 39},
				{word: 'bogus Impeachment Scam', weight: 12, color: 'green'},
				{word: 'Fake News', weight: 27},
				{word: 'Sleepy Joe', weight: 80},
				{word: 'rigged', weight: 22}
				       		        
		],
		//cloud_color: 'yellow',		
		minFont: 10,
		maxFont: 50,
		//fontOffset: 5,
		//cloud_font_family: 'Owned',
		//verticalEnabled: false,
		padding_left: 1,
		//showSpaceDIV: true,
		//spaceDIVColor: 'white',
		word_common_classes: 'WordClass',		
		word_mouseEnter :function(){
			$(this).css("text-decoration","underline");
		},
		word_mouseOut :function(){
			$(this).css("text-decoration","none");	
		},
		word_click: function(){ 			
			alert("You have selected:" +$(this).text());
		},		              
		beforeCloudRender: function(){
		       date1=new Date();
	 	},
	 	afterCloudRender: function(){
				var date2=new Date();
				console.log("Cloud Completed in "+(date2.getTime()-date1.getTime()) +" milliseconds");
			}
	});
	
});
