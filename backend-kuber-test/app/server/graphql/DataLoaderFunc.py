from ..routes.api_call.korea_api_call import get_korea, get_korea_week
from ..routes.api_call.inter_api_call import get_rank
from ..routes.tables.table_korea import CovidKorea, CovidKoreaWeek
from ..routes.tables.table_inter import CovidRank

from ..routes import crud
from ..routes.db_sql_orm.db_init import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

import json

"""
    공통적으로 loadDB 여부에 따라
    DB에서 우선적으로 값을 받아오거나,
    DB를 거치지 않고 API를 바로 호출하여 값을 받아 옵니다.
"""

def pickKorea(loadDB: bool, db: Session):
    if loadDB:
        DB_KOREA = crud.kor.get_recent(db)
        data = DB_KOREA if DB_KOREA else get_korea(db)   
    else:
        data = get_korea(db)
    if(type(data) == CovidKorea):
        data = data.json_data
        return json.loads(data)
    return data

def pickRank(loadDB: bool, db: Session):
    if loadDB:
        DB_RANK = crud.rank.get_recent(db)
        data = DB_RANK if DB_RANK else get_rank(db) 
    else:
        data = get_rank(db)
    if(type(data) == CovidRank):
        data = data.json_data
        return json.loads(data)
    return data

def pickKoreaWeek(loadDB: bool, db: Session):
    if loadDB:
        # DB_KOREA_WEEK = crud.kor_week.get_recent(db)
        # data = DB_KOREA_WEEK if DB_KOREA_WEEK else get_korea_week(db)
        data = crud.kor_week.get_recent(db)  
    else:
        data = get_korea_week(db)
    if(type(data) == CovidKoreaWeek):
        data = data.json_data
        return json.loads(data) 
    return data