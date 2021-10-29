import React, { useEffect, useState } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import axios from 'axios'; 

const Line = ({ symbol }) => {

  const [price, setPrice] = useState([]);
  /* const [date, setDate] = useState([]); */
  const [stockInfo, setStockInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stock, setStock]= useState('');

  useEffect(() => {
    if(stock !== symbol) {
      getchartInfo()
      setStock(symbol)
    }
    
  });

  /*
  useEffect(() => {
  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      'https://api.marketstack.com/v1/eod?access_key=7ba49202483340bca37ab953c66b592c&symbols=' + symbol , { mode: "no-cors" }
    );
    setPrice(priceAndDate.data.data);
    };
    getchartInfo();
  },
  [null]);
  */

  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      'https://api.marketstack.com/v1/eod?access_key=7ba49202483340bca37ab953c66b592c&symbols=' + symbol , { mode: "no-cors" }
      
    );
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