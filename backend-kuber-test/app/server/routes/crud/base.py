from typing import Any, Generic, Optional, Type, TypeVar

from pydantic import BaseModel
from sqlalchemy.orm import Session
import json

from ..db_sql_orm.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)

class CRUDBase(Generic[ModelType]):
    """
        CRUD 베이스인데 Delete는 할 일이 없으므로 제외
        나중에 필요시 만들겠습니다

        변수
            table : 테이블 모델

        참고
            현재 사용하는 모든 테이블 모델의 변수
            num : 날짜 저장 (직관적이지 못한 점 죄송합니다...)
            json_data : 데이터 저장
    """

    def __init__(self, table: Type[ModelType]):
        self.table = table

    def get_by_date(self, db: Session, date) -> Optional[ModelType]:
        try:
            return db.query(self.table).filter(self.table.num == date).first()
        except:
            db.rollback()
        finally:
            db.close()

    def get_recent(self, db: Session) -> Optional[ModelType]:
        try:
            return db.query(self.table).order_by(self.table.num.desc()).first()
        except:
            db.rollback()
        finally:
            db.close()

    def create(self, db: Session, **data) -> Optional[ModelType]:
        try:
            db_obj = self.table(json_data=json.dumps(data['json_data']), num=data['date']) # 딕셔너리 형태로 여러 데이터를 보낼 수 있음
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            # sql = "insert into " + self.table.__tablename__ + " (num, json_data) values (" + data['date'] + "," + json.dumps(data['json_data']) + ");" 
            # db.execute(sql)
            return db_obj
        except Exception:
            print("롤백")
            raise
            db.rollback()
        finally:
            db.close()


    def update(self, db: Session, db_obj: ModelType, **data) -> Optional[ModelType]:
        try:
            setattr(db_obj, 'json_data', json.dumps(data['json_data']))
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except:
            db.rollback()
        finally:
            db.close()

    def create_or_update(self, db: Session, **data) -> Optional[ModelType]:
        db_obj = self.get_recent(db)
        if db_obj is None: 
            # print("아 망했어요")
            # return
            print('새로 만듭니다')
            result = self.create(db, json_data=data['json_data'], date=data['date'])
        elif db_obj.num > data['date']:
            print('이전 걸 불러오네')
            return
        elif db_obj.num == data['date']:
            print('업데이트합니다')
            result = self.update(db, db_obj, json_data=data['json_data'], num=data['date'])
        else:
            print('새로 만듭니다')
            result = self.create(db, json_data=data['json_data'], date=data['date'])
        return result