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

  const [hidden, setHidden] = useState("block");
  const [show, setShowing] = useState("none");

  const [toggleLine, setLine] = useState("block");
  const [toggleCandle, setCandle] = useState("none");

  function stockChange(event){
    setStock(event.target.value.toUpperCase());
  } 

  function clickedStock(value){
    setStock(value);
    setStockName(stock);
    getArticles();
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

  const getStockInfo = async () => {
    const info = await axios.get (
      'https://api.marketstack.com/v1/eod/latest?access_key=7ba49202483340bca37ab953c66b592c&symbols=' + stock /*+ '&%20date_from=2021-10-15'*/ , { mode: "no-cors" }
    );
    setStockInfo(info.data.data);
    console.log(info);
  };

  const getchartInfo = async () => {
    const priceAndDate = await axios.get (
      'https://api.marketstack.com/v1/eod?access_key=7ba49202483340bca37ab953c66b592c&symbols=' + stock , { mode: "no-cors" }
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
    if (e.key === "Enter") {
      getArticles();
    }
  };

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
        marginBottom: '2%',
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

    <div id='list'>
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