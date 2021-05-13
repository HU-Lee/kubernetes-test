from graphene import ObjectType, Int, NonNull, List, Field, String, JSONString
from .baseType import CountrySimple, Update, WeekForm, CountryRank
from ..routes import crud
from .DataLoaderFunc import pickKorea, pickKoreaWeek, pickRank
from ..routes.utils.date import beforeDay, changeTimeForm
from ..routes.db_sql_orm.db_init import get_db
import json

class InterToday(ObjectType):
    # 세계 확진자 랭킹. 심플하게 확진자 수만
    class Meta:
        interfaces = (Update, )
        
    rankings= List(CountryRank, name= String(default_value=None))

    rawData = List(JSONString)

    def resolve_rankings(self, info, name=None):
        data = list(self.rawData)
        statistics = {}
        rankData = []
        for item in data: 
            if item['nationNm'] in statistics :
                statistics[item['nationNm']]['newDef'] -= int(item['natDefCnt'])
                statistics[item['nationNm']]['newDeath'] -= int(item['natDeathCnt'])
            else : 
                statistics[item['nationNm']] = {'newDef': int(item['natDefCnt']), 'newDeath': int(item['natDeathCnt']), 
                                                'totDef': int(item['natDefCnt']), 'totDeath': int(item['natDeathCnt'])  }
            if statistics[item['nationNm']]['newDef'] < 0 : 
                statistics[item['nationNm']]['newDef'] = 0
            if statistics[item['nationNm']]['newDeath'] < 0 : 
                statistics[item['nationNm']]['newDeath'] = 0

        # 확진자 수에 따라 나라를 정렬한다
        rankings = sorted(statistics.items(), key=lambda x: x[1]['newDef'], reverse=True)
        if name:
            rankings = filter(lambda x: x[0] == name, rankings)
        for item in rankings:
            rankData += [CountryRank(name=item[0], newDef=item[1]['newDef'],
                                    totDef=item[1]['totDef'], newDeath=item[1]['newDeath'], totDeath=item[1]['totDeath'])]
        return rankData

    def resolve_update(self, info): 
        data=list(self.rawData)
        updateTime, _, _ = changeTimeForm(data[0]['stdDay'][:13], '%Y년 %m월 %d일', '%Y-%m-%dT00:00:00Z')
        return updateTime

    def resolve_isToday(self, info): 
        data=list(self.rawData)
        updateTime, _, _ = changeTimeForm(data[0]['stdDay'][:13], '%Y년 %m월 %d일', '%Y-%m-%dT00:00:00Z')
        return updateTime == beforeDay(0)

class KoreaToday(ObjectType):
    # 대한민국의 오늘 확진현황
    class Meta:
        interfaces = (Update, )
    
    newDef= NonNull(Int)
    newDeath= NonNull(Int)
    newClear= NonNull(Int)
    newCheck= NonNull(Int)
    totDef= NonNull(Int)
    totDeath= NonNull(Int)
    totClear= NonNull(Int)
    totCheck= NonNull(Int)

    rawData = List(JSONString)
    
    partData= List(CountrySimple)
    inside= Field(CountrySimple)
    outside= Field(CountrySimple)

    def resolve_newDef(self, _):
        data = list(self.rawData)
        return data[1]['korea']['newCase']
    def resolve_newDeath(self, _):
        return list(self.rawData)[0]['TodayDeath'].replace(',', '')
    def resolve_newClear(self, _): 
        return list(self.rawData)[0]['TodayRecovered'].replace(',', '')
    def resolve_newCheck(self, _): 
        data = list(self.rawData)
        if 'korea' in data[1].keys():
            yesterdayData = crud.kor.get_by_date(get_db(),beforeDay(1))
            if yesterdayData:
                json_yesterday = json.loads(yesterdayData.json_data)
                yesterdayCount = int(json_yesterday[0]['checkingCounter'].replace(',', ''))
            else:
                yesterdayCount = 0
            return int(data[0]['checkingCounter'].replace(',', '')) - yesterdayCount
        else: 
            return 0
    def resolve_totDef(self, info):
        return list(self.rawData)[0]['TotalCase'].replace(',', '')
    def resolve_totDeath(self, info):
        return list(self.rawData)[0]['TotalDeath'].replace(',', '')
    def resolve_totClear(self, info):
        return list(self.rawData)[0]['TotalRecovered'].replace(',', '')
    def resolve_totCheck(self, info):
        data = list(self.rawData)
        return data[0]['checkingCounter'].replace(',', '')
    def resolve_partData(self, info):
        result = []
        data = list(self.rawData)[1]
        for key in data:
            if key in ['korea', 'resultCode', 'resultMessage']:
                pass
            else:
                result += [CountrySimple(name=data[key]['countryName'], newDef=data[key]['newCase'].replace(',', ''))]
        result = sorted(result, key=lambda x: int(x.newDef), reverse=True)
        return result
    def resolve_inside(self, info):
        data = list(self.rawData)
        return CountrySimple(name='국내발생', newDef=data[1]['korea']['newCcase'])
    def resolve_outside(self, info):
        data = list(self.rawData)
        return CountrySimple(name='해외유입', newDef=data[1]['korea']['newFcase'])

    def resolve_update(self, info): 
        data=list(self.rawData)
        updateTime, _, _ = changeTimeForm(data[0]['updateTime'], "코로나바이러스감염증-19 국내 발생현황 (%m.%d. 00시 기준)", '%Y-%m-%dT00:00:00Z') 
        return updateTime
        
    def resolve_isToday(self, info): 
        data=list(self.rawData)
        updateTime, _, _ = changeTimeForm(data[0]['updateTime'], "코로나바이러스감염증-19 국내 발생현황 (%m.%d. 00시 기준)", '%Y-%m-%dT00:00:00Z') 
        return updateTime == beforeDay(0)


class KoreaWeek(ObjectType):
    # 한국 주간 확진자 (해외발생, 국내유입)
    class Meta:
        interfaces = (Update, )
    
    weekData= List(WeekForm)

    rawData = List(JSONString)

    def resolve_weekData(self, info):
       
        data = list(self.rawData)
        arr = []
        filtered = list(filter(lambda x: x['gubun'] == '합계', data))
        for i in range(0,7):
            arr += [WeekForm(date=filtered[i+1]['createDt'][:10],
                             inside=int(filtered[i]['incDec']) - int(filtered[i]['overFlowCnt']),
                             outside=filtered[i]['overFlowCnt'])]
        return list(reversed(arr))

    def resolve_update(self, info): 
        data=list(self.rawData)
        updateTime, _, _ = changeTimeForm(data[0]['stdDay'][:13], '%Y년 %m월 %d일', '%Y-%m-%dT00:00:00Z')
        return updateTime
        
    def resolve_isToday(self, info): 
        data=list(self.rawData)
        updateTime, _, _ = changeTimeForm(data[0]['stdDay'][:13], '%Y년 %m월 %d일', '%Y-%m-%dT00:00:00Z')
        return updateTime == beforeDay(0)
