import json
import datetime
import collections
import re

output_file = open('timeline.json', 'w')
data = json.loads(open('timeline_source.json').read())
threads = []

class Thread:
     def __init__(self):
         self.num_articles = 0
         self.major_articles = 0
         self.begin_date = None
         self.end_date = None
         self.entries = []	
         self.keywords = []

class TimelineEntry:
	def __init__(self):
		self.date = None
		self.articles = []
		self.photos = []
		self.nyt_per = 0
		self.nyt_geo = 0
		self.nyt_topic = 0

class Article:
	def __init__(self):
		self.headline = None
		self.summary = None
		self.wordcount = 0
		self.clicks = 0
		self.url = None
		self.body = None
		self.print_position = None
		self.major = False
		self.section = None
		self.authors = []
		self.num_quotes = 0

class Event:
	def __init__(self):
		self.desc = None
		self.epoch_date = None
		self.date_string = None

class Photo:
	def __init__(self):
		self.url = None
		self.article_url = None
		self.major = False

def daterange(start, end, delta):
    curr = start
    while curr < end:
        yield curr
        curr += delta

for thread in data:

	articles = thread["articles"]
	articles.sort(key=lambda r: r["published"]["$date"]) #sort by date

	th = Thread()
	th.num_articles = len(articles)
	begin_date = datetime.date.fromtimestamp(articles[0]["published"]["$date"] / 1e3)
	end_date = datetime.date.fromtimestamp(articles[-1]["published"]["$date"] / 1e3)
	th.begin_date = str(begin_date)
	th.end_date = str(end_date)
	th.keywords = thread["keywords"]

	#generate dates in date range
	for result in daterange(begin_date, end_date, datetime.timedelta(days=1)):
		e = TimelineEntry()
		e.date = str(result)
		th.entries.append(e.__dict__)

	for entry in th.entries:
		for article in articles:
			article_date = str(datetime.date.fromtimestamp(article["published"]["$date"] / 1e3))
			if article_date == entry["date"]:
				a = Article()
				a.headline = article["headline"]
				a.summary = article["summary"]
				a.wordcount = article["word_count"]
				a.clicks = article["clicks"]
				a.url = article["_id"]
				a.body = article["body"]
				a.print_position = article["print_position"]
				if a.print_position != '':
					pos_num = int(re.sub("[^0-9]", "", a.print_position))
				if pos_num < 4:
					a.major = True
					th.major_articles += 1
				a.section = article["section"]
				a.authors = article["authors"]
				a.num_quotes = article["num_quotes"]
				entry["articles"].append(a.__dict__)

				if article["photo_url"] is not None:
					p = Photo()
					p.url = article["photo_url"]
					p.article_url = a.url
					p.major = a.major
					entry["photos"].append(p.__dict__)

				for entity in article["entities"]:
					if entity["type"] == "topic":
						type = "nyt_topic"
					else:
						type = entity["type"]
					if type in entry:
						entry[type] += 1

	threads.append(th.__dict__)

print threads[0]["entries"][29]
output_file.write(json.dumps(threads))



