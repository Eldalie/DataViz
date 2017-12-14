import json

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
    return json.dumps(data,cls=NumpyAwareJSONEncoder)+',\n'
    
json_data=open("data.json").read()

data = json.loads(json_data)


#with open("data.json", "a") as myfile:
#    for l in data['data'] :
 #    if "rock" in l[6][0]:
 #       #print(jsonData(l))
 #       myfile.write(jsonData(l))


