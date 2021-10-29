import React, { useEffect, useState } from 'react';
import Whirligig from 'react-whirligig'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './index.css'
import background from './Sky.jpg';
import DailyArticles from './dailyArticles';
import NewsItem from './newsItem';
import Line from './linechartv2';
import { Nav, NavLink, NavMenu} from '../components/Navbar/NavbarElements';
import { Form, FormControl, Button } from "react-bootstrap";
import StockInformation from './stockInformation';
import axios from 'axios'; 

import Logo from '../components/Navbar/TradeBreath.gif';

import { CanvasJSChart } from 'canvasjs-react-charts';

import { AxisConstantLineStyle } from 'devextreme-react/chart';
import ReactHighcharts from 'react-highcharts';
  
const Home = () => {

  const [stockName, setStockName] = useState("");
  const [price, setPrice] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stock, setStock]= useState("TSLA");

  const [toggleLine, setLine] = useState("block");
  const [toggleCandle, setCandle] = useState("none");

  /* const [block, setBlock] = useState("block") */
  const [hidden, setHidden] = useState("block");

  const dotenv = require('dotenv').config()
  const access_Key = process.env.REACT_APP_API_KEY
  
  function stockChange(event){
    setStock(event.target.value.toUpperCase());
  } 

  let viewCandle = () => {
    setLine("none");
    setCandle("block");
    console.log(toggleCandle);
  }

  let viewLine = () => {
    setLine("block");
    setCandle("none");
    console.log(toggleLine);
  }
  
  
  const [tbapp, settbapp]= useState("");
  const [found, setFound]= useState(false);

  
  async function tbappChange() {
    try {
    let response = await axios.get('https://young-harbor-33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=2021-09-21&end_date=2021-10-19')
    /*let response = await axios.get('/tbapp/?stock=' + stock + '&interval=Day&start_date=2021-10-06&end_date=2021-10-10' , { mode: "no-cors" });
    let response = await axios.get("https://goweather.herokuapp.com/weather/"+ stock ); */
      settbapp(response);
      console.log(stock); 
    }catch(error) {
      if(error.response) {
        console.log(stock);
      }
    }
  }
  

  useEffect(() => {
    const getArticles = async () => {
      const res = await axios.get(
        'https://stocknewsapi.com/api/v1?tickers=TSLA&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
      );
      setArticles(res.data.data);
      getStockInfo();
      getchartInfo();
      setStockName(stock);
      tbappChange();
    };
    getArticles();
    
  },
  [null]);

  const getStockInfo = async () => {
    const info = await axios.get (
      `https://api.marketstack.com/v1/eod/latest?access_key=${process.env.REACT_APP_API_KEY}&symbols=` + stock /*+ '&%20date_from=2021-10-15'*/ , { mode: "no-cors" }
    );
    setStockInfo(info.data.data);
    console.log(info);
  };

  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      `https://api.marketstack.com/v1/eod?access_key=${process.env.REACT_APP_API_KEY}&symbols=` + stock , { mode: "no-cors" }
    );
    setPrice(priceAndDate.data.data);
    console.log(priceAndDate.data);
  }

  const getArticles = async () => {
    const res = await axios.get(
      'https://stocknewsapi.com/api/v1?tickers=' + stock + '&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
    );
    setArticles(res.data.data);
    setHidden("none");
    console.log(res); 
    getStockInfo();
    getchartInfo();
    setStockName(stock);
    tbappChange();
  };

  const back2Home = () => {
    setHidden("block");
  }

  const enterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log("Enter Pressed from Home")
      getArticles();
    }
  };

  let whirligig
  const next = () => whirligig.next()
  const prev = () => whirligig.prev()

  return (
    <div id='content'>

      <div id='background'
      style={{ 
        backgroundImage: `url(${background})`,
        backgroundCover: `cover`,
        backgroundSize: '100% 100%',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000'
      }}>

        <div className="navBar-div">
          <Nav id ="navBar"
            style={{ 
            backgroundImage: `url(${background})`,
            backgroundCover: `cover`,
            backgroundSize: '100% 100%',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            height: '90px',
            paddingTop: '0.5%',
            paddingBottom: '0.5%'
          }}
        >
          <img id="logo" src={Logo} />
 
          <NavMenu id="menu">

          <NavLink id="link" to='/index' onClick={back2Home} activeStyle>
            Home
          </NavLink>
          <NavLink id="link" to='/products' activeStyle>
            Products
          </NavLink>
          <NavLink id="link" to='/about' activeStyle>
            About Us
          </NavLink>

          <Form inline id="searchBar">
              <FormControl type="text" autoComplete="off"
              id="searchBar" placeholder="Use Stock Codes (e.g. AAPL)"
              /* value={inputValue} */
               onChange={stockChange} 
               onKeyPress={enterKey}
          />

            <Button id="searchButton" 
              onClick={getArticles}>
              Search 
            </Button>
          </Form>

          </NavMenu>
        </Nav>

        </div>
      
        <div id='statement-and-articles'
        style={{
          paddingTop: '8%',
          paddingBottom: '2%',
          overflow: 'hidden',
          display: hidden,
          height: '100%'
        }}>
          <div id='statement'>
            <h1>Our mission is to let <br/> you invest safely</h1>
          </div>

          <hr></hr>

          <div id='newsArticles'>
            <DailyArticles></DailyArticles>
          </div>
        </div>
    </div>
        
    <div id='chart-div'>
      <div id='chart-container'>
        <h1> {stockName} </h1>
        <div style={{
            display: toggleCandle,
            marginLeft: '10%',
            marginRight: '10%',
            height: '25%',
            marginTop: '2%',
            marginBottom: '2%'
          }}>
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

          <div style={{
            display: toggleLine,
            marginLeft: '10%',
            marginRight: '10%',
            height: '25%',
            marginTop: '2%',
            marginBottom: '2%'
          }}>
          {stockInfo.map(({ symbol }) => (
                <Line
                  symbol={symbol}
                />
          ))}
          </div>

          <div id='buttons'>
          <button onClick={viewCandle}
            id="candlesticks-button">Candlestick Chart
          </button> 
          <button onClick={viewLine}
            id="line-button">Line Chart
          </button> 
        </div>

      </div>
    </div>

      <div id='chart-div'>
        <div id='chart-container'>
          

          <div className='linechart'>
            
            {/* 
          
              <HighchartsReact
                highcharts={Highcharts}
                
                options={{
                  yAxis: [{
                    offset: 30,
  
                      x: -20,
                      style: {
                        "color": "#000", "position": "absolute"
            
                      },
                      align: 'left'
                    },
                  ],
                  title: {
                    text: ''
                  },
                  plotOptions: {
                    series: {
                      showInNavigator: true,
                      gapSize: 6,
                
                    }
                  },
                  rangeSelector: {
                    selected: 1
                  },
                  chart: {
                    height: '60%',
                    width: 1400,
                  },
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  tooltip: {
                    valueDecimals: 2
                  },
                  series: [
                    {
                      
                      data: [
                            ['2021-10-13', 140.91],
                            ['2021-10-14', 140.99]
                          ]
                    }
                  ]
                }}
                >
              </HighchartsReact> */}
          </div>   
            
        </div>
        
        <br></br>

        <div id="data">
          {
          stockInfo.map(({ close, open, high, low, volume}) => (
          <StockInformation
            open={open} 
            close={close}
            high={high}
            low={low}
            volume={volume}
          />
          ))}
        </div>

        <div id='product-article-title'>
          <h1>Recent News Articles: {stockName} </h1>
        </div>

          <div id='product-article'>
            <Whirligig id ='product-news-slider'
              visibleSlides={3}
              gutter="1em"
              ref={(_whirligigInstance) => { whirligig = _whirligigInstance}}
            >
              {articles.map(({ title, news_url, image_url, text, date}) => (
                <NewsItem
                  title={title}
                  news_url={news_url}
                  image_url={image_url} 
                  text={text}
                  date={date}
                />
              ))}
            </Whirligig>

            <div className='buttons'>
              <button id="sliderbutton-prev" onClick={prev}>Prev</button>
              <button id='sliderbutton-next' onClick={next}>Next</button>
            </div>

          </div>
      </div>
              
    </div>
  );
};

export default Home;