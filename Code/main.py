#Elemente, welche zur Verwendung des Python Scripts importiert werden
from flask import Flask
from flask import render_template
from flask import request
from flask import url_for
import os
import json
import time
#Import des Elements, um einen random Wert zu generieren
import random
#Import von Elementen für Balken-/Kuchendiagramm
from collections import Counter, OrderedDict

############################################################################################################################################################################################################
app = Flask("flask-trump")
#Bugfix für die fehldende Sortierung in main.py durch Flask --> Quelle: https://github.com/pallets/flask/issues/974
app.config["JSON_SORT_KEYS"] = False 

############################################################################################################################################################################################################
#Funktion load_tweets: Datensätze aus json-Datei trump_insult_tweets_2014_to_2021.json werden in die Variable json_data geschrieben
def load_tweets():
	tweets_path = os.path.join(
		app.static_folder, 'json', 'trump_insult_tweets_2014_to_2021.json')
	with open(tweets_path, encoding='utf-8') as json_file:
		json_data = json.load(json_file)
	return json_data

############################################################################################################################################################################################################
"""Random Tweets"""
############################################################################################################################################################################################################
#Funktion get_random_tweet: Random Tweet wird generiert
#in die Variable tweets wird das Ergebnis aus der ausgeführten Funktion load_tweets abgelegt (alle Tweets)
#in die Variable random_index wird eine zufällig generierte Zahl zwischen 0 und der maximalen Anzahl Tweets geschrieben (-1 da bei Index 0 gestartet wird)
def get_random_tweet():
	tweets = load_tweets()
	random_index = random.randint(0, len(tweets) - 1)
	return tweets[random_index]

#Ausgabe index.html
@app.route('/')
def index():
	return render_template('index.html', tweet = get_random_tweet())

#Ausgabe des Werts aus Funktion get_random_tweet
@app.route('/random_tweet')
def random_tweet():
	return get_random_tweet()

############################################################################################################################################################################################################
"""Balkendiagramm"""
############################################################################################################################################################################################################
#Funktion für Balkendiagramm
#pro Tweet aus der Liste full_tweets wird das Tweet-Element mit der Kennung "insult" zur neuen Liste insult_list hinzugefügt
#mittels Counter werden gleiche Elemente in der Liste insult_list gezählt, erhalten dann den Wert, wie oft diese vorkommen und werden einmalig als einmaliger Eintrag in der Liste zusammengefasst
#mittels OrderedDict wird die insult_list nach den meist genannten Insults in die Liste sorted_insult_list übergeben, die Variable count definiert, wie viele Werte in diese Liste geschrieben werden sollen
def get_bd_insult_words(count):
	insult_list = []
	full_tweets = load_tweets()
	for tweet in full_tweets:
		insult_list.append(tweet["insult"])
	insult_list = Counter(insult_list)
	sorted_insult_list = OrderedDict(insult_list.most_common(count))
	return sorted_insult_list

#Variable count wird hier mit einem int-Wert aus dem Formular befüllt
#zurückgegeben wird das Resultat der Funktion get_bd_insult_words(count)
@app.route('/keywords')
def keywords():
	count = int(request.args.get("count"))
	return get_bd_insult_words(count)

############################################################################################################################################################################################################
"""Kuchendiagramm"""
############################################################################################################################################################################################################
#Funktion für Kuchendiagramm
#pro Tweet aus der Liste full_tweets wird das Tweet-Element mit der Kennung "target" zur neuen Liste target_list hinzugefügt
#mittels Counter werden gleiche Elemente in der Liste target_list gezählt, erhalten dann den Wert, wie oft diese vorkommen und werden einmalig als einmaliger Eintrag in der Liste zusammengefasst
#mittels OrderedDict wird die target_list nach den meist genannten Targets in die Liste sorted_target_list übergeben, die Variable count definiert, wie viele Werte in diese Liste geschrieben werden sollen
def get_targets(count=None):
	target_list = []
	full_tweets = load_tweets()
	for tweet in full_tweets:
		target_list.append(tweet["target"])
	target_list = Counter(target_list)
	if count: 
		sorted_target_list = OrderedDict(target_list.most_common(count))
	else:
		sorted_target_list = OrderedDict(target_list)
	#print(sorted_target_list)
	return sorted_target_list

#Variable count wird hier mit einem int-Wert aus dem Formular befüllt
#zurückgegeben wird das Resultat der Funktion get_targets(count)
@app.route('/targets')
def targets():
	reques_count = request.args.get("count")
	if reques_count:
		count = int(reques_count)
		return get_targets(count)
	else:
		return get_targets()

############################################################################################################################################################################################################
"""Word Coud"""
############################################################################################################################################################################################################
#Funktion für Word Cloud: erstellt eine sortierte Liste der Insults sorted_insult_list
#für jeden Tweet aus allen Tweets soll das element des Tweets mit der Kennung insult in der neu generierten insult_list eingetragen werden
#mittels Counter werden gleiche Werte gezählz
#mittels OrderedDict werden die Werte aus der insul_list der Häufigkeit nach in sorted_insult_list geschrieben
def get_insults(count):
	insult_list = []
	full_tweets = load_tweets()
	for tweet in full_tweets[:count + 1]:
		insult_list.append(tweet["insult"])
	insult_list = Counter(insult_list)
	sorted_insult_list = OrderedDict(insult_list)
	return sorted_insult_list

#durch .../int:count wird die der wert der Variable Count erhalten
#Funktion Wordcloud(count) geneiert die Daten im entsprechenden Format (dict), welche fürs Generieren der Wordcloud verwendet werden
#Variable insults wird mit 80 ersten Werten aus sorted_insult_list abgefüllt
#dict wordcloud wird mit Werten befüllt, diese setzen sich aus word und count aus dem zuvor befüllten dict insults zusammen
@app.route('/Wordcloud/<int:count>')
def Wordcloud(count):
	insults = get_insults(count)
	
	wordcloud = {
		"data": []	
	}

	for word, count in insults.items():
		wordcloud["data"].append({
			"word": word,
			"weight": count
		})
	return wordcloud

############################################################################################################################################################################################################
if __name__ == "__main__":
	app.run(debug=True, port=5000)
