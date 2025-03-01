''' parse through csv file of a dictionary and substring into parts of two
so if there's a word, abdicate, we will substring by 2 letters, 'ab' 'bd' 'di' 'ic'... and store this collectively
    do this every 50 words to increase variety as the csv file is ordered
put this into a new csv file which will be built in frequency checking 
    if 'ab' is the most frequent word, then it will inevitably have higher odds of showing up 

future work will consist of comparing inputed words to the existing dictionary 
check if word contains phrase -> check if word is in dictionary

'''

import numpy as np
import pandas as pd 

# load the csv file into a dataframe 
df = pd.read_csv("dictionary.csv", header=None)

# extract every 50th word and put it into a list
words = df.iloc[::50,0].dropna().tolist() # every 50 rows, in the 0th column 


# make a function to get 2 letter substrings within every word 
def get_substrings(word):
    if len(word) == 1:
        return word
    
    return [word[i:i+2] for i in range(len(word)-1)] # return a list of all 2 letter substrings 
    # two character slice

# now process the words and store the substrings
substrings = []
for word in words:
    substrings.extend(get_substrings(word))


