from starlette.applications import Starlette
from starlette.responses import UJSONResponse
import uvicorn
import os

app = Starlette(debug=False)


@app.route('/')
async def homepage(request):
    return UJSONResponse({'hello': 'world'})

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
