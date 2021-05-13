import fastapi
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.graphql import GraphQLApp
from graphene import Schema
from .graphql.query import Query
from .routes.db_sql_orm.db_init import get_db
from .routes.crud import rank

from .routes.api_call.korea_api_call import get_korea

import datetime, requests

import socketio, json

app = fastapi.FastAPI()

origins = [
    "http://20.198.145.17",
    "http://localhost:*",
    "https://no-corona.netlify.app",
    "https://no-corona.netlify.app:80"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

@app.get("/")
async def api_home():
   return '코로나 서버! ' + datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")

app.add_route("/graphql", GraphQLApp(schema=Schema(query=Query)))

# cors_allowed_origins=[] 이게 정답이었다...
# https://github.com/miguelgrinberg/python-socketio/issues/205
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[])
app_socketio = socketio.ASGIApp(sio, socketio_path='/api/socket.io')
app.mount("/ws", app_socketio)

@sio.on('today-call')
async def handle_join(sid, *args, **kwargs):
    print("나는 함수 싫행되면 나옴")
    db = get_db()
    boolToday = True if get_korea(db) else False
    # data = rank.get_recent(db)
    # parsedData = json.loads(data.json_data)
    # data = inter_query
    await sio.emit('today-result',
     {"date": datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"), 
      "success": boolToday})