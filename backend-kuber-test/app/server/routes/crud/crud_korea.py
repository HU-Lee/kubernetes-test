from .base import CRUDBase
from ..tables.table_korea import CovidKorea, CovidKoreaWeek

class CRUDKorea(CRUDBase[CovidKorea]):
    pass

class CRUDKoreaWeek(CRUDBase[CovidKoreaWeek]):
    pass

kor = CRUDKorea(CovidKorea)
kor_week = CRUDKoreaWeek(CovidKoreaWeek)