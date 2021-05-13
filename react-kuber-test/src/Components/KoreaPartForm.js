import { Grid, IconButton } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'
import { Refresh } from '@material-ui/icons'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Cell, LabelList, Legend, Pie, PieChart, Tooltip } from 'recharts'


const colors = ['#ff3300', '#ff9900', '#ffcc00','#0a8b01', '#6699FF','#BBBBFF' ]

function KoreaPartForm({ data, fromDB, reloadFunc }) {

    const [isSmall, setIsSmall] = useState(window.innerWidth < 400)

    const reducer = (a,b) => Number(a) + Number(b)

    const makeChart = (Data) => {
        const arr = Data.partData.slice(0,5)
        return [
            ...arr.map(a => ({'name': a.name, 'value': Number(a.newDef)})),
            {name: '기타', value: Number(Data.inside.newDef) + Number(Data.outside.newDef) - arr.map(a => a.newDef).reduce(reducer)}
        ]
    }

    const onResize = (e) => {
        setIsSmall(e.target.innerWidth < 400)
    }

    useEffect(() => {
        window.addEventListener('resize', onResize)
    }, [isSmall])

    return (
        <Grid container style={{textAlign: 'center', width: '100%', maxWidth:'800px', lineHeight: '40px'}} justify='center' alignContent="center">
            <Grid item xs={12} style={{marginBottom: '10px'}}>
                <b style={{fontSize: '1.2rem'}}>지역별 확진 현황</b><br/>
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
                국내발생 <b>{data.inside.newDef}</b>
            </Grid>
            <Grid item xs={4} style={{fontSize: '0.9rem', color:'#7B68EE', backgroundColor: '#eeeeff'}}>
                해외유입 <b>{data.outside.newDef}</b>
            </Grid>
            <Grid item xs={12} md = {6} style={{marginTop: '40px'}}>
                <h3>지역별 확진자 Top5</h3>
                <div width='100%' height={isSmall ? 250 : 350}>
                    <PieChart width={isSmall ? 250 : 350} 
                    height={isSmall ? 250 : 400} style={{margin: '0 auto'}}>
                        <Pie data={makeChart(data)} cx="50%" cy="50%" 
                        innerRadius={isSmall ? 40 : 80} 
                        outerRadius={isSmall ? 50 : 100} 
                        label nameKey='name'>
                            {makeChart(data).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index]}>
                                    <LabelList dataKey="value" position="outside" offset={15}/>
                                </Cell>
                            ))}
                        </Pie>
                        <Legend align="middle" verticalAlign='top'/>
                        <Tooltip/>
                    </PieChart>
                </div>
            </Grid>
            <Grid item xs={12} md = {6} style={{marginTop: '40px', width: '100%', minHeight: '400px'}}>
                <DataGrid columns={[
                    {field: 'name', headerName: '지역', flex: 1},
                    {field: 'newDef', headerName: '확진자 수 (명)', flex: 1},
                ]} rows={
                    data.partData.map((item, index) => ({ id: index, ...item}))
                } autoPageSize/>
            </Grid>
        </Grid>
    )
}

export default KoreaPartForm
