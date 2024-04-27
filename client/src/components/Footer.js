import React from 'react';

function Footer() {
    return (
      <footer className="w-full text-left p-4 mt-auto">
        <p>© {new Date().getFullYear()} AttentiveMind - All rights reserved.</p>
      </footer>
    );
}

export default Footer;