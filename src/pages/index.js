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
  const [currentStock, setCurrent] = useState("TSLA");
  const [price, setPrice] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [prevStockInfo, setPrevInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stock, setStock] = useState("TSLA");

  const [Data, setData] = useState([]);
  const [y1, sety1] = useState();
  const [y2, sety2] = useState();

  const [movement, setMovement] = useState("none");
  const [upMovement, setUpMovement] = useState("none");
  const [downMovement, setDownMovement] = useState("none");

  const [yearlow, setYearLow] = useState();
  const [yearHigh, setYearHigh] = useState();

  const [toggleLineAndCandle, setLineAndCandle] = useState("block");
  const [toggleVolume, setVolume] = useState("none");

  const [hidden, setHidden] = useState("block");
  const [hideButton, setHiddenButton] = useState("none");
  const [hideError, setHideError] = useState("none");
  const [hideTimeFrames, setHideTimeFrames] = useState("block");
  const [view, setView] = useState("3 Months");

  const [linehide, setHideLine] = useState("line");
  const [candlehide, setHideCandle] = useState("");
  const [scatterhide, setScatter] = useState("");
  const [forecasthide, setForecast] = useState("");

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
    var hour_now = Number(today.getHours());
    var min_now = Number(today.getMinutes());

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
    var dayName = yesterday.toLocaleString("default", { weekday: "long" });
    var todaydayName = todayDate.toLocaleString("default", { weekday: "long" });
    // console.log("Yesterday's date: " + formated_yesterday)
    
    var x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay() 
    // Checks if the variable formated_yesterday is a business day or not.
    var wkend = 0; // Keeps track of non buswiness days.
    var mon;
    var test;

    // Checks for the amount if business days over the past 7 days.
    // This updates the previous busniess day and it's metrics that are requested from the backend.
    for (let i = 0; i < 7; i++) {
      if (x == false && todaydayName == "Sunday") {
        //wkend = wkend + 1;
        yesterday.setDate(yesterday.getDate() - 2);
        YYYY_yesterday = yesterday.getFullYear();
        mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
        dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
        formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
        x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay();
      }
      if (x == false && todaydayName == "Saturday") {
        //wkend = wkend + 1;
        yesterday.setDate(yesterday.getDate() - 1);
        YYYY_yesterday = yesterday.getFullYear();
        mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
        dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
        formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
        x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay();       
      }

      if (x == false && todaydayName == "Monday") {
        //wkend = wkend + 1;
        yesterday.setDate(yesterday.getDate() - 3);
        YYYY_yesterday = yesterday.getFullYear();
        mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
        dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
        formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
        x = moment(formated_yesterday, 'YYYY-MM-DD').isBusinessDay();
        if (hour_now == 17 /*&& min_now >= 30 time_now >= '17:30'*/) {
          if (min_now >= 30) {
            yesterday.setDate(yesterday.getDate() + 1);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Monday 5:30pm or past 5:30pm"
          }
          else {
            yesterday.setDate(yesterday.getDate());
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Monday before 5:30pm"
          }
        }
        else if (hour_now > 17) {
          yesterday.setDate(yesterday.getDate() + 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Monday past 6pm"
        }
        else if (hour_now < 17) {
          yesterday.setDate(yesterday.getDate());
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Monday before 5:30pm!"
        }
      }

      //
      if (x == true && dayName == "Monday") {
        if (hour_now == 17 ) {
          if (min_now >= 30) {
            yesterday.setDate(yesterday.getDate());
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Tuesday 5:30pm or past 5:30pm"
          }
          else {
            yesterday.setDate(yesterday.getDate() - 3);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Tuesday before 5:30pm"
          }
        }
        else if (hour_now > 17) {
          yesterday.setDate(yesterday.getDate());
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Tuesday past 6pm"
        }
        else if (hour_now < 17 /*&& min_now < 30 time_now < '17:30'*/) {
          yesterday.setDate(yesterday.getDate() - 3 /*- 1*/);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Tuesday before 5:30pm!"
        }
      }
      
      if (x == true && dayName == "Tuesday") {
        if (hour_now == 17 /*&& min_now >= 30 time_now >= '17:30'*/) {
          if (min_now >= 30) {
            yesterday.setDate(yesterday.getDate());
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Wednesday 5:30pm or past 5:30pm"
          }
          else {
            yesterday.setDate(yesterday.getDate() - 1);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Wednesday before 5:30pm"
          }
        }
        else if (hour_now > 17) {
          yesterday.setDate(yesterday.getDate());
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Wednesday past 6pm"
        }
        else if (hour_now < 17 /*&& min_now < 30 time_now < '17:30'*/) {
          yesterday.setDate(yesterday.getDate() - 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Wednesday before 5:30pm"
        }
      }
      if (x == true && dayName == "Wednesday") {
        if (hour_now == 17 /*&& min_now >= 30 time_now >= '17:30'*/) {
          if (min_now >= 30) {
            yesterday.setDate(yesterday.getDate());
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Thursday 5:30pm or past 5:30pm"
          }
          else {
            yesterday.setDate(yesterday.getDate() - 1);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Thursday before 5:30pm"
          }
        }
        else if (hour_now > 17) {
          yesterday.setDate(yesterday.getDate());
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Thursday past 6pm"
        }
        else if (hour_now < 17 /*&& min_now < 30 time_now < '17:30'*/) {
          yesterday.setDate(yesterday.getDate() - 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Thursday before 5:30pm"
        }
      }
      if (x == true && dayName == "Thursday") {
        if (hour_now == 17 /*&& min_now >= 30 time_now >= '17:30'*/) {
          if (min_now >= 30) {
            yesterday.setDate(yesterday.getDate());
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Friday 5:30pm or past 5:30pm"
          }
          else {
            yesterday.setDate(yesterday.getDate() - 1);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Friday before 5:30pm"
          }
        }
        else if (hour_now > 17) {
          yesterday.setDate(yesterday.getDate());
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Friday past 6pm"
        }
        else if (hour_now < 17 /*&& min_now < 30 time_now < '17:30'*/) {
          yesterday.setDate(yesterday.getDate() - 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Friday before 5:30pm"
        }
      }
      if (x == true && dayName == "Friday") {
        if (hour_now == 17 /*&& min_now >= 30 time_now >= '17:30'*/) {
          if (min_now >= 30) {
            yesterday.setDate(yesterday.getDate() - 1);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Monday 5:30pm or past 5:30pm"
          }
          else {
            yesterday.setDate(yesterday.getDate() - 1);
            YYYY_yesterday = yesterday.getFullYear();
            mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
            dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
            formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
            i = 7;
            test = "It's Monday before 5:30pm"
          }
        }
        else if (hour_now > 17) {
          yesterday.setDate(yesterday.getDate() - 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Monday past 6pm"
        }
        else if (hour_now < 17 /*&& min_now < 30 time_now < '17:30'*/) {
          yesterday.setDate(yesterday.getDate() - 1);
          YYYY_yesterday = yesterday.getFullYear();
          mm_yesterday = String(yesterday.getMonth() + 1). padStart(2, '0')
          dd_yesterday = String(yesterday.getDate()).padStart(2, '0')
          formated_yesterday = YYYY_yesterday + '-' + mm_yesterday + '-' + dd_yesterday
          i = 7;
          test = "It's Monday before 5:30pm"
        }
      }
    } 

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
    setHideTimeFrames("block");

    setMovement("none");
  }

  let viewLineAndCandleChart = () => { // If the user presses the Line Chart button, then the candlestick chart will be hidden.
    setLineAndCandle("block");
    setVolume("none");
  }

  let pressCandle = () => { // If the user presses the ViewCandle button, then it will hide the line chart.
    setHideLine("");
    setScatter("");
    setForecast("");
    setHideCandle("candlestick");
    setHideTimeFrames("block");
    viewLineAndCandleChart();

    setMovement("none");
  }

  let pressLine = () => { // If the user presses the Line Chart button, then the candlestick chart will be hidden.
    setHideCandle("");
    setScatter("");
    setForecast("");
    setHideLine("line");
    setHideTimeFrames("block");
    viewLineAndCandleChart();

    setMovement("none");
  }

  let pressForecast = () => { // If the user presses the Forecast Chart button, other charts will be hidden along with time frame buttons.
    oneYear();
    setHideTimeFrames("none");
    setVolume("none");
    setLineAndCandle("block");
    setHideCandle("");
    setHideLine("");
    setScatter("scatter");
    setForecast("line");

    setMovement("block");
  }

  let pressVolume = () => { // If the user press the Volume Chart, other charts will be hidden.
    viewVolumeChart();
  }

  let viewNews= () => { // If the user inputs a stock name, the overall news will be hidden to focus on the stock.
    setHidden("block");
    setHiddenButton("none");
  }

  // Checks if the stock code inputted by user exsits, if not an error message will appear. If it does it will retrieve stock data.
  const checker = async () => {
      let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if(spChars.test(stock) == true) {
        console.log("No data recieved")
        console.log("Invalid Stock Code: " + stock);
        setHideError("block");
        setStock(currentStock);
      }
      else if (/\s/.test(stock)) {
        console.log("No data recieved")
        console.log("Invalid Stock Code: Spaces Detected");
        setHideError("block");
        setStock(currentStock);
      }
      else {
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
  }

  // Used to get inital data for the stock Tesla when the page is loaded.
  useEffect(() => {
    
    setCurrent(stock);
    const getArticles2 = async () => {
      const res = await axios.get(
        'https://stocknewsapi.com/api/v1?tickers=TSLA&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
      );
      setArticles(res.data.data);
      console.log("Getting News Articles");
      getStockInfo();
      //getchartInfo();
      setStockName(stock);
      oneYearHighAndLow();
      MLForecast();
    };
    getArticles2();
    
  },
  [null]);

  // Retrieves stock metrics
  const getStockInfo = async () => {
    const info = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=2021-10-11&end_date=&latest=/latest', { mode: "no-cors" }
    );
    setStockInfo(info.data.data);
    getPrevStockInfo();

    var temp = JSON.stringify(info.data.data);
    setData(temp);
    setData(Data);
  };

  // Retireves stock metrics on the previous business day.
  const getPrevStockInfo = async () => {
    const prevInfo = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + formated_yesterday + '&end_date=&latest=/' + formated_yesterday, { mode: "no-cors" }
    );
    setPrevInfo(prevInfo.data.data);

    var temp = JSON.stringify(prevInfo.data.data);
    setData(temp);
    setData(Data);
  };

  // Gets stock info for the charts.
  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + time + '&end_date=&latest=', { mode: "no-cors",  }
      );
    setPrice(priceAndDate.data.data);
    console.log("Getting Chart Data");

    var temp = JSON.stringify(priceAndDate.data.data);
    setData(temp);
    setData(Data);
  }

  // Gets articles pertaining to the stock.
  const getArticles = async () => {
    const res = await axios.get(
      'https://stocknewsapi.com/api/v1?tickers=' + stock + '&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
    );
    setArticles(res.data.data);
    setHidden("none");
    console.log("Getting News Articles");
    getStockInfo();
    getchartInfo();
    setStockName(stock);
    oneYearHighAndLow();
    MLForecast();
  };

  // Gets one year high and low. 
  const oneYearHighAndLow = async () => {
    const HighAndLow = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + formated_yearAgo + '&end_date=&latest=', { mode: "no-cors",  }
    );

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

  // Will send currert Stock to backend and will get Forecasting data
  const MLForecast = async () => {
    const forecast = await axios.get (
      'https://doraboots99.herokuapp.com/tbapp/?stock=' + stock, { mode: "no-cors",  }
    );
    var temp = [];
    var temp2;
    var temp3;
    var y1;
    var y2;
    
    temp = forecast.data;
    //console.log(temp);

    // Gets y1 and y2 for the Forecasting Chart
    for (let i = temp.length; i > 0; i--) {
      if (temp[i] == '[') {
        temp2 = temp.slice(i + 1, temp.length);
        i = 0;
        for (let j = temp2.length; j > 0; j--) {
          if (temp2[j] == ']') {
            temp2 = temp2.slice(i, temp2.length - 1);
            j = 0;
          }

          for (let z = temp2.length; z > 0; z--) {
            if (temp2[z] == ',') {
              y2 = temp2.slice(z + 2, temp2.length - 1);
              z = 0;
            }
          }

          for (let x = temp2.length; x > 0; x--) {
            if (temp2[x] == '(') {
              temp3 = temp2.slice(0 , x - 2)
              x = 0;
            }
          }

          for (let y = temp3.length; y > 0; y--) {
            if (temp3[y] == ',') {
              y1 = temp3.slice(y + 2, temp3.length - 1);
              y = 0;
            }
          }

        }
      }
    }  

    y2 = Number(y2);
    y2 = Math.round((y2 + Number.EPSILON) * 100) / 100;

    y1 = Number(y1);
    y1 = Math.round((y1 + Number.EPSILON) * 100) / 100;

    sety1(y1);
    sety2(y2);

    if(y1 < y2) {
      setUpMovement("block");
      setDownMovement("none");
    }
    if(y1 > y2) {
      setUpMovement("none");
      setDownMovement("block");
    }
  }

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
    setView("1 Month");
    /*Format YYYY-MM-DD*/
    setFixClick("1");
  }

  // When user clicks the 3 month button, this calculates 3 months worth of chart data.
  const threemonths = () => {
    console.log("3 Months called");
    console.log("Today's date: " + formated_today)
    console.log("Three months ago's date: " + formated_threeMonthsAgo)
    setTime(formated_threeMonthsAgo); 
    setView("3 Months");
    /*Format YYYY-MM-DD*/
    setFixClick("3")
  }

  // When user clicks the 6 month button, this calculates 6 months worth of chart data.
  const sixmonths = () => {
    console.log("6 Months called");
    console.log("Today's date: " + formated_today)
    console.log("Six months ago's date: " + formated_sixMonthsAgo)
    setTime(formated_sixMonthsAgo); 
    setView("6 Months");
    /*Format YYYY-MM-DD*/
    setFixClick("6")
  }

  // When user clicks the 1 year button, this calculates 1 year worth of chart data.
  const oneYear = () => {
    console.log("1 Year called");
    console.log("Today's date: " + formated_today)
    console.log("Year ago's date: " + formated_yearAgo)
    setTime(formated_yearAgo); 
    setView("1 Year");
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
            Stocks
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
          <h3 id='error-message'>Special Characters, Spaces, or Invalid Stock Code Entered! Enter A Valid Stock Code! 
          <br/> You can still view current stock data!</h3>
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
        <h3 style = {{
          marginLeft: '10%'
        }} >View: {view}</h3>
        <div id='time-Frames' style = {{
          display: hideTimeFrames
        }}> {/* Time frame buttons to view stock data */}
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
                  displayScatterChart={scatterhide}
                  displayForecastingChart={forecasthide}
                  y1={y1}
                  y2={y2}
                />
          ))}
          
          </div>
          
          <div style={{display: movement}}>
            <div style={{display: 'flex', marginTop: '0%'}}>
              <h3 style={{
              marginLeft: '10%',
              display: upMovement
              }}> Forecast (Based on Year Long Data): General Upward Movement <b id='movement' style={{color: 'green'}}> &uarr; </b> 
              </h3>
            </div>

            <div style={{display: 'flex', marginTop: '0%'}}>
              <h3 style={{
              marginLeft: '10%',
              display: downMovement
              }}> Forecast (Based on Year Long Data): General Downward Movement <b id='movement' style={{color: 'red'}}> &darr; </b> 
              </h3>
            </div>
          </div>

          {/* Buttons to change charts */}
          <div id='buttons'>
          <button onClick={pressCandle}
            id="candlesticks-button">Candlestick Chart
          </button> 
          <button onClick={pressLine}
            id="line-button">Line Chart
          </button> 
          <button onClick={pressVolume}
            id="volumechart-button" >Volume Based Chart
          </button> 
          <button onClick={pressForecast}
            id="forecasting-button">
            Stock Forecasting
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
          stockInfo.map(({ close, open, high, low, volume}) => (
          <StockInformation
            open={open} 
            close={close}
            high={high}
            low={low}
            volume={volume}
            yearlow={yearlow}
            yearHigh={yearHigh}
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
            formated_yesterday={formated_yesterday}
          />
          ))}
          { 
            //<h3>{test}</h3>
           //<h3>{testData}</h3>
          }
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