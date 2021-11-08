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
import adrian from './Adrian.png'
import alex from './Alex.png'
import diego from './Diego.png'
import edwin from './Edwin.png'

import { CanvasJSChart } from 'canvasjs-react-charts';

import StockPic from './stock.jpeg'
import HunterPic from './hunter.jpg'

const About = () => {

  const [stockName, setStockName] = useState("");
  const [price, setPrice] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stock, setStock]= useState("");
  const [check, setCheck] = useState([]);

  const [toggleLine, setLine] = useState("block");
  const [toggleCandle, setCandle] = useState("none");

  const [hidden, setHidden] = useState("block");
  const [show, setShowing] = useState("none");
  const [hideError, setHideError] = useState("none");

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

  const checker = async () => {
    const response = await axios.get('https://stocknewsapi.com/api/v1?tickers=' + stock + '&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy')
    console.log(stock);
    setCheck(response.data.data);
    console.log(response.data.data);
    console.log(response.data.data.length);
    if (response.data.data.length === 0) {
      console.log("Invalid Stock Code: " + stock);
      console.log(check.length);
      setHideError("block");
      setCheck([]);
    }
    else {
      setCheck([]);
      console.log("Valid Stock Code: " + stock);
      setHideError("none");
      getArticles();
    }
  }

  const getStockInfo = async () => {
    const info = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=2020-10-30&end_date=&latest=/latest', { mode: "no-cors" }
    );
    setStockInfo(info.data.data);
    console.log(info);
  };

  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=2020-10-30&end_date=&latest=', { mode: "no-cors" }
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
  };

  const enterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log("Enter Pressed from About")
      /*getArticles();*/
      checker();
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
    
    <div className = "aboutPage">
      {/* Full height image header */}
      <div class = "firstPortion">
        <div class = "firstTitleandSub"> 
          <h1 class = "h1Title">TradeBreath</h1>
          <p class = "firstSubTitle">Finanical News For Your Safe Investment</p>
        </div>
      </div> 

      {/* About Section */}
      <div class = "secondPortion">
        <h3 class = "h3Title">About TradeBreath</h3>
        <p class = "explain">Our mission is to make you invest safer by providing you with our key features.</p>
        <p class = "secondSub">Key Features of TradeBreath</p>

        <div class = "symbolContainer">
          <div class = "column">
            <img src = "https://cdn-icons-png.flaticon.com/128/876/876225.png" height = "100px" width = "100px"/>
            <p class = "symbolTitle">Line Chart</p>         
            <p class = "symbolExpain">We provide line chart which shows closing stock price for each of the day for a year.</p>  
          </div>

          <div class = "column">
            <img src = "https://cdn-icons-png.flaticon.com/512/31/31358.png" height = "100px" width = "100px"/>  
            <p class = "symbolTitle">Candlestick Chart</p>           
            <p class = "symbolExpain">We provide candlestick chart which shows open, high, low, close for each of the day for a year.</p>  
          </div>

          <div class = "column">
            <img src = "https://cdn-icons.flaticon.com/png/128/2537/premium/2537926.png?token=exp=1636339923~hmac=b3478463ccdbc50e4ea881ab0265bcf1" height = "100px" width = "100px"/>  
            <p class = "symbolTitle">Recent News Articles</p>       
            <p class = "symbolExpain">We provide top news articles for the day and the recent news articles for a searched stock. </p>      
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div class = "thirdPortion">
        <h3 class = "h3Title">Team Members</h3>
        <div class = "peopleContainer">
          <div class = "columns">
            <img src = {adrian}/>
            <p class = "personName">Adrian Ramirez</p>    
            <p class = "poersonComent">"Blah Blah Blah"</p>    
          </div>

          <div class = "columns">
            <img src = {alex}/>
            <p class = "personName">Alex Jun</p>  
            <p class = "poersonComent">"Blah Blah Blah"</p>      
          </div>

          <div class = "columns">
            <img src = {diego}/>
            <p class = "personName">Diego Kervabon</p>    
            <p class = "poersonComent">"Blah Blah Blah"</p>    
          </div>

          <div class = "columns">
            <img src = {edwin}/>
            <p class = "personName">Edwin Zhu</p>  
            <p class = "poersonComent">"Blah Blah Blah"</p>      
          </div>
        </div>
      </div>

      {/* Who We Are Section */}    
      <div class = "fourthPortion">
        <h3 class = "h3Title">Who We Are</h3>
        <p class = "explain">We are stduent of Hunter College and this website is a project for the class CSCI 49900.</p>
        
        <div class = "hunterPic">
          <img src = "https://d92mrp7hetgfk.cloudfront.net/images/sites/misc/cunyhunter-1/standard.png?1548463925"/>
        </div>
      </div>
    
    
    </div>

      </div>
    </div>
  );
};
  
export default About;