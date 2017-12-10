import numpy as np
#import hdf5_getters
from hdf5_getters import *
import json
import tables
import os
import glob

#class to encode a numpy elemnts in json
class NumpyAwareJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray) and obj.ndim == 1:
            return obj.tolist()
        if isinstance(obj, np.int32):
            return int(obj)
        if isinstance(obj, np.bytes_) or isinstance(obj, bytes):
            return obj.decode("utf-8")
        #(type(obj))
        return json.JSONEncoder.default(self, obj)

#reduce fontion to conver data to json
def jsonData(data):
    return json.dumps(data,cls=NumpyAwareJSONEncoder)+',\n'

#Funciton that decode hd5 file to what we want
feature = [get_year,
        get_artist_latitude,
        get_artist_longitude,
        get_artist_hotttnesss,
        get_artist_name,
        get_artist_id,
        get_artist_terms,
        get_title,
        get_song_hotttnesss,
        #get_artist_terms_weight,
        #get_similar_artists,
           ]

def LoadData(h5,i):
     #if(isinstance(content, tuple)):
       # content = content[1]


    data= [ funct(h5,i) for funct in feature]

    return data

# keep only elemnt that math the Filter
def Filter(data):
        lnan = [1,2,3]
        for i in lnan:
            if(np.isnan(data[i])):
                return False
        lzero = [0]
        for i in lzero:
            if(data[i]==0.0):
                return False
        return (data[0]!=0) and any("rock" in s for s in data[6])


fjson = open("/buffer/AGREGATE/data2.json","w")

fjson.write('{"columns":'+jsonData([name.__name__[4:].replace('_', ' ') for name in feature])+',\n"data":[')

h5 = open_h5_file_read("../million-song/dataset/msd_summary_file.h5")

try : 
    i = 0
    while True: 
        LoadData(h5,i)
        data = LoadData(h5,i)
        if Filter(data):
                fjson.write(jsonData(data))
        i+=1
except : 
    pass
fsjon.write(']}')