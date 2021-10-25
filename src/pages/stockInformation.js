import React from "react";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const StockInfo = ({close, open, high, low, volume, date}) => {
    return ( 
        <div style = {{
            marginLeft: '1%'
        }}>
            <h3>Open: ${open}</h3>
            <h3>Close: ${close}</h3>
            <h3>High: ${high}</h3>
            <h3>Low:   ${low}</h3>
            <h3>Volume: {volume}</h3>
            
        </div> 
    );
};

export default StockInfo;