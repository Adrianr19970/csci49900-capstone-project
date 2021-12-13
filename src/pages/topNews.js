import React from "react";
import './topNews.css'

const TopNews = ({ title, news_url, image_url, text, date }) => {
    return (
    <div className='text-background'>
        <div className="topNews-articles">
            <a href={news_url} target="_blank">
                <img src={image_url} alt="New Image" />
            </a>
            <h3>
                <a href={news_url} target="_blank">{title}</a>
            </h3>
            <p>{text}</p>
            <p>{date}</p>
        </div>
    </div>
    );
};

export default TopNews;