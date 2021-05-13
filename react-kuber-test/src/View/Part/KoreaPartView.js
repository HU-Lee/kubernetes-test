import { NetworkStatus, useQuery } from '@apollo/client'
import React from 'react'
import KoreaPartForm from '../../Components/KoreaPartForm'
import { GET_KOR_PART_DATA } from '../../config/Query'

function KoreaPartView() {
    
    function getKorPartData () {
        
        const { error: APIerror, refetch, networkStatus, data: APIdata } = useQuery(GET_KOR_PART_DATA(false), {
            notifyOnNetworkStatusChange: true
        });
        const { loading:DBload, error: DBerror, data: DBdata } = useQuery(GET_KOR_PART_DATA(true), {skip: APIdata});
        if (networkStatus === NetworkStatus.refetch) return (
            '최신 정보 로드 중....'
        );
        if(APIdata) {
            return <KoreaPartForm fromDB={false} data={APIdata.koreaTodayData} reloadFunc={refetch} />
        } else if(DBdata) {
            return <KoreaPartForm fromDB={true} data={DBdata.koreaTodayData}/>
        } 
        else if (DBload) return "로딩"
        else if (APIerror || DBerror) return "에러"
        
    }    
    
    return ( <div style={{display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', width: '100%',minHeight: '400px'}}>
            {getKorPartData()}
        </div>
    )
}

export default KoreaPartView
