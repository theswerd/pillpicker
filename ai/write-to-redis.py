import pandas as pd
import redis;
import numpy as np
from redis.commands.search.field import (
    NumericField,
    TagField,
    TextField,
    VectorField,
)
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query

data = pd.read_json("./extract-350-features.json")
r = redis.Redis(host='localhost', port=6379, db=0, password="password", username="default")
data = data.set_index("id")


pipeline = r.pipeline()

for index, val in enumerate(data.iterrows()):
    redis_key = f"pills:{index}"
    # print(val)
    # r.delete("pills:"+str(val[0]).rjust(11, '0'))
    if(index == 0):
        print("DATA\n\n", np.array(val[1][0][0]), "\n")
    pipeline.json().set(redis_key, '$', {"id": str(val[0]).rjust(11, '0'), "features": np.array(val[1][0][0]).tolist()})
    # r.hset("pills:"+str(val[0]).rjust(11, '0'), "features", np.array(val[1][0]).tobytes())

res = pipeline.execute()
# print(res)

schema = (
    TextField("$.id", sortable=True, as_name="id"),
    VectorField(
        "$.features",
        "FLAT",
        {
            "TYPE": "FLOAT32",
            "DIM": 640,
            "DISTANCE_METRIC": "L2",
        },

        as_name="vector",
    ),
)
# definition = IndexDefinition(prefix=["pills:"], index_type=IndexType.JSON)
# res = r.ft("idx:pills-l2").create_index(
#     fields=schema, definition=definition
# )


# info = r.ft("idx:pills-l2").info()
# num_docs = info["num_docs"]
# indexing_failures = info["hash_indexing_failures"]

# # print("Number of documents indexed: {}".format(num_docs))
# # print("Number of failed documents: {}".format(indexing_failures))
# # #FT.CREATE idx_v2 ON JSON SCHEMA $.vec as features VECTOR FLAT 6 TYPE FLOAT32 DIM 640 DISTANCE_METRIC L2