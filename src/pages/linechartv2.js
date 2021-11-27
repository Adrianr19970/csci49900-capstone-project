import React, { useEffect, useState } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import axios from 'axios'; 

const Line = ({ symbol, time }) => {

  const [price, setPrice] = useState([]);
  const [stock, setStock]= useState('');
  const [timeframe, setTime] = useState('');

  useEffect(() => {
    if(stock !== symbol ) {
      getchartInfo()
      setTime(time)
      setStock(symbol)
    }
    
    else if(timeframe !== time) {
      getchartInfo()
      setTime(time)
    }
    
    
  });

  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + symbol + '&interval=Day&start_date=' + time + '&end_date=&latest=', { mode: "no-cors",  }
    );
    console.log("LineChart called");
    console.log(stock);
    setPrice(priceAndDate.data.data);
  }

  return ( 
      <div>
          <CanvasJSChart id='line'
            options = { {
              exportEnabled: true,
              animationEnabled: true,
              height: 450,
              axisY: {
                title: "USD",
                prefix: "$"
              },
              axisY: {
                minimum: Math.min(...price.map(data => data.low)) / 1.1,
                maximum: Math.max(...price.map(data => data.high)) * 1.1,
                crosshair: {
                  enabled: true,
                  snapToDataPoint: true
                },
                prefix: "$",
              },
              axisX: {
                crosshair: {
                  enabled: true,
                  snapToDataPoint: true
                },
              },
              data: [{
                type: "line",
                yValueFormatString: "$#,###.##",
                dataPoints : price.map(price => ({
                  x: new Date(price.date),
                  y: Number(price.close)
                }))
              }],
              
            } }
          />
      </div> 
    );
};

export default Line;