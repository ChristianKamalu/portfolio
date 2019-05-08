import React from 'react'
import PropTypes from 'prop-types'

const Header = (props) => (
    <header id="header" style={props.timeout ? {display: 'none'} : {}}>
        <div className="logo">
            <span className="icon fa-pagelines"></span>
        </div>
        <div className="content">
            <div className="inner">
                <h1>Christian Kamalu</h1>
                <p>Full-Stack Web Developer</p>
            </div>
        </div>
        <nav>
            <div style={{padding: '1rem', border: '1px solid white', borderRadius: 5}}>
                <ul>
                    <li><a href="javascript:;" onClick={() => {props.onOpenArticle('intro')}}>About</a></li>
                    <li><a href="javascript:;" onClick={() => {props.onOpenArticle('about')}}>Skills</a></li>
                    <li><a href="javascript:;" onClick={() => {props.onOpenArticle('work')}}>Projects</a></li>
                    <li><a href="javascript:;" onClick={() => {props.onOpenArticle('contact')}}>Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>
)

Header.propTypes = {
    onOpenArticle: PropTypes.func,
    timeout: PropTypes.bool
}

export default Header
