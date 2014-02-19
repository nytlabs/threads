import json
import datetime
import collections

output_file = open('thread_parts.json', 'w')
data = json.loads(open('threads_entities_clicks_positions.json').read())
threads = []

class Thread:
     def __init__(self):
         self.num_articles = None
         self.articles = []
         self.begin_date = None
         self.end_date = None
         self.entities = []	
         self.keywords = []


for thread in data:
	th = Thread()
	for article in thread["articles"]:
		a = {}
		a["headline"] = article["headline"]
		a["print_position"] = article["print_position"]
		a["pub_date"] = article["published"]["$date"]
		a["clicks"] = article["clicks"]
		a["url"] = article["_id"]
		th.articles.append(a)
	th.articles.sort(key=lambda r: r["pub_date"])
	th.num_articles = len(th.articles)
	th.begin_date = str(datetime.date.fromtimestamp(th.articles[0]["pub_date"] / 1e3))
	th.end_date = str(datetime.date.fromtimestamp(th.articles[-1]["pub_date"] / 1e3))

	entities = collections.defaultdict(list)
	keywords = collections.defaultdict(list)
	entity_types = {}
	keyword_types = {}

	for article in thread["articles"]:
		for entity in article["entities"]:
			entities[entity["entity"]].append(article["published"]["$date"])
			entity_types[entity["entity"]] = entity["type"]
		for keyword in article["keywords"]:
			keywords[keyword["content"]].append(article["published"]["$date"])
			keyword_types[keyword["content"]] = keyword["type"]

	for entity, dates in entities.items():
		th.entities.append({
			"content": entity,
			# "dates": list(set(dates)),
			"dates": dates,
			"type": entity_types[entity]
		})

	for keyword, dates in keywords.items():
		th.keywords.append({
			"content": keyword,
			# "dates": list(set(dates)),
			"dates": dates,
			"type": keyword_types[keyword]
		})

	print (th.__dict__)

	threads.append({"thread": th.__dict__})


output_file.write(json.dumps(threads))
