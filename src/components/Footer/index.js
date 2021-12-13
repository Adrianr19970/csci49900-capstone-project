import React from 'react';
import background from './Sky.jpg';
import logo from './logo.png';
import '../../App.css';

const Footer = () => {
    return (
    <>
        <div id="Footer"
        style={{
            marginTop: '1%',
            borderBottom: 'solid',
            borderWidth: '1px'
        }}
        >
            <div id="bg"
            style={{ 
                backgroundImage: `url(${background})`,
                backgroundCover: `cover`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                height: '100px',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#000',
              }}
            >
                <div
                style={{
                    backgroundColor: '#000',
                    alignItems: 'center',
                    textAlign: 'center',
                    opacity: '60%',
                    color: '#fff',
                }}>
                    <p>Powered by React</p>
                </div>

                <img src={logo} className="App-logo" alt="logo" 
                style={{
                    alignItems: 'center',
                    height: '50px',
                    marginLeft: '48.5%'
                }}
                />
            </div>     
        </div>
    </>
    );
};

export default Footer;