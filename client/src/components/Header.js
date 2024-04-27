import React from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import logoImage from '../attentive-mind-brain.png'  // AttentiveMind logo generated with DALL·E 2

const Header = () => {
    return (
        <header className="bg-transparent w-full relative">
            <div className="container mx-auto flex justify-between items-center p-4 pb-2 md:pb-1">
                <div className="flex items-center">
                    <Link to="/" aria-label="Back to Home">
                        <img src={logoImage} alt="AttentiveMind Logo" className="h-12 md:h-16 w-auto mr-3"/>
                    </Link>
                    <h1 className="font-proximanova text-xl text-primary-500">AttentiveMind</h1>
                </div>
                <HamburgerMenu />
            </div>
        </header>
    );
};

export default Header;