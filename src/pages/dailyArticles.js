import React, { useEffect, useState } from 'react';
import Whirligig from 'react-whirligig'
import NewsItem from './newsItem';
import TopNews from './topNews';
import axios from 'axios'; 

const DailyArticles = () => {

    const [articles, setArticles] = useState([]);
    
    useEffect(() => {
      // Getting articles. 
        const getArticles = async () => {
          const res = await axios.get(
            'https://stocknewsapi.com/api/v1/category?section=general&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy'
          );
          setArticles(res.data.data);
        };
        getArticles();
      },
    [null]);

    let whirligig
    const next = () => whirligig.next()
    const prev = () => whirligig.prev()

    return (
        <div style={{
          
        }}>
            <div id='article-title'>
                <h1>Top News Articles: </h1>
                
            </div>

            <div id='newsArticles'>
            <Whirligig className ='product-slider'
              visibleSlides={3}
              gutter="1em"
              ref={(_whirligigInstance) => { whirligig = _whirligigInstance}}
            >
              
              {articles.map(({ title, news_url, image_url, text, date}) => (
                <TopNews
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
    )
}

export default DailyArticles;