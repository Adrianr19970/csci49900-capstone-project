import React, { useState } from 'react';
import Whirligig from 'react-whirligig'
import background from './Sky.jpg';
import { Nav, NavLink, NavMenu} from '../components/Navbar/NavbarElements';
import { Form, FormControl, Button } from "react-bootstrap";
import Logo from '../components/Navbar/TradeBreath.gif';
import NewsItem from './newsItem';
import Line from './linechartv2';
import { CanvasJSChart } from 'canvasjs-react-charts';
import StockInformation from './stockInformation';
import axios, { Axios } from 'axios';
import './products.css';

  
const Home = () => {
  const [stockName, setStockName] = useState("");
  const [price, setPrice] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stock, setStock]= useState("");
  const [check, setCheck] = useState([]);

  const [hidden, setHidden] = useState("block");
  const [show, setShowing] = useState("none");
  const [hideError, setHideError] = useState("none");

  const [show_List, set_show_List] = useState("block")

  const [toggleLine, setLine] = useState("block");
  const [toggleCandle, setCandle] = useState("none");

  /*Time Frames*/

    /* ----------Dates Calculation---------- */

    var todayDate = new Date()
    todayDate.setDate(todayDate.getDate())
    var YYYY_today = todayDate.getFullYear();
    var mm_today = String(todayDate.getMonth() + 1). padStart(2, '0')
    var dd_today = String(todayDate.getDate()).padStart(2, '0')
    var formated_today = YYYY_today + '-' + mm_today + '-' + dd_today
    // console.log("Today's date: " + formated_today)
    
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

  const clickedStock = (value) => {
    setStock(value);
    setStockName(value);
    listCall();
  }

  const listCall = () => {
    setHideError("none");
    getArticles();
  }

  let viewCandle = () => {
    setLine("none");
    setCandle("block");
  }

  let viewLine = () => {
    setLine("block");
    setCandle("none");
  }

  let viewList = () => {
    setHidden("block");
    setShowing("none");
    set_show_List("block");
    setStock("");
  }

  const [tbapp, settbapp]= useState("");
  const [found, setFound]= useState(false);

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
      setCheck([]);
    }
    else {
      setCheck([]);
      console.log("Data recieved")
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
    /*console.log(info);*/
  };

  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      'https://young-harbor33717.herokuapp.com/tbapp/?stock=' + stock + '&interval=Day&start_date=' + time + '&end_date=&latest=', { mode: "no-cors",  }
    );
    setPrice(priceAndDate.data.data);
    console.log("Getting Chart Data");
    console.log(priceAndDate.data);
  }

  const getArticles = async () => {
    const res = await axios.get(
      'https://stocknewsapi.com/api/v1?tickers=' + stock + '&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
    );
    setArticles(res.data.data);
    console.log("Getting News Articles");
    console.log(res); 
    setHidden("none");
    setShowing("block"); 
    set_show_List("none");
    getStockInfo();
    getchartInfo();
    setStockName(stock);
  };
  
  const enterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log("Enter Pressed from Products")
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
    <div id='products'>
      
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
        marginBottom: '2%',
        overflow: 'auto',
        alignItems: 'center',
        height: 'auto',
        display: show
    }}>
        <button id="toggle" onClick={viewList}>Back to List</button>
        <h1 style = {{
          marginLeft: '10%'
        }}> 
          {stockName} 
        </h1>
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

    <div id='list' style = {{
      display: show_List,
    }}>
      <div id='products-title'>
        <h1> Products </h1>
      </div>

      <Form inline id="productSearchBar">
        <FormControl type="text" onChange={stockChange} id="productSearchBar" 
        autoComplete="off" placeholder="Use Stock Codes (e.g. AAPL)" onKeyPress={enterKey}/>
        <Button id="productSearchButton" onClick={getArticles}>
          Search
        </Button>   
        {/*}
        <FormControl type="text" placeholder="Filter" id="filterSearchBar" autoComplete="off"/>
        <Button id="productSearchButton">
          Filter
        </Button> 
        */}  
      </Form>
        
        <ul className='product-List'> 
          <li><button onClick={() => clickedStock("AAPL")}><p>Apple</p></button></li>
          <li><button onClick={() => clickedStock("AMZN")}><p>Amazon</p></button></li>
          <li><button onClick={() => clickedStock("AMC")}><p>AMC Entertainement</p></button></li>
          <li><button onClick={() => clickedStock("AMD")}><p>AMD</p></button></li>
          <li><button onClick={() => clickedStock("BA")}><p>Boeing</p></button></li>
          <li><button onClick={() => clickedStock("KO")}><p>Coca-Cola</p></button></li>
          <li><button onClick={() => clickedStock("COIN")}><p>Coinbase</p></button></li>
          <li><button onClick={() => clickedStock("DIS")}><p>Disney</p></button></li>
          <li><button onClick={() => clickedStock("GME")}><p>Gamestop</p></button></li>
          <li><button onClick={() => clickedStock("MSFT")}><p>Microsoft</p></button></li>
          <li><button onClick={() => clickedStock("MRNA")}><p>Moderna</p></button></li>
          <li><button onClick={() => clickedStock("NFLX")}><p>Netflix</p></button></li>
          <li><button onClick={() => clickedStock("NKE")}><p>Nike</p></button></li>
          <li><button onClick={() => clickedStock("NIO")}><p>NIO</p></button></li>
          <li><button onClick={() => clickedStock("NVDA")}><p>NVDIA</p></button></li>
          <li><button onClick={() => clickedStock("RYCEY")}><p>Rolls-Royce</p></button></li>
          <li><button onClick={() => clickedStock("LUV")}><p>Southwest Airlines</p></button></li>
          <li><button onClick={() => clickedStock("SONY")}><p>Sony</p></button></li>
          <li><button onClick={() => clickedStock("SBUX")}><p>Starbucks</p></button></li>
          <li><button onClick={() => clickedStock("TSLA")}><p>Tesla</p></button></li>
          <li><button onClick={() => clickedStock("TWTR")}><p>Twitter</p></button></li>
          <li><button onClick={() => clickedStock("UBER")}><p>Uber</p></button></li>
          <li><button onClick={() => clickedStock("WMT")}><p>Walmart</p></button></li>
          <li><button onClick={() => clickedStock("ZM")}><p>Zoom</p></button></li>
        </ul>
      </div>
    </div>
  );
};
  
export default Home;