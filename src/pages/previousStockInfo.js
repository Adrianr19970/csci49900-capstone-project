import React from "react";

const previousStockInfo = ({close, open, high, low, volume}) => {
    return ( 
        <div style = {{
            marginLeft: '1%'
        }}>
            <h3>Previous Open: ${open}</h3>
            <h3>Previous Close: ${close}</h3>
            <h3>Previous High: ${high}</h3>
            <h3>Previous Low: ${low}</h3>
            <h3>Previous Volume: {volume}</h3>
            
        </div> 
    );
};

export default previousStockInfo;