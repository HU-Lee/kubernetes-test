from .base import CRUDBase
from ..tables.table_inter import CovidRank

class CRUDRank(CRUDBase[CovidRank]):
    pass

rank = CRUDRank(CovidRank)