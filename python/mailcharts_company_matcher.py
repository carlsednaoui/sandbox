import csv
# import pandas as pd
from difflib import SequenceMatcher
from itertools import islice

CSV_PATH = '/Users/carl/Desktop/results.csv'

# define similarity function
def similar (a, b):
  return SequenceMatcher(None, a.lower(), b.lower()).ratio()

# test similarity function
# print similar('apple', 'Apple')
# print similar('Oasis Clothing UK', 'Oasis Fashions')

# load csv
with open(CSV_PATH, 'rb') as csvfile:
  reader = csv.reader(csvfile, delimiter=',')
  for row in reader:
    top = 0 #save the top score
    main_company = row[1] #grab the company we want
    print main_company



# use pandas
# df = pd.read_csv(CSV_PATH)
# saved_column = df['Name']
# print saved_column
