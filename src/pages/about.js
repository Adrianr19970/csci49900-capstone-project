import React, { useState } from 'react';
import Whirligig from 'react-whirligig'
import background from './Sky.jpg';
import { Nav, NavLink, NavMenu} from '../components/Navbar/NavbarElements';
import { Form, FormControl, Button } from "react-bootstrap";
import Logo from '../components/Navbar/TradeBreath.gif';
import NewsItem from './newsItem';
import StockInformation from './stockInformation';
import Line from './linechartv2';
import axios, { Axios } from 'axios';
import './about.css';
import Adrian from './Adrian.png'
import Alex from './Alex.png'
import Diego from './Diego.png'
import Edwin from './Edwin.png'

import { CanvasJSChart } from 'canvasjs-react-charts';

import StockPic from './stock.jpeg'
import HunterPic from './hunter.jpg'

const About = () => {

  const [stockName, setStockName] = useState("");
  const [price, setPrice] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stock, setStock]= useState("");

  const [toggleLine, setLine] = useState("block");
  const [toggleCandle, setCandle] = useState("none");

  const [hidden, setHidden] = useState("block");
  const [show, setShowing] = useState("none");

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

  /*
  async function tbappChange() {
    try {
    let response = await axios.get('/tbapp/?stock=' + stock + '&interval=Day&start_date=2021-10-06&end_date=2021-10-10' , { mode: "no-cors" });
    let response = await axios.get("https://goweather.herokuapp.com/weather/"+ stock ); 
      settbapp(response);
      console.log(response.data); 
    }catch(error) {
      if(error.response) {
        console.log(error.response.data);
      }
    }
  }
  */

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
    console.log(res); 
    setHidden("none");
    setShowing("block");
    getStockInfo();
    getchartInfo();
    setStockName(stock);
    tbappChange();
  };

  const enterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log("Enter Pressed from About")
      getArticles();
    }
  };

  let whirligig
  const next = () => whirligig.next()
  const prev = () => whirligig.prev()

  return (
  <div id = "content">
    <div className="navBar-div">
    <Nav id ="navBar"
        style={{ 
        height: '90px',
        paddingTop: '0.5%',
        paddingBottom: '0.5%',
        backgroundImage: `url(${background})`,
        backgroundCover: `cover`,
        backgroundSize: '100% 100%',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000'
        }}
      >
        <img id="logo" src={Logo} />
 
        <NavMenu id="menu">

        <NavLink id="link" to='/index' activeStyle>
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


    <div 
      style ={{
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        overflow: 'auto',
        alignItems: 'center',
        height: 'auto',
        display: show
    }}>
        <h1 style = {{
          marginLeft: '10%'
        }}> 
          {stockName} 
        </h1>
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

        <br></br>

        <div className="databox">
          {
          stockInfo.map(({ close, open, high, low, volume }) => (
          <StockInformation
            open={open} 
            close={close}
            high={high}
            low={low}
            volume={volume}
          />
          ))}
        </div>

        <div style = {{
          marginLeft: '10%'
        }}>
          <h1>Recent News Articles: {stockName} </h1>
        </div>

          <div id='newsArticles'>
            <Whirligig className ='product-slider'
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

    <div style={{
      display: hidden
    }}>
    
    <div className ="one">
      <h1 className = "two">About Us</h1>
      <p className = "three">TradeBreath</p>
    </div>

    <div className = "four">
      
      <h1 className = "five">What is TradeBreath?</h1>
      <img className = "seven" src = {StockPic} alt = "decoPic"></img>
      <p className = "six"> TradeBreath is a finanicial website which provides stock information such as: open, close, high low, volume of the stock with the line chart and a candlestick chart. <br></br><br></br> Line chart provides the current price of the stock with the dates. Investor can filter the data by the periods of 3 months, 1 month, 7 days, or 1 day. <br></br><br></br> Candlestick chart provides the investor with the open price, close price, high price and a low price for the stock. <br></br><br></br> We want every investor to invest safe by providing the lastest news of the specific sotck along with the news from the stock market. </p>
      
      
    </div>

    <div className = "eight">
      
      <h1 className = "nine">Who We Are</h1>
      <p className = "eleven"> We are students from Hunter College and this website is a project for the class CSCI 49900.</p>
      <img className = "thirteen" src = {HunterPic} alt = "hunterPic"></img>
      
    </div>
      <div className = "twelve">
          <img className = "people" src = {Adrian} alt = "Adrian Ramirez"></img>
          <img className = "people" src = {Alex} alt = "Alex Jun"></img>
          <img className = "people" src = {Diego} alt = "Diego Kervabon"></img>
          <img className = "people" src = {Edwin} alt = "Edwin Zhu"></img>
      </div>








    {/* <div className = "container">
      <div className = "aboutContainer">
        <div className = "aboutTitle">
        <h1>TradeBreath</h1>
      </div>
        <img className = "stockPic" src = {StockPic} alt = "decoPic"></img>
        <div className = "aboutContent">
             <p> TradeBreath is a finanicial website which provides stock information such as: open, close, high low, volume of the stock with the line chart and a candlestick chart. <br></br><br></br> Line chart provides the current price of the stock with the dates. Investor can filter the data by the periods of 3 months, 1 month, 7 days, or 1 day. <br></br><br></br> Candlestick chart provides the investor with the open price, close price, high price and a low price for the stock. <br></br><br></br> We want every investor to invest safe by providing the lastest news of the specific sotck along with the news from the stock market. </p>
        </div>
      </div>
      
        
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <div className = "whoTitle">
        <h1>Who We Are</h1>
      </div>
        <img className = "hunterPic" src = {HunterPic} alt = "hunterPic"></img>
        <div className = "whoContent">
             <p> We are stduent of Hunter College and this website is a project for the class CSCI 49900.  </p>
        </div>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>


        <div className = "peopleContainer">
          <img className = "people" src = {Adrian} alt = "Adrian Ramirez"></img>
          <img className = "people" src = {Alex} alt = "Alex Jun"></img>
          <img className = "people" src = {Diego} alt = "Diego Kervabon"></img>
          <img className = "people" src = {Edwin} alt = "Edwin Zhu"></img>
        </div>
      </div>   */}

      </div>
    </div>
  );
};
  
export default About;