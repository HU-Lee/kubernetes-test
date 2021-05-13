from graphene import String, Boolean, Int, NonNull, Interface, ObjectType

class Update(Interface):
    # 업데이트 날짜, 오늘 업데이트 여부
    update= NonNull(String)
    isToday= NonNull(Boolean)
    loadDB = NonNull(Boolean)

class CountrySimple(ObjectType):
    # 국가 이름과 확진자 수만 간단하게 제공
    name= NonNull(String)
    newDef= NonNull(Int)

class CountryRank(ObjectType):
    # 국가 이름과 확진자 수만 간단하게 제공
    name= NonNull(String)
    newDef= NonNull(Int)
    totDef= NonNull(Int)
    newDeath= NonNull(Int)
    totDeath= NonNull(Int)

class WeekForm(ObjectType):
    # 날짜, 해외유입, 국내발생
    date= NonNull(String)
    inside= NonNull(Int)
    outside= NonNull(Int)
