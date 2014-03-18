import json
import datetime
import collections
import re

output_file = open('timeline.json', 'w')
data = json.loads(open('timeline_source.json').read())
threads = []

class Thread:
     def __init__(self):
         self.num_articles = None
         self.begin_date = None
         self.end_date = None
         self.entries = []	
         self.keywords = []

class TimelineEntry:
	def __init__(self):
		self.date = None
		self.articles = []

class Article:
	def __init__(self):
		self.headline = None
		self.summary = None
		self.url = None
		self.body = None
		self.print_position = None
		self.major = False
		self.section = None
		self.authors = []

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
	th.begin_date = datetime.date.fromtimestamp(articles[0]["published"]["$date"] / 1e3)
	th.end_date = datetime.date.fromtimestamp(articles[-1]["published"]["$date"] / 1e3)
	th.keywords = thread["keywords"]

	#generate dates in date range
	for result in daterange(th.begin_date, th.end_date, datetime.timedelta(days=1)):
		e = TimelineEntry()
		e.date = result
		th.entries.append(e.__dict__)

	for entry in th.entries:
		for article in articles:
			article_date = datetime.date.fromtimestamp(article["published"]["$date"] / 1e3)
			if article_date == entry["date"]:
				a = Article()
				a.headline = article["headline"]
				a.summary = article["summary"]
				a.url = article["_id"]
				a.body = article["body"]
				a.print_position = article["print_position"]
				if a.print_position != '':
					pos_num = int(re.sub("[^0-9]", "", a.print_position))
				if pos_num < 4:
					a.major = True
				a.section = article["section"]
				a.authors = article["authors"]
				entry["articles"].append(a.__dict__)

	threads.append(th.__dict__)



