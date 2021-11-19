import React from "react";

const previousStockInfo = ({close, open, high, low, volume}) => {
    return ( 
        <div style = {{
            marginLeft: '1%'
        }}>
            <h3>Yesterday's Open: ${open}</h3>
            <h3>Yesterday's Close: ${close}</h3>
            <h3>Yesterday's High: ${high}</h3>
            <h3>Yesterday's Low: ${low}</h3>
            <h3>Yesterday's Volume: {volume}</h3>
            
        </div> 
    );
};

export default previousStockInfo;