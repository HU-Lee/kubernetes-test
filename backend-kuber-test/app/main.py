#로컬에서 실행하기 위한 파이썬 파일이다...
import uvicorn

if __name__ == "__main__":
    # uvicorn.run("server.app_init:app", host="127.0.0.1", port=8000, reload=True)
    uvicorn.run("server.app_init:app", host="0.0.0.0", port=120, reload=True)