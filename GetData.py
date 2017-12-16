#This scrit must be launch on the cluster with the comand spark-submit --master yarn GetData.py and spark and yar install like describe on the spark git on ada : https://github.com/epfl-ada/ADA2017-Tutorials/tree/master/05%20-%20Using%20the%20cluster

import numpy as np
from hdf5_getters import *
import json
import tables

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
        get_track_7digitalid
           ]
    
def LoadData(content):
     #if(isinstance(content, tuple)):
       # content = content[1]
    
    h5 = tables.open_file(content[0], driver="H5FD_CORE",
                              driver_core_image=content[1],
                              driver_core_backing_store=0)


    data= [ funct(h5) for funct in feature]    
    h5.close()
    return data

# keep only elemnt that math the Filter
def Filter(data):
        lnan = [1,2]
        for i in lnan:
            if(np.isnan(data[i])):
                return False
        lzero = [0]
        for i in lzero:
            if(data[i]==0.0):
                return False
        return (data[0]!=0) and any("rock" in s for s in data[6])


import pyspark 

conf = pyspark.SparkConf()
conf.setAppName("GET DATA").setMaster("yarn-client").set("spark.executor.heartbeatInterval","36000s").set("spark.network.timeout","360000s")
sc = pyspark.SparkContext( conf=conf)

# Select on what you want work

fjson = open("/buffer/AGREGATE/data2.json","w")
fjson.write('{"columns":'+jsonData([name.__name__[4:].replace('_', ' ') for name in feature])+',\n"data":[')

# Select on what you want work
path='hdfs:/datasets/million-song_untar/'

for l1 in "MNOPQRSTUVWXYZ" : 
    for l2 in "ABCDEFGHIJKLMNOPQRSTUVWXYZ" :
        for l3 in "ABCDEFGHIJKLMNOPQRSTUVWXYZ" :
            gp = path+l1+'/'+l2+'/'+l3+'/*.h5'
            print(gp)
            #Spark !!!! save data to json file
            try :
                cf = sc.binaryFiles(gp).collect()
                for file in cf:
                     data = LoadData(file)
                     if Filter(data):
                         fjson.write(jsonData(data))
            except : 
                pass

fsjon.write(']}')
    
#import findspark
#findspark.init()#"/home/benjamin/spark/spark-1.6.3-bin-hadoop2.6")
#import pyspark 

#conf = pyspark.SparkConf()
#conf.setAppName("GET DATA").setMaster("yarn-client").set("spark.executor.heartbeatInterval","3600s")
#sc = pyspark.SparkContext(conf=conf)

#fjson = open("/buffer/AGREGATE/data2.json","w")
#fjson.write('{"columns":'+jsonData([name.__name__[4:].replace('_', ' ') for name in feature])+',\n"data":[')

# Select on what you want work
#path='hdfs:/datasets/million-song_untar/'
#
#for l1 in "MNOPQRSTUVWXYZ" : 
#    for l2 in "ABCDEFGHIJKLMNOPQRSTUVWXYZ" :
#        for l3 in "ABCDEFGHIJKLMNOPQRSTUVWXYZ" :
#            gp = path+l1+'/'+l2+'/'+l3+'/'
#            print(gp)
#            files = subprocess.Popen(["hadoop", "fs", "-ls", gp], stdout=subprocess.PIPE).stdout.read()
#            for line in files.split("\n")[1:] :
#                filepath = line.split()[-1]
#                print(filepath)
#                content = subprocess.Popen(["hadoop", "fs", "-cat", filepath], stdout=subprocess.PIPE).stdout.read()
#                data = LoadData([filepath,content])
#                if Filter(data):
#                        fjson.write(jsonData(data))
            #Spark !!!! save data to json file

#fsjon.write(']}')

