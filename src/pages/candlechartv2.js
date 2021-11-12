import React, { useEffect, useState } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import axios from 'axios'; 

const Candle = ({ symbol, time }) => {

  const [price, setPrice] = useState([]);
  /* const [date, setDate] = useState([]); */
  const [stockInfo, setStockInfo] = useState([]);
  const [articles, setArticles] = useState([]);
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
      /*'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + symbol + '&interval=Day&start_date=2020-10-30&end_date=&latest=', { mode: "no-cors" }*/
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + symbol + '&interval=Day&start_date=' + time + '&end_date=&latest=', { mode: "no-cors",  }
    );
    console.log("CandleChart called");
    console.log(stock);
    setPrice(priceAndDate.data.data);

    // console.log(time);
  }

  return ( 
      <div>
          <CanvasJSChart
          options = { {
            theme: "light1",
            exportEnabled: true,
            animationEnabled: true,
            height: 450,
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
              scaleBreaks: {
                spacing: 0,
                fillOpacity: 0,
                lineThickness: 0,
                customBreaks: price.reduce((breaks, value, index, array) => {
                    if (index === 0) return breaks;

                    const currentDataPointUnix = Number(new Date(value.date));
                    const previousDataPointUnix = Number(new Date(array[index - 1].date));

                    const oneDayInMs = 86400000;

                    const difference = previousDataPointUnix - currentDataPointUnix;

                    return difference === oneDayInMs
                        ? breaks
                        : [
                            ...breaks,
                            {
                                startValue: currentDataPointUnix,
                                endValue: previousDataPointUnix - oneDayInMs
                            }
                        ]
                  }, [])
                }
              },
                data: [{
                  type: 'candlestick',
                  risingColor: "green",
                  fallingColor: "#E40A0A",
                  dataPoints: price.map(price => ({
                      x: new Date(price.date),
                      y: [
                        price.open,
                        price.high,
                        price.low,
                        price.close
                    ]
                  }))
                }],
          
              }
            }
          />
      </div> 
    );
};

export default Candle;