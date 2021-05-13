import { NetworkStatus, useQuery } from '@apollo/client'
import React from 'react'
import KoreaWeekForm from '../../Components/KoreaWeekForm'
import { GET_KOR_WEEK_DATA } from '../../config/Query'

function KoreaWeekView() {

    function getKorWeekData () {
        const { error: APIerror, refetch, networkStatus, data: APIdata } = useQuery(GET_KOR_WEEK_DATA(false), {
            notifyOnNetworkStatusChange: true
        });
        const { loading:DBload, error: DBerror, data: DBdata } = useQuery(GET_KOR_WEEK_DATA(true), {skip: APIdata});
        if (networkStatus === NetworkStatus.refetch) return (
            '최신 정보 로드 중....'
        );
        if(APIdata) {
            return <KoreaWeekForm fromDB={false} data={APIdata.koreaWeekData} reloadFunc={refetch} />
        } else if(DBdata) {
            return <KoreaWeekForm fromDB={true} data={DBdata.koreaWeekData}/>
        } 
        else if (DBload) return "로딩"
        else if (APIerror || DBerror) return "에러"
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', minHeight: '400px', width: '100%'}}>
            {getKorWeekData()}   
        </div>
    )
}

export default KoreaWeekView