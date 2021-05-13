from sqlalchemy import Column, String

from ..db_sql_orm.base_class import Base


# 한국 관련 테이블 모델을 정의

class CovidKorea(Base):
    num = Column(String(30), primary_key=True)
    json_data = Column(String)

class CovidKoreaWeek(Base):
    num = Column(String(30), primary_key=True)
    json_data = Column(String)