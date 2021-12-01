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

const Home = () => {
  // States that will be changed as the website is used. 
  const [stockName, setStockName] = useState("");
  const [currentStock, setCurrent] = useState("");
  const [price, setPrice] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [prevStockInfo, setPrevInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stock, setStock] = useState("TSLA");

  const [yearlow, setYearLow] = useState();
  const [yearHigh, setYearHigh] = useState();

  const [toggleLineAndCandle, setLineAndCandle] = useState("block");
  const [toggleVolume, setVolume] = useState("none");

  const [hidden, setHidden] = useState("block");
  const [hideButton, setHiddenButton] = useState("none");
  const [hideError, setHideError] = useState("none");

  const [linehide, setHideLine] = useState("line");
  const [candlehide, setHideCandle] = useState("");

  const [fixClick, setFixClick] = useState("")

  /*Time Frames*/

    // Sets up US business days and format of the dates.
    var moment = require('moment-business-days');
   
    moment.updateLocale('us', {
      holidayFormat: 'YYYY-MM-DD'
    });

    /* ----------Dates Calculation---------- */
    const today = new Date(), // New todays date.
    time_now = today.getHours() + ':' + today.getMinutes(); // Gets current hour.
    //var test = today.getHours() + ':' + today.getMinutes();

    var todayDate = new Date() // Sets a new variable to get todays date.
    todayDate.setDate(todayDate.getDate()) // Gets todays date.
    var YYYY_today = todayDate.getFullYear(); // Gets curretn year.
    var mm_today = String(todayDate.getMonth() + 1). padStart(2, '0') // Calculates curretn month.
    var dd_today = String(todayDate.getDate()).padStart(2, '0') // Calculates current month.
    var formated_today = YYYY_today + '-' + mm_today + '-' + dd_today // Formats date into the format the backend can read to retrieve date from the API.
    // console.log("Today's date: " + formated_today)
    
    var yesterday = new Date()
    var time_regulator = 1;
    yesterday.setDate(yesterday.getDate() - time_regulator);
    var YYYY_yesterday = yesterday.getFullYear();
    var mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
    var dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
    var formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
    // console.log("Yesterday's date: " + formated_yesterday)
    
    var x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay() 
    // Checks if the variable formated_yesterday is a business day or not.
    var wkend = 0; // Keeps track of non buswiness days.
    var mon;

    // Checks for the amount if business days over the past 7 days.
    // This updates the previous busniess day and it's metrics that are requested from the backend.
    for (let i = 0; i < 7; i++) {
      if (x == false) // Increases the counter of non-business days by one
      {
        wkend = wkend + 1;
        yesterday.setDate(yesterday.getDate() - time_regulator);
        YYYY_yesterday = yesterday.getFullYear();
        mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
        dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
        formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
        x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay();
      }
      else if (x == true && wkend > 2) // If wkend if more than 3, then it calculates dates as normal an extended weekend.
      {
        // Since the stock market has after-hours, metrics will update at 6pm.
        if(time_now >= '17:30') { 
          yesterday.setDate(yesterday.getDate() + 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
        }
        // If it's prior to 6pm, then the metrics will stay the same as the previous day until 6pm when the market closes.
        if (time_now < '17:30') {
          yesterday.setDate(yesterday.getDate() - 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
        }
      }
      else if (x == true && wkend == 2) { // If wkend is 2, then it calculates dates as normal weekend.
        if(time_now >= '17:30') {
          yesterday.setDate(yesterday.getDate());
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
        }
        if (time_now < '17:30') {
          yesterday.setDate(yesterday.getDate() - 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
        }
      }
      else if (x == true && wkend == 0) {
        if(time_now >= '17:30') {
          //formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          yesterday.setDate(yesterday.getDate());
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday          
          if(formated_yesterday == '2021-11-25') {
            yesterday.setDate(yesterday.getDate() - 1);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          }
          else {
            yesterday.setDate(yesterday.getDate());
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          }
          i = 7;
        }
        if (time_now < '17:30') {
            var monCheck = yesterday;
            monCheck.setDate(monCheck.getDate());
            var YYYY_monCheck = monCheck.getFullYear();
            var mm_monCheck = String(monCheck.getMonth() + 1). padStart(2, '0')
            var dd_monCheck = String(monCheck.getDate()).padStart(2, '0')
            var formated_monCheck = YYYY_monCheck + '-' + mm_monCheck + '-' + dd_monCheck
            mon = moment(formated_monCheck, 'YYYY-MM-DD').isBusinessDay();
          if(mon = false) {
            yesterday.setDate(yesterday.getDate() - 4);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
          }
          else {
            yesterday.setDate(yesterday.getDate() /*- 1*/);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            /*
            if(formated_yesterday == '2021-11-25' || prevStockInfo.data.data.length == 0) {
              yesterday.setDate(yesterday.getDate() - 1);
              YYYY_yesterday = yesterday.getFullYear();
              mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
              dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
              formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            }
            */
            //console.log(formated_yesterday)
          }
        }
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

  const initialTime = formated_threeMonthsAgo; // Sets 3 months ago as inital time frame to view stock data.

  const [time, setTime] = useState(initialTime); 
  
  function stockChange(event){ // Sets all inputs to uppercase
    setStock(event.target.value.toUpperCase());
  } 

  let viewVolumeChart = () => { // If the user presses the ViewCandle button, then it will hide the line chart.
    setVolume("block");
    setLineAndCandle("none");
    //setLine("none");
    //setCandle("block");
  }

  let viewLineAndCandleChart = () => { // If the user presses the Line Chart button, then the candlestick chart will be hidden.
    setLineAndCandle("block");
    setVolume("none");
    //setLine("block");
    //setCandle("none");
  }

  let pressCandle = () => { // If the user presses the ViewCandle button, then it will hide the line chart.
    setHideLine("");
    setHideCandle("candlestick");
    viewLineAndCandleChart();
  }

  let pressLine = () => { // If the user presses the Line Chart button, then the candlestick chart will be hidden.
    setHideCandle("");
    setHideLine("line");
    viewLineAndCandleChart();
  }

  let pressVolume = () => {
    viewVolumeChart();
  }

  let viewNews= () => { // If the user inputs a stock name, the overall news will be hidden to focus on the stock.
    setHidden("block");
    setHiddenButton("none");
  }

  // Checks if the stock code inputted by user exsits, if not an error message will appear. If it does it will retrieve stock data.
  const checker = async () => {
      const response = await axios.get('https://stocknewsapi.com/api/v1?tickers=' + stock + '&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy')
      console.log(stock);
      if (response.data.data.length === 0) {
        console.log("No data recieved")
        console.log("Invalid Stock Code: " + stock);
        setHideError("block");
        setStock(currentStock);
      }
      else {
        console.log("Data recieved")
        console.log("Valid Stock Code: " + stock);
        setCurrent(stock);
        setHideError("none");
        setHiddenButton("block");
        getArticles();
      }
  }

  // Used to get inital data for the stock Tesla when the page is loaded.
  useEffect(() => {
    setCurrent(stock);
    const getArticles = async () => {
      const res = await axios.get(
        'https://stocknewsapi.com/api/v1?tickers=TSLA&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
      );
      setArticles(res.data.data);
      console.log("Getting News Articles");
      console.log(res);
      getStockInfo();
      getchartInfo();
      setStockName(stock);
      oneYearHighAndLow();
    };
    getArticles();
    
  },
  [null]);

  // Retrieves stock metrics
  const getStockInfo = async () => {
    const info = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=2021-10-11&end_date=&latest=/latest', { mode: "no-cors" }
    );
    setStockInfo(info.data.data);
    getPrevStockInfo();
  };

  // Retireves stock metrics on the previous business day.
  const getPrevStockInfo = async () => {
    const prevInfo = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + formated_yesterday + '&end_date=&latest=/' + formated_yesterday, { mode: "no-cors" }
    );
    setPrevInfo(prevInfo.data.data);
  };

  // Gets stock info for the charts.
  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + time + '&end_date=&latest=', { mode: "no-cors",  }
      );
    setPrice(priceAndDate.data.data);
    console.log("Getting Chart Data");
    console.log(priceAndDate.data);
  }

  // Gets articles pertaining to the stock.
  const getArticles = async () => {
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
    oneYearHighAndLow();
  };

  const oneYearHighAndLow = async () => {
    const HighAndLow = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + formated_yearAgo + '&end_date=&latest=', { mode: "no-cors",  }
    );
    //console.log(HighAndLow.data);

    var temp = HighAndLow.data.data[0].low
    var temp2 = HighAndLow.data.data[0].high

    for (let t = 1; t < HighAndLow.data.data.length; t++) {
      if (HighAndLow.data.data[t].low < temp) {
          temp = HighAndLow.data.data[t].low
        }
      if (HighAndLow.data.data[t].high > temp2) {
          temp2 = HighAndLow.data.data[t].high
      }
    }

    setYearLow(temp);
    setYearHigh(temp2);
  }

  /*
  const [prevdate, setPrevdate] = useState("");
  const previousDay = () => {
    x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay()
    var prevbusinessday;
    var p = 0;

    for (let i = 0; i < 7; i++) {
      if(x == false) {
        yesterday.setDate(yesterday.getDate() - 1);
        YYYY_yesterday = yesterday.getFullYear();
        mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
        dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
        formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
        x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay();
      }
      else if (x == true && p == 1) {
        prevbusinessday = formated_yesterday;
        i = 7;
      }
      else if (x == true && p == 0) {
        p = 1;
        yesterday.setDate(yesterday.getDate() - 1);
        YYYY_yesterday = yesterday.getFullYear();
        mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
        dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
        formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
        x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay();
      }
    }

    setPrevdate(prevbusinessday);
  }
  */

  // If the user wants to see general news, they can press this button to make it appear.
  const back2Home = () => {
    setHidden("block");
  }

  // When the user clicks enter on the search bar, the check function is called to verify the stock code.
  const enterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log("Enter Pressed from Home")
      checker();
    }
  };

  // Updates chart data.
  const updateChart = () => {
    getchartInfo();
  }

  // When user clicks the month button, this calculates 1 months worth of chart data.
  const month = () => {
    console.log("Month called");
    console.log("Today's date: " + formated_today)
    console.log("Months ago's date: " + formated_monthAgo)
    setTime(formated_monthAgo); 
    /*Format YYYY-MM-DD*/
    setFixClick("1")
  }

  // When user clicks the 3 month button, this calculates 3 months worth of chart data.
  const threemonths = () => {
    console.log("3 Months called");
    console.log("Today's date: " + formated_today)
    console.log("Three months ago's date: " + formated_threeMonthsAgo)
    setTime(formated_threeMonthsAgo); 
    /*Format YYYY-MM-DD*/
    setFixClick("3")
  }

  // When user clicks the 6 month button, this calculates 6 months worth of chart data.
  const sixmonths = () => {
    console.log("6 Months called");
    console.log("Today's date: " + formated_today)
    console.log("Six months ago's date: " + formated_sixMonthsAgo)
    setTime(formated_sixMonthsAgo); 
    /*Format YYYY-MM-DD*/
    setFixClick("6")
  }

  // When user clicks the 1 year button, this calculates 1 year worth of chart data.
  const oneYear = (e) => {
    console.log("1 Year called");
    console.log("Today's date: " + formated_today)
    console.log("Year ago's date: " + formated_yearAgo)
    setTime(formated_yearAgo); 
    /*Format YYYY-MM-DD*/
    setFixClick("12")
  }

  // Initalizes the buttons for the news carusel.
  let whirligig
  const next = () => whirligig.next()
  const prev = () => whirligig.prev()

    // Fix to the double click issue. 
    useEffect(() => {
      getchartInfo();
    },
    [fixClick]);

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
        
    <div id='chart-div'> {/* Contains the stock charts, metrics, and stock news. */}
      <button id="toggle" style = {{
        display: hideButton
      }} 
      onClick={viewNews}>Back to News</button> {/* Button to view general news. */}
      <div id='chart-container'>
        <h1> {stockName} </h1>
        <div id='time-Frames'> {/* Time frame buttons to view stock data */}
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
        </div>

        <div style={{
            display: toggleVolume,
            marginLeft: '10%',
            marginRight: '10%',
            height: '25%',
            marginTop: '2%',
            marginBottom: '2%'
          }}>
        
        {/* Volume Chart */}
        <div>
        <CanvasJSChart
          options = { {
            exportEnabled: true,
            animationEnabled: true,
            height: 450,
            axisY: {
              title: "",
              prefix: ""
            },
            axisY: {
              minimum: Math.min(...price.map(data => data.volume)) / 1.1,
              maximum: Math.max(...price.map(data => data.volume)) * 1.1,
              crosshair: {
                enabled: true,
                snapToDataPoint: true
              },
              prefix: "",
            },
            axisX: {
              crosshair: {
                enabled: true,
                snapToDataPoint: true
              },
            },
            data: [{
              type: "area",
              yValueFormatString: "",
              color: "#2E2EFF",
              dataPoints : price.map(price => ({
                x: new Date(price.date),
                y: Number(price.volume)
              }))
            }],
            
          }
          /*{
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
              }*/
            }
          />
          </div>
          </div>

          <div style={{
            display: toggleLineAndCandle,
            marginLeft: '10%',
            marginRight: '10%',
            height: '25%',
            marginTop: '2%',
            marginBottom: '2%'
          }}>

          {/* Bar Chart is called from different file as both charts can't be initialized on the same page. */}
          {stockInfo.map(({ symbol }) => (
                <Line
                  symbol={symbol}
                  time={time}
                  displayLineChart={linehide}
                  displayCandleStickChart={candlehide}
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

          {/* Buttons to change charts */}
          <div id='buttons'>
          <button onClick={pressCandle/*viewCandle*/}
            id="candlesticks-button">Candlestick Chart
          </button> 
          <button onClick={pressLine/*viewLine*/}
            id="line-button">Line Chart
          </button> 
          <button onClick={pressVolume/*viewLine*/}
            id="volumechart-button" >Volume Based Chart
          </button> 
        </div>

      </div>
    </div>

      <div id='chart-div'>
        
        <br></br>

        {/* Current Stock metrics and previous business day metrics. */}
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
            <h3>52 Week Low: ${yearlow}</h3>
            <h3>52 Week High: ${yearHigh}</h3>
            {/*<h3>{test}</h3>*/}
          </div>
          <div id="metrics">
          {
            <h3>Prior Business Day: {formated_yesterday}</h3>
          }
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
          </div>
        </div>

        {/* Displays current stock name. */}
        <div id='product-article-title'>
          <h1>Recent News Articles: {stockName} </h1>
        </div>

        {/* Displays stock related news on a carousel. */}
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

            {/* Slider buttons to scroll through the 25 stock news articles.  */}
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