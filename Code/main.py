
from flask import Flask
from flask import render_template
from flask import request
from flask import url_for
import os
import json
import time
import random

app = Flask("flask-music")

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


if __name__ == "__main__":
	app.run(debug=True, port=5000)
