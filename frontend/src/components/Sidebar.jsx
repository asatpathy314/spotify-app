import React, { ReactNode, useContext } from 'react';
import { AuthContext } from './AuthProvider';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CiHeart } from "react-icons/ci";
import { GiMicrophone } from "react-icons/gi";
import { MdForum } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsFilePerson } from "react-icons/bs";
import { GoPaperAirplane } from "react-icons/go";
import { FiMenu } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { IoMusicalNotesSharp } from "react-icons/io5";



export default function SimpleSidebar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const { token, setToken, userID, setUserID } = useContext(AuthContext);
  const LinkItems= [
    { name: 'Profile', icon: BsFilePerson, link: `/profile/${userID || 'nosessiontoken'}` },
    { name: 'Forum', icon: MdForum, link: '/forum' },
    { name: 'Liked Songs', icon: CiHeart, link: '/liked' },
    { name: 'Favorite Artists', icon: GiMicrophone, link: '/topartists' },
    { name: 'Favorite Songs', icon: IoMusicalNotesSharp, link: '/topsongs'},
    { name: 'Discover', icon: FaMagnifyingGlass, link: '/discover' },
    { name: 'Messages', icon: GoPaperAirplane, link: '/messages' },
    { name: 'Logout', icon: CiLogout, link: '/logout' },
  ];
  return (
    <Box
      bg="#0f0e17"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="#FFFFFE">
          SoundBoard
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} color="white" />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, link, ...rest }) => {
  return (
    <Link href={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color="#FFFFFE"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg="#0f0e17"
      color='#FFFFFE'
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        color="#FFFFFE"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        SoundBoard
      </Text>
    </Flex>
  );
};
