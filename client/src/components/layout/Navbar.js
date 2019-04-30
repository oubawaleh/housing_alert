import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";

class NavBar extends Component{
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand><Link to="/" style={{color: "inherit", textDecoration: "none"}}><FaHome style={{height: "2em", width: "3em"}} />Housing Alert</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
          <Nav.Link><Link to="/about" style={{color: "inherit", textDecoration: "none"}}>About</Link></Nav.Link>
          <Nav.Link><Link to="/housing" style={{color: "inherit", textDecoration: "none"}}>Housing</Link></Nav.Link>
          <Nav.Link><Link to="/profile" style={{color: "inherit", textDecoration: "none"}}>Profile</Link></Nav.Link>
          <Nav.Link><Link to="/login" style={{color: "inherit", textDecoration: "none"}}>Login</Link></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavBar;