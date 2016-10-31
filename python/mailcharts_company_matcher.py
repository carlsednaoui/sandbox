import csv
import pprint
# import pandas as pd
from difflib import SequenceMatcher
from itertools import islice

DESKTOP_PATH = "/Users/carl/Desktop/"
CSV_PATH = DESKTOP_PATH + "companies.csv"

# define similarity function
def similar (a, b):
  return round(SequenceMatcher(None, a.lower(), b.lower()).ratio(),2)

# test similarity function
# print similar('apple', 'Apple')
# print similar('Oasis Clothing UK', 'Oasis Fashions')

# load csv
with open(CSV_PATH, newline='') as csvfile:
  reader = csv.reader(csvfile, delimiter=',')
  
  # save all the data to a list, we're dealing with small numbers
  data = list(reader)

  headers = ["company_id", "match_id", "similarity", "original_name", "compared_name"]
  results = [] #this is where we'll save everything

  for row in data:
    for _row in data:
      if row == _row:
        continue
      similarity = similar(row[1], _row[1])
      if similarity > 0.7:
        results.append(
          [
            row[0], #company_id
            _row[0], #match_id
            similarity, #similarity
            row[1], #original_name
            _row[1] #compared_name
          ]
        )

  pprint.pprint(results)

  # let's now do all of this in an array so we can easily output it to a csv
  somedict = dict(raymond='red', rachel='blue', matthew='green')

  with open(DESKTOP_PATH + "/output.csv", 'w') as f:
    w = csv.writer(f)
    w.writerow(headers)
    for result in results:
      w.writerow(result)

####
#  optimizations:
## for each match, there is now two rows ([a,b], [b,a])
####
