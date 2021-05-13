import React, { useEffect } from 'react';
import { Grid, IconButton } from '@material-ui/core';
import dayjs from 'dayjs';
import { Refresh } from '@material-ui/icons';

function KoreaTotalForm({ data, date, reloadFunc }) {

    const renderResult = (str1, str2, str3) => (
        <div>
            <b style={{fontSize: "0.8rem"}}>{str1}</b><br/>
            <b style={{fontSize: "1.1rem"}}>{new Intl.NumberFormat().format(str2)}</b><br/>
            <b style={{fontSize: "0.7rem"}}>{str3}</b>
        </div>
    );

    return (
        <Grid container style={{textAlign: 'center', maxWidth: "800px"}} justify='center'>
            <Grid item xs={12} style={{marginBottom: '10px'}}>
                <b style={{fontSize: '1.2rem'}}>Overview</b><br/>
                <b style={{fontSize: '1.2rem'}}>{date}</b><br/>
                <React.Fragment>
                    <b style={{fontSize: '0.9rem'}}>
                        {data.isToday ? '오늘 업데이트되었습니다.' : `이전 데이터입니다.`}&nbsp;
                        {`(${dayjs(data.update).subtract(1,'day').format('YYYYMMDD')} 통계)`}
                    </b>
                    <IconButton color='primary' size='small' onClick={() => reloadFunc()}>
                        <Refresh/>
                    </IconButton>
                </React.Fragment>                                 
            </Grid>
            <Grid item xs={3} md={2} style={{color: 'red'}}>
                {renderResult('확진자', 
                data.totDef, 
                data.newDef > 0 ? data.newDef+'▲' : '-')}
            </Grid>
            <Grid item xs={3} md={2} style={{color: '#E3C510'}}>
                {renderResult('검사중', 
                data.totCheck, 
                data.isToday && (Math.abs(data.newCheck) + (data.newCheck >= 0 ? '▲' : '▼'))
                )}
            </Grid>
            <Grid item xs={3} md={2} style={{color: 'blue'}}>
                {renderResult('격리해제', 
                data.totClear, 
                data.newClear > 0 ? data.newClear+'▲' : '-')}  
            </Grid>
            <Grid item xs={3} md={2}>
                {renderResult('사망자', 
                data.totDeath, 
                data.newDeath > 0 ? data.newDeath+'▲' : '-')}
            </Grid>
        </Grid>
    )
}

export default KoreaTotalForm
