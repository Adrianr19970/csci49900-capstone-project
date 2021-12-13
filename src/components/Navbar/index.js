import React from 'react';
import background from './Sky.jpg';
import { Nav, NavLink, NavMenu} from './NavbarElements';
import { Form, FormControl, Button } from "react-bootstrap";
import Logo from './TradeBreath.gif';
  
const Navbar = () => {
  return (
    <>
      <div className="navBar-div">

      <Nav id ="navBar"
        style={{ 
          backgroundImage: `url(${background})`,
          backgroundAttachment: 'fixed',
          backgroundCover: `cover`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          height: '90px',
          paddingTop: '0.5%',
          paddingBottom: '0.5%'
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
              <FormControl type="text" placeholder="Search" id="searchBar"
              />

              <Button id="searchButton">
                Search
              </Button>
            </Form>

          </NavMenu>
      </Nav>

      </div>
    </>
  );
};
  
export default Navbar;