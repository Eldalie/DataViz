import numpy as np
import hdf5_getters
from hdf5_getters import *
import json
import tables

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

def jsonData(data):
    return json.dumps(data,cls=NumpyAwareJSONEncoder)+','


def LoadData(content):
    
    #if(isinstance(content, tuple)):
       # content = content[1]
    
    h5 = tables.open_file(content[0], driver="H5FD_CORE",
                              driver_core_image=content[1],
                              driver_core_backing_store=0)

    data= [get_year(h5),get_artist_terms(h5),get_artist_latitude(h5),get_artist_longitude(h5),get_num_songs(h5),get_title(h5),get_song_id(h5)]
   
    
    return data

def Filter(data):
        return (data[0]!=0 and not np.isnan(data[2]))


#import findspark
#findspark.init()#"/home/benjamin/spark/spark-1.6.3-bin-hadoop2.6")
import pyspark 

conf = pyspark.SparkConf()
conf.setAppName("GET DATA")
#conf.setMaster("yarn")
sc = pyspark.SparkContext(conf=conf)

sc.addPyFile("./hdf5_getters.py")

path='hdfs:/datasets/million-song_untar/B/*/*/*.h5'


sc.binaryFiles(path).map(lambda file : LoadData(file) ).filter(Filter).map(jsonData).saveAsTextFile("data.json")
