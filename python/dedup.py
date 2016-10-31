import csv

DESKTOP_PATH = "/Users/carl/Desktop/"
CSV_PATH = DESKTOP_PATH + "dups.csv"

def serialized_seen(a):
  return a[0] + "_" + a[1]

def serialized_seen_reverse(a):
  return a[1] + "_" + a[0]

def clean_dups(companies):
  seen = set()
  uniq = []
  
  for c in companies:
    if serialized_seen(c) not in seen:
      uniq.append(c)
      seen.add(serialized_seen(c))
      seen.add(serialized_seen_reverse(c))
  
  return uniq

with open(CSV_PATH, encoding='mac_roman', newline='') as csvfile:
  reader = csv.reader(csvfile, delimiter=",")
  data = list(reader)

  results = clean_dups(data)

  with open(DESKTOP_PATH + "/output_no_dub.csv", 'w') as f:
    w = csv.writer(f)
    for result in results:
      w.writerow(result)

# from http://stackoverflow.com/questions/9835762/find-and-list-duplicates-in-python-list