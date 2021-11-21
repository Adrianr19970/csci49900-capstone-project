import React, { useEffect, useState } from 'react';
import Whirligig from 'react-whirligig'
import './index.css'
import background from './Sky.jpg';
import DailyArticles from './dailyArticles';
import NewsItem from './newsItem';
import Line from './linechartv2';
import Candle from './candlechartv2';
import { Nav, NavLink, NavMenu} from '../components/Navbar/NavbarElements';
import { Form, FormControl, Button } from "react-bootstrap";
import StockInformation from './stockInformation';
import PreviousStockInfo from './previousStockInfo';
import axios from 'axios'; 

import Logo from '../components/Navbar/TradeBreath.gif';

import { CanvasJSChart } from 'canvasjs-react-charts';
import StockInfo from './stockInformation';

const Home = () => {

  const [stockName, setStockName] = useState("");
  const [currentStock, setCurrent] = useState("");
  const [price, setPrice] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [prevStockInfo, setPrevInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stock, setStock] = useState("TSLA");

  const [toggleLine, setLine] = useState("block");
  const [toggleCandle, setCandle] = useState("none");

  const [prevValidStock, setPrev] = useState("");
  const [check, setCheck] = useState([]);

  const [hidden, setHidden] = useState("block");
  const [hideError, setHideError] = useState("none");

  /*Time Frames*/

    var moment = require('moment-business-days');
   
    moment.updateLocale('us', {
      holidayFormat: 'YYYY-MM-DD'
    });

    /* ----------Dates Calculation---------- */
    const today = new Date(),
    time_now = today.getHours();

    var todayDate = new Date()
    todayDate.setDate(todayDate.getDate())
    var YYYY_today = todayDate.getFullYear();
    var mm_today = String(todayDate.getMonth() + 1). padStart(2, '0')
    var dd_today = String(todayDate.getDate()).padStart(2, '0')
    var formated_today = YYYY_today + '-' + mm_today + '-' + dd_today
    // console.log("Today's date: " + formated_today)
    
    var yesterday = new Date()
    var time_regulator = 1;
    /*if(time_now >= 18) {
      time_regulator = 1
    }
    if (time_now < 18 && time_now >= 8) {
      time_regulator = 2
    }
    */
    yesterday.setDate(yesterday.getDate() - time_regulator);
    var YYYY_yesterday = yesterday.getFullYear();
    var mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
    var dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
    var formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
    // console.log("Yesterday's date: " + formated_yesterday)
    
    var x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay()
    var y = formated_yesterday;
    var z = 0;
    for (let i = 0; i < 7; i++) {
      if (x == false)
      {
        yesterday.setDate(yesterday.getDate() - time_regulator);
        var YYYY_yesterday = yesterday.getFullYear();
        var mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
        var dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
        var formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
        var x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay();
      }
      else if (x == true && z == 0) {
        z = 1;
        yesterday.setDate(yesterday.getDate() - time_regulator);
        var YYYY_yesterday = yesterday.getFullYear();
        var mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
        var dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
        var formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
        var x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay();
        //y = formated_yesterday;
      }
      else if (x == true && z == 1) {
        y = formated_yesterday;
      }
    }
    // console.log("Previous Business Day date: " + formated_yesterday)

    var monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    var YYYY_monthAgo = monthAgo.getFullYear();
    var mm_monthAgo = String(monthAgo.getMonth() + 1). padStart(2, '0')
    var dd_monthAgo = String(monthAgo.getDate()).padStart(2, '0')
    var formated_monthAgo = YYYY_monthAgo + '-' + mm_monthAgo + '-' + dd_monthAgo
    // console.log("Month ago's date: " + formated_monthAgo)

    var threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    var YYYY_threeMonthsAgo = threeMonthsAgo.getFullYear();
    var mm_threeMonthsAgo = String(threeMonthsAgo.getMonth() + 1). padStart(2, '0')
    var dd_threeMonthsAgo = String(threeMonthsAgo.getDate()).padStart(2, '0')
    var formated_threeMonthsAgo = YYYY_threeMonthsAgo + '-' + mm_threeMonthsAgo + '-' + dd_threeMonthsAgo
    // console.log("Three month ago's date: " + formated_threeMonthsAgo)

    var sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    var YYYY_sixMonthsAgo = sixMonthsAgo.getFullYear();
    var mm_sixMonthsAgo = String(sixMonthsAgo.getMonth() + 1). padStart(2, '0')
    var dd_sixMonthsAgo = String(sixMonthsAgo.getDate()).padStart(2, '0')
    var formated_sixMonthsAgo = YYYY_sixMonthsAgo + '-' + mm_sixMonthsAgo + '-' + dd_sixMonthsAgo
    // console.log("Six month ago's date: " + formated_sixMonthsAgo)

    var yearAgo = new Date();
    yearAgo.setMonth(yearAgo.getMonth() -12)
    /*console.log("Year ago's date" + yearAgo)*/
    var YYYY_yearAgo = yearAgo.getFullYear();
    var mm_yearAgo = String(yearAgo.getMonth() + 1). padStart(2, '0')
    var dd_yearAgo = String(yearAgo.getDate()).padStart(2, '0')
    var formated_yearAgo = YYYY_yearAgo + '-' + mm_yearAgo + '-' + dd_yearAgo
    // console.log("Year ago's date: " + formated_yearAgo)

  const initialTime = formated_threeMonthsAgo;

  const [time, setTime] = useState(initialTime); 
  
  function stockChange(event){
    setStock(event.target.value.toUpperCase());
  } 

  let viewCandle = () => {
    setLine("none");
    setCandle("block");
  }

  let viewLine = () => {
    setLine("block");
    setCandle("none");
  }

  const checker = async () => {
      const response = await axios.get('https://stocknewsapi.com/api/v1?tickers=' + stock + '&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy')
      console.log(stock);
      setCheck(response.data.data);
      /*console.log(response.data.data);*/
      /*console.log(response.data.data.length);*/
      if (response.data.data.length === 0) {
        console.log("No data recieved")
        console.log("Invalid Stock Code: " + stock);
        /*console.log(check.length);*/
        setHideError("block");
        setStock(currentStock);
        setCheck([]);
      }
      else {
        setCheck([]);
        console.log("Data recieved")
        console.log("Valid Stock Code: " + stock);
        setCurrent(stock);
        setHideError("none");
        getArticles();
      }
  }

  useEffect(() => {
    setCurrent(stock);
    const getArticles = async () => {
      const res = await axios.get(
        'https://stocknewsapi.com/api/v1?tickers=TSLA&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
      );
      setArticles(res.data.data);
      /*console.log(articles.length);*/
      console.log("Getting News Articles");
      console.log(res);
      getStockInfo();
      getchartInfo();
      setStockName(stock);
    };
    getArticles();
    
  },
  [null]);

  const getStockInfo = async () => {
    const info = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=2021-10-11&end_date=&latest=/latest', { mode: "no-cors" }
    );
    setStockInfo(info.data.data);
    getPrevStockInfo();
    /*console.log(info);*/
  };

  const getPrevStockInfo = async () => {
    const prevInfo = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + formated_yesterday + '&end_date=&latest=/' + formated_yesterday, { mode: "no-cors" }
    );
    setPrevInfo(prevInfo.data.data);
  };

  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      /*'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=2020-10-30&end_date=&latest=', { mode: "no-cors",  }*/
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + time + '&end_date=&latest=', { mode: "no-cors",  }
      );
    setPrice(priceAndDate.data.data);
    console.log("Getting Chart Data");
    console.log(priceAndDate.data);
  }

  const getArticles = async () => {
    setPrev(stock);
    const res = await axios.get(
      'https://stocknewsapi.com/api/v1?tickers=' + stock + '&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
    );
    setArticles(res.data.data);
    setHidden("none");
    console.log("Getting News Articles");
    console.log(res); 
    getStockInfo();
    getchartInfo();
    setStockName(stock);
  };

  const back2Home = () => {
    setHidden("block");
  }

  const enterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log("Enter Pressed from Home")
      /*getArticles();*/
      checker();
    }
  };

  const updateChart = () => {
    getchartInfo();
  }

  const month = () => {
    console.log("Month called");
    console.log("Today's date: " + formated_today)
    console.log("Months ago's date: " + formated_monthAgo)
    setTime(formated_monthAgo); 
    /*Format YYYY-MM-DD*/
    updateChart();
  }

  const threemonths = () => {
    console.log("3 Months called");
    console.log("Today's date: " + formated_today)
    console.log("Three months ago's date: " + formated_threeMonthsAgo)
    setTime(formated_threeMonthsAgo); 
    /*Format YYYY-MM-DD*/
    updateChart();
  }

  const sixmonths = () => {
    console.log("6 Months called");
    console.log("Today's date: " + formated_today)
    console.log("Six months ago's date: " + formated_sixMonthsAgo)
    setTime(formated_sixMonthsAgo); 
    /*Format YYYY-MM-DD*/
    updateChart();
  }

  const oneYear = (e) => {
    console.log("1 Year called");
    console.log("Today's date: " + formated_today)
    console.log("Year ago's date: " + formated_yearAgo)
    setTime(formated_yearAgo); 
    /*Format YYYY-MM-DD*/
    updateChart();
  }


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
              /*onClick={getArticles}>*/
              onClick={checker}>
              Search 
            </Button>
          </Form>

          </NavMenu>
        </Nav>

        </div>
        
        <div style = {{
          textAlign: "center",
          background: "#fff",
          paddingTop: "0%",
          overflow: 'hidden',
          border: '1px solid #fff',
          borderLeft: 'none',
          borderRight: 'none',
          display: hideError
        }}>
          <h3 id='error-message'>Invalid Stock Code! Enter A Valid Stock Code!</h3>
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

          <hr style={{
            marginLeft: '0%',
            marginRight: '0%'
          }}></hr>

          <div id='newsArticles'>
            <div className='daily-News'>
              <DailyArticles></DailyArticles>
            </div>
          </div>
        </div>
    </div>
        
    <div id='chart-div'>
      <div id='chart-container'>
        <h1> {stockName} </h1>
        <div id='time-Frames'>
          <button onClick={month}>
            1 Month
          </button> 
          <button onClick={threemonths}>
            3 Months
          </button> 
          <button onClick={sixmonths}>
            6 Months
          </button> 
          <button onClick={oneYear}>
            1 Year
          </button>
          <p id = 'button_message'>*Double click on the button to update the chart properly.*</p>
        </div>

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
                  time={time}
                />
          ))}

          {/* ---------------------------------------------
          
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
          
          -------------------------------------------------*/}
          
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
        
        <br></br>

        <div id="data">
          <div id="metrics">
          {
          stockInfo.map(({ close, open, high, low, volume, dividend}) => (
          <StockInformation
            open={open} 
            close={close}
            high={high}
            low={low}
            volume={volume}
            dividend={dividend}
          />
          ))}
          </div>
          <div id="metrics">
          {
          prevStockInfo.map(({close, open, high, low, volume}) => (
          <PreviousStockInfo
            open={open} 
            close={close}
            high={high}
            low={low}
            volume={volume}
          />
          ))}
          {
            //<h3>{time_now}</h3>
            //<h3>{time_regulator}</h3>
            <h3>Prior Business Day: {y}</h3>
          }
          </div>
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