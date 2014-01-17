import json
import collections
import datetime
import pylab

def articles2events(articles):
    events = [int(a['published']['$date']/1000) for a in articles]
    events.sort()
    return events

def avgInterval(events):
    if len(events) == 1:
        return None
    if len(events) == 0:
        raise ValueError("no events specified")
    intervals = [events[i+1] - events[i] for i in range(len(events)-1)]
    return sum(intervals)/len(intervals)

def getWindow(events, start, stop):
    out = [e for e in events if e > start and e < stop]
    return out

def slideWindow(events, windowSize, slideInterval):
    t0 = min(events)
    T = max(events)
    t = t0
    X = []
    while t + windowSize < T:
        w = getWindow(events, t, t+windowSize)
        if len(w) == 0:
            x = 0           
        else:
            x = avgInterval(w)
        if x:
            l = 1./(x/86400.0)
        else:
            l = 0
        X.append((datetime.datetime.fromtimestamp(t),l))
        t += windowSize
    return X

articles = [json.loads(line) for line in open('articles.json')]

lookup = collections.defaultdict(list)
for a in articles:
    for k in a['keywords']:
        lookup[k['content'].lower()].append(a)

article2keywords = {}
for a in articles:
    article2keywords[a['_id']] = [k['content'].lower() for k in a['keywords']]

id2article = {}
for a in articles:
    id2article[a["_id"]] = a

keywords = lookup.keys()
keywords.sort()

threads = []
threadKeywords = []

for keyword in keywords:
    events = articles2events(lookup[keyword])
    ts = slideWindow(events, 604800, 17280)

    numpoints = len([y for x,y in ts if y > 0])
    if numpoints < 9: # need 20 non-zero points
        #if keyword.startswith("uk"):
        #    print "skipping", keyword, "as less than 20 total (%s)"%numpoints
        continue

    x,y = zip(*ts)
    
    if max(y) < 2: # articles per day
        print "skipping", keyword, "as less than 2 per day"
        continue

    #if sum(y) < 31: # total articles in period
    #    print "skipping", keyword, "as less than 31 articles total (%s)"%sum(y)
    #    continue
    if len(lookup[keyword]) < 60:
        print "skipping", keyword, "as less than 60 articles total (%s)"%len(lookup[keyword])
        continue

    # normalise

    yn = pylab.array(y)
    yn -= min(yn)
    yn /= pylab.mean(yn)

    if (max(yn) - pylab.mean(yn)) < 2.2: # no outliers
        #print "skipping", keyword, "as no outliers"
        continue

    threads.append(lookup[keyword])
    threadKeywords.append(keyword)

threadIDs = [set([article["_id"] for article in thread]) for thread in threads]

# merge overlapping threads

toMerge = collections.defaultdict(list)
for i,ti in enumerate(threadIDs):
    for j,tj in enumerate(threadIDs):
        if i == j:
            continue
        if len(ti.intersection(tj)) > len(threadIDs[i])/3.0:
            toMerge[i].append(j)

mergedThreads = []
mergedKeywordIdxs = []
mergedKeywords = []
for i in toMerge:
    if i in mergedKeywordIdxs:
        continue
    for j in toMerge[i]:
        mergedThreads.append(threadIDs[i].union(threadIDs[j]))
        mergedKeywordIdxs.append(j)
    mergedKeywords.append(threadKeywords[i])
    mergedKeywordIdxs.append(i)


# remove merged threads
mergedKeywordIdxs.sort()
mergedKeywordIdxs.reverse()
for idx in mergedKeywordIdxs:
    threadKeywords.pop(idx)
    threadIDs.pop(idx)

# join merged and non-merged
threadIDs += mergedThreads
threadKeywords += mergedKeywords

print threadKeywords

# form final JSON

outThreads = []
outKeywords = []
for thread in threadIDs:

    keywords = list()
    for j in thread:
        thisKeywords = article2keywords[j]
        for k in thisKeywords:
            keywords.append(k)

    keywordsCounter = collections.Counter(keywords)

    mostCommon = dict(keywordsCounter.most_common(3))
    if set(mostCommon.keys()) in outKeywords:
        print "skipping", mostCommon
        continue
    outKeywords.append(set(mostCommon.keys()))
    t = {
        "articles": [
            id2article[j] 
            for j in thread
            if set(mostCommon.keys()).issubset(set(article2keywords[j]))
        ],
        "keywords": mostCommon
    }


    if len(set([a['headline'] for a in t['articles']])) < 10:
        continue

    if len(t['articles']) > 10:
        outThreads.append(t)

json.dump(outThreads, open("display/threads.json",'w'))

