import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import KoreaPartView from './Part/KoreaPartView';
import KoreaTotalView from './Part/KoreaTotalView';
import KoreaWeekView from './Part/KoreaWeekView';
import PropTypes from 'prop-types';

function MainPage() {
    const [Value, setValue] = useState(0)

    const onChange = (e, value) => {
        setValue(value)
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box p={3}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
    }

    TabPanel.propTypes = {
      children: PropTypes.node,
      index: PropTypes.any.isRequired,
      value: PropTypes.any.isRequired,
    };
    
    function a11yProps(index) {
      return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
      };
    }

    return (
        <div>
            <KoreaTotalView />
            <Tabs value={Value} onChange={onChange} indicatorColor='primary' textColor='primary' centered>
                <Tab label="주간 확진자 변화" {...a11yProps(0)} /> 
                <Tab label="지역별 확진 현황" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={Value} index={0}>
                <KoreaWeekView />
            </TabPanel>
            <TabPanel value={Value} index={1}>
                <KoreaPartView />
            </TabPanel>
        </div>
    )
}

export default MainPage


