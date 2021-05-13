import { Tab, Tabs } from '@material-ui/core'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
    const [Value, setValue] = useState(location.pathname === '/' ? 0 : 1)
    

    const onChange = (e, value) => {
        setValue(value)
    }

    return (
        <Tabs value={Value} onChange={onChange} centered>
            <Tab label='국내 현황' component={Link} value={0} to='/'/>
            <Tab label='해외 현황' component={Link} value={1} to='/world'/>
        </Tabs>
    )
}

export default NavBar
