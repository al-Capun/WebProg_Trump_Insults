
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


@app.route('/')
def index():
	tweets = load_tweets()
	random_index = random.randint(0, len(tweets) - 1)
	return render_template('index.html', tweet = tweets[random_index])


@app.route('/tweets', methods=['POST'])
def tweets():
	tweets = load_tweets()
	return tweets[0]


if __name__ == "__main__":
	app.run(debug=True, port=5000)
