import requests
from decouple import config
import xmltodict
from ..utils.date import changeTimeForm
import datetime
from ...routes import crud
from ..db_sql_orm.db_init import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

# 한국 해외발생 API를 호출해 데이터를 불러오는 함수들

# 공공 API 관련
PUBLIC_KEY = config('PUBLIC_KEY')
PUBLIC_URL = config('PUBLIC_URL')

def get_rank (db: Session, timeStr=datetime.datetime.utcnow().strftime("%Y-%m-%dT00:00:00Z")):
    """
        요청시점과 1일 전 시점을 반환하여
        공공 해외발생 api를 불러 옵니다.
        
        공공 api는 날짜 형식이 %Y%m%d 입니다.

        xml 형식으로 데이터가 반환되기 때문에 xmltodict를 이용한 변환이 필요합니다.
        
        1일 전부터 해당 시점까지 총 2일치의 데이터를 불러와야 정상입니다.
        아니라면 최신 데이터가 아니므로 어제 데이터를 호출합니다.

        해외발생 api는 정보가 너무 많아 DB에 바로 담으면 무거울 수 있기 때문에
        필요없는 항목은 미리 제거합니다.

        Input:
            timeStr : 시점, %Y-%m-%dT00:00:00Z 형식, 현재 시점이 기본값
            db

        Return: [result1, result2]
            data : 공공 해외발생 api 2일치 데이터
        
    """

    today, yesterday, _ = changeTimeForm(timeStr, '%Y-%m-%dT00:00:00Z', '%Y%m%d', 1)

    url = PUBLIC_URL+"/getCovid19NatInfStateJson?ServiceKey="+PUBLIC_KEY
    queryString = '&startCreateDt='+ yesterday + "&endCreateDt=" + today
    result = requests.get(url+queryString).text.encode('utf-8')
    print(url + queryString)
    if(int(xmltodict.parse(result)['response']['header']['resultCode']) == 99):
        _, yesterdayZ, _ = changeTimeForm(timeStr, '%Y-%m-%dT00:00:00Z', '%Y-%m-%dT00:00:00Z', 1)
        return get_rank(db, yesterdayZ)
    data = xmltodict.parse(result)['response']['body']['items']['item']
    if(len(list(filter(lambda x: x['nationNm'] == '한국', data))) < 2):
        _, yesterdayZ, _ = changeTimeForm(timeStr, '%Y-%m-%dT00:00:00Z', '%Y-%m-%dT00:00:00Z', 1)
        return get_rank(db, yesterdayZ)
    else:
        deleteKey = ['areaNm', 'areaNmCn', 'areaNmEn', 'natDeathRate', 'seq', 'nationNmCn','createDt', 'updateDt']
        for item in data:
            for key in deleteKey:
                del(item[key])
        crud.rank.create_or_update(db, json_data=data, date=timeStr)
        return data

