import React, { useEffect, useState } from 'react';
import  { useQuery, NetworkStatus} from '@apollo/client'
import { GET_KOR_TODAY_DATA } from '../../config/Query';
import KoreaTotalForm from '../../Components/KoreaTotalForm';
import { socket } from '../../socketio';
import dayjs from 'dayjs';

function KoreaTotalView() {

    const [Date, setDate] = useState("Socket.IO 연결 중...")
   
    const settingData = () => {
        socket.on('connect', () => {
            getData()
        })
        socket.on('disconnect', () => {
            console.log("왜 끊김?")
        })
        socket.on('today-result', (msg) => {
            if(msg.success)
                setDate(msg.date)
            else
                setDate("망했어요")
        })
    }

    const getData = () => {
        setDate("뭐냐구")
        console.log("보낸다 요청")
        socket.emit('today-call')
    }

    const startGetData = () => {
        getData()
        return setInterval(() => getData(), 180000)
    }

    useEffect(() => {
        settingData()
        startGetData()
    }, [])

    function getKorTotalData () {

        const { loading:DBload, error: DBerror, data: DBdata, refetch, networkStatus } = useQuery(GET_KOR_TODAY_DATA(true), {
            notifyOnNetworkStatusChange: true,
            pollInterval: 180000
        });
        if (networkStatus === NetworkStatus.refetch) return (
            <p>'최신 정보 로드 중....'</p>
        );
        if(DBdata) {
            console.log(`업데이트 ${dayjs().format('H시 m분 s초')}`)
            return <KoreaTotalForm date={Date} data={DBdata.koreaTodayData} reloadFunc={refetch}/>
        } 
        else if (DBload) return <p>"로딩"</p>
        else if (DBerror) return <p>"에러"</p>
        
    }    

    return ( <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', height: '175px', width: '100%'}}>
            {getKorTotalData()}
        </div>
    )
}

export default KoreaTotalView
