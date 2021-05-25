
from flask import Flask
from flask import render_template
from flask import request
from flask import url_for
import os
import json
import time
import random

#Import von Elementen für Balkendiagramm
from collections import Counter, OrderedDict

app = Flask("flask-trump")
#Bugfix für die fehldende Sortierung in main.py durch Flask --> Quelle: https://github.com/pallets/flask/issues/974
app.config["JSON_SORT_KEYS"] = False 

def load_tweets():
	tweets_path = os.path.join(
		app.static_folder, 'json', 'trump_insult_tweets_2014_to_2021.json')
	with open(tweets_path, encoding='utf-8') as json_file:
		json_data = json.load(json_file)
	return json_data


def get_random_tweet():
	tweets = load_tweets()
	random_index = random.randint(0, len(tweets) - 1)
	return tweets[random_index]


@app.route('/')
def index():
	return render_template('index.html', tweet = get_random_tweet())


@app.route('/random_tweet')
def random_tweet():
	return get_random_tweet()

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
	#print(sorted_insult_list)
	return sorted_insult_list

#die Variable count wird hier mit einem int-Wert aus dem Formular befüllt
#zurückgegeben wird das Resultat der Funktion get_bd_insult_words(count)
@app.route('/keywords')
def keywords():
	count = int(request.args.get("count"))
	return get_bd_insult_words(count)



#Funktion für Target Diagramm
#	pro Tweet aus der Liste full_tweets wird das Tweet-Element mit der Kennung "insult" zur neuen Liste insult_list hinzugefügt
#	mittels Counter werden gleiche Elemente in der Liste insult_list gezählt, erhalten dann den Wert, wie oft diese vorkommen und werden einmalig als einmaliger Eintrag in der Liste zusammengefasst
#	mittels OrderedDict wird die insult_list nach den meist genannten Insults in die Liste sorted_insult_list übergeben, die Variable count definiert, wie viele Werte in diese Liste geschrieben werden sollen
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

def get_insults():
	insult_list = []
	full_tweets = load_tweets()
	for tweet in full_tweets:
		insult_list.append(tweet["insult"])
	insult_list = Counter(insult_list)
	sorted_insult_list = OrderedDict(insult_list)
	return sorted_insult_list

#	die Variable count wird hier mit einem int-Wert aus dem Formular befüllt
#	zurückgegeben wird das Resultat der Funktion get_bd_insult_words(count)
@app.route('/targets')
def targets():
	reques_count = request.args.get("count")
	if reques_count:
		count = int(reques_count)
		return get_targets(count)
	else:
		return get_targets()


@app.route('/Wordcloud')
def Wordcloud():
	insults = get_insults()
	
	wordcloud = {
		"data": []	
	}

	for word, count in insults.items():
		wordcloud["data"].append({
			"word": word,
			"weight": count
		})
	return wordcloud


if __name__ == "__main__":
	app.run(debug=True, port=5000)
