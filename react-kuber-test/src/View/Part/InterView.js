import { NetworkStatus, useQuery } from '@apollo/client'
import React from 'react'
import InterForm from '../../Components/InterForm';
import { GET_INTER_DATA } from '../../config/Query'

function InterView() {

 

    function getInterData() {
        const { loading:DBload, error: DBerror, data: DBdata } = useQuery(GET_INTER_DATA(true));
        const { error: APIerror, refetch, networkStatus, data: APIdata } = useQuery(GET_INTER_DATA(false), {
            notifyOnNetworkStatusChange: true
        });
        if (networkStatus === NetworkStatus.refetch) return (
            '최신 정보 로드 중....'
        );
        if(APIdata && APIdata.interData.isToday) {
            return <InterForm fromDB={false} data={APIdata.interData} reloadFunc={refetch} />
        } else if(DBdata) {
            return <InterForm fromDB={true} data={DBdata.interData} reloadFunc={refetch}/>
        } 
        else if (DBload) return "로딩"
        else if (APIerror || DBerror) return "에러"
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', width: '100%', minHeight: '250px', marginTop: '10px'}}>
            {getInterData()}
        </div>
    )
}

export default InterView
