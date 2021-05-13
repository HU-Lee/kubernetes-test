import { Button, Grid, IconButton, TextField } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'
import { Autocomplete } from '@material-ui/lab'
import { Refresh } from '@material-ui/icons'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'


function InterForm({ data, fromDB, reloadFunc }) {

    const [isSmall, setIsSmall] = useState(window.innerWidth < 400)

    const [CountryName, setCountryName] = useState('일본')
    const [inputValue, setInputValue] = useState('')

    const changeCountry = (data) => {
        
        if(inputValue && data.rankings.map(a => a.name).includes(inputValue)) {
            setCountryName(inputValue)
        } else {
            alert('유효하지 않은 국가명입니다!')
        }
    }

    const renderResult = (str1, str2, str3) => (
        <div>
            <b style={{fontSize: "0.8rem"}}>{str1}</b><br/>
            <b style={{fontSize: "1.1rem"}}>{new Intl.NumberFormat().format(str2)}</b><br/>
            <b style={{fontSize: "0.7rem"}}>{str3}</b>
        </div>
    );

    const onResize = (e) => {
        setIsSmall(e.target.innerWidth < 400)
    }

    useEffect(() => {
        window.addEventListener('resize', onResize)
    }, [])

    return (
        <div style={{display: 'flex', minHeight: '150px', alignItems: 'center', width:'100%', maxWidth:'800px', 
                        justifyContent: 'center', marginTop: '10px'}}>
            <Grid container style={{textAlign: 'center', width: '100%', maxWidth:'800px'}} justify='center' alignContent="center">
                <Grid item xs={12} style={{marginBottom: '10px'}}>
                    { fromDB 
                    ? <React.Fragment>
                        <b style={{fontSize: '0.9rem'}}>
                            {data.isToday ? 'DB의 오늘 데이터입니다.' : `DB의 이전 데이터입니다.`}&nbsp;
                            {`(${dayjs(data.update).subtract(1,'day').format('YYYYMMDD')} 통계)`}
                        </b>
                        <IconButton color='primary' size='small' onClick={() => reloadFunc()}>
                            <Refresh/>
                        </IconButton>
                    </React.Fragment>
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
                <Grid item xs={12} style={{marginBottom: '10px', marginTop: '10px'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Autocomplete id="combo-box-demo"
                            options={data.rankings}
                            freeSolo disableClearable
                            getOptionLabel={(option) => option.name}
                            renderOption={(option) => <span>{option.name}</span>}
                            style={{ width: 250 }}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                event.preventDefault()
                                setInputValue(newInputValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="국가 선택(기본값 : 일본)" variant="outlined"/>}
                        />
                        <Button onClick={(() => changeCountry(data))} variant="contained" color="primary" >Go!</Button>
                    </div>
                </Grid>            
                <Grid item xs={5} md={4} style={{color: 'red', backgroundColor: '#eeeeff', minHeight: '80px', display: 'flex'
                        , flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    {renderResult('확진자', 
                    data.rankings.find(a => a.name === CountryName).totDef, 
                    data.rankings.find(a => a.name === CountryName).newDef > 0 ? data.rankings.find(a => a.name === CountryName).newDef+'▲' : '-')}
                </Grid>
                <Grid item xs={5} md={4} style={{backgroundColor: '#eeeeff', minHeight: '80px', display: 'flex'
                        , flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    {renderResult('사망자', 
                    data.rankings.find(a => a.name === CountryName).totDeath, 
                    data.rankings.find(a => a.name === CountryName).newDeath > 0 ? data.rankings.find(a => a.name === CountryName).newDeath+'▲' : '-')}
                </Grid>
                <Grid item xs={12} style={{marginTop: '30px'}}>
                    <b style={{fontSize: '1.2rem'}}>TOP10 &amp; 확진자 Table</b><br/>
                </Grid>
                <Grid item xs={12} md = {6} style={{margin: '30px auto'}}>
                    <div width='100%' height={400}>
                        <BarChart width={isSmall ? 250 : 350} height={400} 
                        style={{margin: '0 auto'}}
                        layout="vertical"
                        data={data.rankings.slice(0,10)}>
                            <CartesianGrid stroke="#f5f5f5" />
                            <YAxis dataKey="name" type="category" style={{fontSize: `0.7rem`}}/>
                            <XAxis type="number" style={{fontSize: `0.7rem`}}/>
                            <Legend/>
                            <Tooltip/>
                            <Bar dataKey="newDef" name="확진자" fill="purple" maxBarSize={18}/>
                        </BarChart>
                    </div>
                </Grid>
                <Grid item xs={12} md = {6} style={{margin: '30px auto', width: '100%', minHeight: '400px'}}>
                    <DataGrid columns={[
                        {field: 'name', headerName: '국가', flex: 1},
                        {field: 'newDef', headerName: '확진자 수 (명)', flex: 1},
                    ]} rows={
                        data.rankings.map((a, index)=> ({
                            "id": index, 'name': a.name, 'newDef': a.newDef
                        }))
                    } autoPageSize/>
                </Grid>
            </Grid>                    
        </div>
    )
}

export default InterForm
