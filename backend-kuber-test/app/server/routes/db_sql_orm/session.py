from decouple import config
import cx_Oracle, os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# CLEARDB_DATABASE_URL = config('CLEARDB_DATABASE_URL')
# engine = create_engine(CLEARDB_DATABASE_URL)

# LOCATION = r"C:\Oracle\instantclient_19_9"
LOCATION = r"/opt/oracle/instantclient"

# os.environ["PATH"] = LOCATION + ";" + os.environ["PATH"]
# os.environ["LD_LIBRARY_PATH"] = LOCATION

os.environ["ORACLE_HOME"] = LOCATION

ORACLE_DB_PW = config('ORACLE_DB_PW')

ORACLE_DATABASE_URL = "oracle+cx_oracle://ADMIN:" + ORACLE_DB_PW + "@lhudb_high"

print(cx_Oracle.clientversion())

engine = create_engine(ORACLE_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)