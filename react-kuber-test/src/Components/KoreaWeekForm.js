import { Grid, IconButton } from '@material-ui/core'
import { Refresh } from '@material-ui/icons'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, Legend, XAxis, YAxis, Tooltip} from 'recharts'

function KoreaWeekForm({ data, fromDB, reloadFunc }) {

    const [Size, setSize] = useState(window.innerWidth)

    const onResize = (e) => {
        setSize(e.target.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', onResize)
    }, [Size])

    return (
        <Grid container style={{textAlign: 'center', width: '100%', maxWidth:'800px', lineHeight: '40px'}} justify='center' alignContent="center">
            <Grid item xs={12} style={{marginBottom: '10px'}}>
                <b style={{fontSize: '1.2rem'}}>주간 확진자 변화</b><br/>
                { fromDB ? <b style={{fontSize: '0.9rem'}}>최신 정보 로드 중...</b>
                 : <React.Fragment>
                    <b style={{fontSize: '0.9rem'}}>
                        {data.isToday ? '오늘 업데이트되었습니다.' : `이전 데이터입니다.`}&nbsp;
                        {`(${dayjs(data.update).subtract(1,'day').format('YYYYMMDD')} 통계)`}
                    </b>
                    <IconButton color='primary' size='small' onClick={() => reloadFunc()}>
                        <Refresh/>
                    </IconButton>
                 </React.Fragment>
                }                                 
            </Grid>
            <Grid item xs={4} style={{fontSize: '0.9rem', backgroundColor: '#eeeeff'}}>일일 확진자</Grid>
            <Grid item xs={4} style={{fontSize: '0.9rem', color:'red', backgroundColor: '#eeeeff'}}>
                국내발생 <b>{data.weekData[6].inside}</b>
            </Grid>
            <Grid item xs={4} style={{fontSize: '0.9rem', color:'#7B68EE', backgroundColor: '#eeeeff'}}>
                해외유입 <b>{data.weekData[6].outside}</b>
            </Grid>
            <Grid item xs={12} style={{marginTop: '40px'}}>
                <div style={{width:'100%', margin: '0 auto', height:`${Size < 400 ? 250 : 400}`}}>
                    <BarChart width={Size < 400 ? Math.max(250, Size-50) : Math.min(600, Size-150)} 
                    height={Size < 400 ? 250 : 400} style={{margin: '0 auto'}}
                    data={data.weekData.map(a => ({
                        inside: a.inside, outside: a.outside, date: dayjs(a.date).format('M.D')
                    }))}>
                        <YAxis />
                        <XAxis name="날짜" dataKey="date"/>
                        <Legend />
                        <Tooltip/>
                        <Bar dataKey="inside" stackId="a" name="국내발생" fill="red" maxBarSize={18}/>
                        <Bar dataKey="outside" stackId="a" name="해외유입" fill="#8884d8" maxBarSize={18} label={{ position: 'top' }}/>
                    </BarChart>
                </div>
            </Grid>
        </Grid>
    )
}

export default KoreaWeekForm
