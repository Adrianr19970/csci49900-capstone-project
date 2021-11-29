import React, { useEffect, useState } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import axios from 'axios'; 

const Line = ({ symbol, time, volume, displayLineChart, displayCandleStickChart}) => {

  const [price, setPrice] = useState([]);
  const [stock, setStock]= useState('');
  const [timeframe, setTime] = useState('');
  const [lineChart, setlinechart] = useState('');
  const [candlestickChart, setcandlestick] = useState('');
  // const [volume, setVolume] = useState([])
  var vol = [];

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
    if(lineChart !== displayLineChart) {
      setlinechart(lineChart);
    }
    if(candlestickChart !== displayCandleStickChart) {
      setcandlestick(candlestickChart);
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
            options = { /*{
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
              
            }*/
            {
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
              data: [
              {        
                type: displayCandleStickChart,//'candlestick',
                risingColor: "green",
                fillOpacity: .3,
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
              },
              {
                type: displayLineChart, //"line",
                yValueFormatString: "$#,###.##",
                fillOpacity: .3,
                color: "blue",
                dataPoints : price.map(price => ({
                x: new Date(price.date),
                y: Number(price.close)
                }))
              }
              ]
            }

          }
          />
      </div> 
    );
};

export default Line;