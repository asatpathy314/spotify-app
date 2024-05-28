import React from 'react';
import { Link, VStack } from '@chakra-ui/react';
import '../stylesheets/Navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="brand">MyApp</div>
      <VStack align="flex-start" spacing="4">
        <Link href="#" className="nav-link">Liked Songs</Link>
        <Link href="#" className="nav-link">Forum</Link>
        <Link href="#" className="nav-link">Inbox</Link>
        <Link href="#" className="nav-link">Top Songs</Link>
        <Link href="#" className="nav-link">Profile</Link>
      </VStack>
      <div className="logout">
        <Link href="#" className="nav-link">Logout</Link>
      </div>
    </nav>
  );
};
