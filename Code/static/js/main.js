// Referenz zum Random Button speichern.
let randomTweetButton = $("#randomTweetButton");
let random_insult = $("#random_insult");
let date = $("#date");
let target = $("#target");
let tweet_nr = $("#tweet-nr");
//Balkendiagramm Variablen, welche im HTML Code eingesetzt werden
let updateChartForm = $("#updateChartForm")
let keywordCountSelect = $("#keywordCountSelect")
let ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'max number of Insult',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    fixedStepSize: 1
                }
            }]
        }
    }
})

//Targetdiagramm Variablen, welche im HTML Code eingesetzt werden
let updateTargetChartForm = $("#updateTargetChartForm")
let targetCountSelect = $("#targetCountSelect")
let myTargetChart = new Chart("myTargetChart", {
    type: "doughnut",
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        data: [12, 19, 3, 5, 2, 3]
      }]
    },
    options: {
      title: {
        display: true,
        text: ""
      }
    }
  });


//Target Select Variablen
let targetSelect = $("#targetSelect")

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


function getRandomColors(numberOfColors) {
    colors = []
    for (i = 0; i < numberOfColors; i++) {
        let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        colors.push(color)
      }
    return colors;
}


//Balkendiagramm
//updateChartForm setzt die Variable count, welche in der JS-Funkiotn keywordsRequest(count) und der Pythonfunktion get_bd_insult_words(count) wiederverwendet wird
//durch event.preventDefault, wird das standardmässige Verhalten des Submitbuttons unterbunden
//Variable count wird ein Wert mitgegeben
//JS-Funktion keywordsRequest(count) wird aufgerufen
updateChartForm.submit(function (event) {
    event.preventDefault()
    let count = keywordCountSelect.val()
    //console.log(count)
    keywordsRequest(count)
})

//Funktion füllt flexibel das Balkendiagramm mit entsprechenden Daten ab
//angepasst werden die Variablen labels und data, welche Daten auf keywordsRequest(count) erhalten
//mittels myChart.update() wird dies initialisiert
function updateChart(labels, data) {
    const colors = getRandomColors(data.length)
    myChart.data.labels = labels
    myChart.data.datasets = [{
        label: 'max number of single Insults',
        data: data,
        backgroundColor: colors
    }]
    myChart.update()
}

//NProgress ist lediglich auf Aesthetikgründen, da dies einen Ladebalken zeigt, sobald die Funktion keywordsRequest(count) ausgeführt wird
//mittels der funktion wird durch die Variable result den Variablen labels und data die keys (Name des Insults) und die values (Häufigkeit des Insults) mitgegeben
//durch aufrufen der Funktion updateChart und mitgeben der Variablen labels und data, wird das Chart angepasst
function keywordsRequest(count) {
    NProgress.start();
    $.get(`/keywords?count=${count}`, function (result) {
        let labels = Object.keys(result)
        let data = Object.values(result)
        //console.log(labels)
        //console.log(data)
        updateChart(labels, data)
        NProgress.done();
    })
}

//wurde die Funktion keywordsRequest(count) noch nicht aufgerufen, wird ein Standardwert von 5 mitgegeben, so werden default immer 5 Insults in der Grafik angezeigt
keywordsRequest(5)
//Balkendiagramm Ende



//Targetdiagramm
//updateChartForm setzt die Variable count, welche in der JS-Funkiotn targetsRequest(count) und der Pythonfunktion get_targets(count) wiederverwendet wird
//durch event.preventDefault, wird das standardmässige Verhalten des Submitbuttons unterbunden
//Variable count wird ein Wert mitgegeben
//JS-Funktion targetssRequest(count) wird aufgerufen
updateTargetChartForm.submit(function (event) {
    event.preventDefault()
    let count = targetCountSelect.val()
    console.log(count)
    targetsRequest(count)
})

//Funktion füllt flexibel das Kuchendiagramm mit entsprechenden Daten ab
//angepasst werden die Variablen labels und data, welche Daten auf targetsRequest(count) erhalten
//mittels myTargetChart.update() wird dies initialisiert
function updateTargetChart(labels, data) {
    const colors = getRandomColors(data.length)
    myTargetChart.data.labels = labels
    myTargetChart.data.datasets = [{
        data: data,
        backgroundColor: colors
    }]
    myTargetChart.update()
}

//NProgress ist lediglich auf Aesthetikgründen, da dies einen Ladebalken zeigt, sobald die Funktion targetsRequest(count) ausgeführt wird
//mittels der Funktion wird durch die Variable result den Variablen labels und data die keys (Name des Targets) und die values (Häufigkeit des Targets) mitgegeben
//durch aufrufen der Funktion updateTargetChart und mitgeben der Variablen labels und data, wird das Chart angepasst
function targetsRequest(count) {
    NProgress.start();
    $.get(`/targets?count=${count}`, function (result) {
        let labels = Object.keys(result)
        let data = Object.values(result)
        //console.log(labels)
        //console.log(data)
        updateTargetChart(labels, data)
        NProgress.done();
    })
}


function targetsRequestNoCount() {
    NProgress.start();
    $.get(`/targets`, function (result) {
        let labels = Object.keys(result)
        let data = Object.values(result)
        //console.log(labels)
        //console.log(data)
        NProgress.done();
    })
}


//wurde die Funktion targetsRequest(count) noch nicht aufgerufen, wird ein Standardwert von 5 mitgegeben, so werden default immer 5 Targets in der Grafik angezeigt
targetsRequest(5)
//Targetdiagramm Ende



//Wordcloud
//Funktion Liste von Targets in dict umwandeln
//Funktion updateWordcloud


$(document).ready(function()
{

    // $.getJSON("/static/json/trump_insult_tweets_2014_to_2021.json", function(data){
    // }).fail(function(){
    //     console.log("An error has occurred.");
    // });
    

	
	
});


//get Targets
$.get("/targets", function (data) {
    console.log(data)
})

//get Wordcloud
$.get("/Wordcloud", function (data) {
    console.log(data)
// Link: https://github.com/lucaong/jQCloud
    $("#wordCloud").jQWCloud({

		words: data.data,
		//cloud_color: 'yellow',		
		minFont: 2,
		maxFont: 50,
		//fontOffset: 5,
		//cloud_font_family: 'Owned',
		verticalEnabled: true,
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
	});
})

