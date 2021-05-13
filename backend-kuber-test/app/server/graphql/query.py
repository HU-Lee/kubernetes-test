from graphene import ObjectType, Field, Boolean
from .dataType import KoreaWeek, InterToday, KoreaToday
from .DataLoaderFunc import pickKorea, pickKoreaWeek, pickRank
from ..routes.db_sql_orm.db_init import get_db

class Query(ObjectType):
    
    def __init__(db):
        self.db = db

    koreaTodayData = Field(KoreaToday, loadDB=Boolean(required=True))
    koreaWeekData = Field(KoreaWeek, loadDB=Boolean(required=True))
    
    interData = Field(InterToday, loadDB=Boolean(required=True))
    
    def resolve_koreaTodayData(self, info, loadDB):
        data = pickKorea(loadDB, db)
        return KoreaToday(rawData = data)
    def resolve_koreaWeekData(self, info, loadDB):
        data = pickKoreaWeek(loadDB, db)
        return KoreaWeek(rawData = data)
    def resolve_interData(self, info, loadDB):
        data = pickRank(loadDB, db)
        return InterToday(rawData = data)

db = get_db()