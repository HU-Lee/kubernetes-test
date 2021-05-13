import datetime

# 날짜 관련 중복되는 함수, 변수가 있을 경우에는 여기서 처리

def beforeDay (before = 0):
    """
        오늘 날짜에서 n일 전 날짜를 Z타임 형식으로 돌려주는 함수
    """
    return ( datetime.datetime.now() - datetime.timedelta(before) ).strftime('%Y-%m-%dT00:00:00Z')

def changeTimeForm (timeStr, oldForm, newForm, before = 0, after = 0):
    """
        시간을 나타내는 String 값을 다른 포맷으로 바꾸어 주는 함수 

        Input: 
            timeStr : 바꿀 대상인 시간 String값
            oldForm : 기존 시간 포맷, 반드시 timeStr의 포맷과 일치해야 함
            newForm : 새로운 시간 포맷
            before : 이전 시점을 계산하고 싶을 경우 입력, 기본값 0
            after : 이후 시점을 계산하고 싶을 경우 입력, 기본값 0

        Result:
            newStr: 새로운 시간 포맷으로 바뀐 시간 String값
            newStrBefore : 새로운 시간 포맷, {before}일 전 시점의 시간 String값
            newStrAfter : 새로운 시간 포맷, {after}일 후 시점의 시간 String값
    """
    time = datetime.datetime.strptime(timeStr, oldForm)
    if(time.year == 1900):
        time = datetime.date(datetime.date.today().year, time.month, time.day )
    newStr = time.strftime(newForm)
    newStrBefore = ( time - datetime.timedelta(before) ).strftime(newForm)
    newStrAfter = ( time + datetime.timedelta(after) ).strftime(newForm)

    return newStr, newStrBefore, newStrAfter
    