Pod 1   
container1: nginx  
container2: react

React에서 빌드를 하고 파일을 emptyDir에 저장 후  
nginx에서 해당 파일을 가져와서 배포

Pod 2   
container1: oracle db server  
container2: backend server  
container3 : nginx

oracle DB 서버는 kubectl exec 이용하여 수동으로 접속  
nginx는 reverse-proxy로 백엔드 서버에 접근