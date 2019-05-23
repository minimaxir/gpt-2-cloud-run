from starlette.applications import Starlette
from starlette.responses import UJSONResponse
import ray
from ray.experimental import async_api
from random import choice
import asyncio
import gpt_2_simple as gpt2
import uvicorn
import os

concurrency = 2   # change as necessary

# 100 MB for each
ray.init(object_store_memory=10 * 1000000,
         redis_max_memory=10 * 1000000,
         num_cpus=1)

app = Starlette(debug=False)

@ray.remote(num_cpus=1/concurrency)
class GPT2Worker(object):
    def __init__(self):
        self.gpu_ids = ray.get_gpu_ids()
        os.environ["CUDA_VISIBLE_DEVICES"] = ",".join(map(str, self.gpu_ids))
        self.sess = gpt2.start_tf_sess(threads=1)
        gpt2.load_gpt2(self.sess)

    def generate(self):
        return gpt2.generate(self.sess)

worker_list = [GPT2Worker.remote() for _ in range(concurrency)]
async_api.init()


@app.route('/', methods=['GET', 'POST'])
async def homepage(request):
    if request.method == 'GET':
        params = request.query_params
    elif request.method == 'POST':
        params = await request.json()

    worker = choice(worker_list)  # select a random worker to distribute load
    loop = asyncio.get_event_loop()

    task = async_api.as_future(worker.generate.remote()
        # length=int(params.get('length', 1023)),
        # temperature=float(params.get('temperature', 0.7)),
        # top_k=int(params.get('top_k', 0)),
        # top_p=float(params.get('top_p', 0.0)),
        # prefix=params.get('prefix', None),
        # truncate=params.get('truncate', None),
        # include_prefix=str(params.get(
        #     'include_prefix', True)).lower() == 'true',
        # return_as_list=True
    )

    text = loop.run_until_complete(task)

    return UJSONResponse({'text': text[0]})


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
