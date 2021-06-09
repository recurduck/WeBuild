  
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {
    render() {
        return (
            <header className="main-hero">
                <div className="container flex column">
                    <div className="hero-content flex column">
                    <div className="main-hero-title">Creating a website was never easier!</div>
                    <p className="main-hero-text">
                        Build a modern responsive website with just a few clicks!
                        <Link to="/editor" className="cta-button-1 center-block decoration-none">Lets Get Started!</Link>
                    </p>
                    </div>
                    <img className="main-hero-img" src="images/header-background.jpg" alt="img hero"/>
                </div>
            </header>
        )
    }
}