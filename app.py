from starlette.applications import Starlette
from starlette.responses import UJSONResponse
import gpt_2_simple as gpt2
import uvicorn
import os

app = Starlette(debug=False)

sess = gpt2.start_tf_sess(threads=1)
gpt2.load_gpt2(sess)


@app.route('/')
async def homepage(request):
    params = request.query_params

    text = gpt2.generate(sess,
                         length=int(params.get('length', 1023)),
                         temperature=float(params.get('temperature', 0.7)),
                         top_k=int(params.get('top_k', 0)),
                         prefix=params.get('prefix', None),
                         truncate=params.get('truncate', None),
                         include_prefix=str(params.get(
                             'include_prefix', True)).lower() == 'true',
                         return_as_list=True
                         )[0]

    return UJSONResponse({'text': text})

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
