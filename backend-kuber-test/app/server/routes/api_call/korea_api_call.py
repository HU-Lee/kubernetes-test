import requests
from decouple import config
import xmltodict, json
from ..utils.date import changeTimeForm 
import datetime
from ...routes import crud
from ..db_sql_orm.db_init import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

# 한국 공공API, 굿바이코로나 API를 호출해 데이터를 불러오는 함수들

# 공공 API 관련
PUBLIC_KEY = config('PUBLIC_KEY')
PUBLIC_URL = config('PUBLIC_URL')

# 굿바이코로나 API 관련
GOOD_KEY = config('GOOD_KEY')
GOOD_URL = config('GOOD_URL')


def get_korea(db: Session, timeStr=datetime.datetime.now().strftime("%Y-%m-%dT00:00:00Z")):
    """
        요청시점과 1일 전 시점을 반환하여
        굿바이 코로나 api를 불러 옵니다.
        
        국내 카운터 정보에만 업데이트 일시가 들어 있기 때문에
        먼저 국내 카운터를 호출하여 업데이트날짜를 확인해
        업데이트 날짜가 오늘이 아니면 어제 데이터를 불러 오고, 
        업데이트 날짜가 오늘이면 마저 시도별 발생동향을 가져옵니다.

        Input:
            timeStr : 시점, %Y-%m-%dT00:00:00Z 형식, 현재 시점이 기본값
            db

        Return: [result1, result2]
            result1: 국내 카운터 정보
            result2: 시도별 발생동향
        
    """
    today, yesterday, _ = changeTimeForm(timeStr, '%Y-%m-%dT00:00:00Z', '%Y-%m-%dT00:00:00Z', 1)
 
    url = GOOD_URL + '/?serviceKey=' + GOOD_KEY
    result1 = json.loads(requests.get(url).text.encode('utf-8'))
    updateTime, _, _ = changeTimeForm(result1['updateTime'], "코로나바이러스감염증-19 국내 발생현황 (%m.%d. 00시 기준)", '%Y-%m-%dT00:00:00Z')
    if(updateTime != today):
        return get_korea(db, yesterday)
    else:
        url2 = GOOD_URL + '/country/new/?serviceKey=' + GOOD_KEY
        result2 = json.loads(requests.get(url2).text.encode('utf-8'))
        crud.kor.create_or_update(db, json_data=[result1, result2], date=timeStr)
        return [result1, result2]

def get_korea_week(db: Session, timeStr=datetime.datetime.now().strftime("%Y-%m-%dT00:00:00Z")):
    """
        요청시점과 7일 전 시점을 반환하여
        공공 시도발생 api를 불러 옵니다.
        
        공공 api는 날짜 형식이 %Y%m%d 입니다.

        xml 형식으로 데이터가 반환되기 때문에 xmltodict를 이용한 변환이 필요합니다.
        
        7일 전부터 해당 시점까지 총 8일치의 데이터를 불러와야 정상입니다.
        아니라면 최신 데이터가 아니므로 어제 데이터를 호출합니다.

        Input:
            timeStr : 시점, %Y-%m-%dT00:00:00Z 형식, 현재 시점이 기본값
            db

        Return: [result1, result2]
            data : 공공 시도발생 api 8일치 데이터
        
    """

    today, before7day, _ = changeTimeForm(timeStr, '%Y-%m-%dT00:00:00Z', '%Y%m%d', 7)

    url = PUBLIC_URL+"/getCovid19SidoInfStateJson?ServiceKey="+PUBLIC_KEY
    queryString = '&startCreateDt='+ before7day + "&endCreateDt=" + today
    result = requests.get(url+queryString).text.encode('utf-8')
    data = xmltodict.parse(result)['response']['body']['items']['item']
    if(len(list(filter(lambda x: x['gubun'] == '합계', data))) < 8):
        _, yesterdayZ, _ = changeTimeForm(timeStr, '%Y-%m-%dT00:00:00Z', '%Y-%m-%dT00:00:00Z', 1)
        return get_korea_week(db, yesterdayZ)
    else:
        crud.kor_week.create_or_update(db, json_data= data, date= timeStr)
        return data