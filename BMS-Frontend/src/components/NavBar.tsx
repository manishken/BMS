"use client"
import React, { useEffect, useState } from 'react';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useUser } from '@auth0/nextjs-auth0/client';

import PageLink from './PageLink';
import AnchorLink from './AnchorLink';

import { Box, Modal, Typography } from '@mui/material';

interface UserDataType {
  email: String | null | undefined
  name: String | null | undefined
}

let BACKEND_API_URL = ''

if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
  BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
} else {
  BACKEND_API_URL = 'http://127.0.0.1:8000/'
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  overflow: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const NavBar = (props: { bgColor: string, getUserRole: Function }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const [role, setRole] = useState<string>('');
  const toggle = () => setIsOpen(!isOpen);
  const [open, setOpen] = useState(false);

  const UserDataApi = BACKEND_API_URL + 'users/';

  const userData = async () => {
    const requestPayload = {
      email: user?.email,
      name: user?.name,
      role: 'User'
    }

    if (requestPayload.email && requestPayload.name) {
      const response = await fetch(UserDataApi, { method: 'put', body: JSON.stringify(requestPayload) })
      const data: any = await response.json();
      props.getUserRole(data)
      localStorage.setItem('userEmail', requestPayload.email)
      localStorage.setItem('userName', requestPayload.name)
      setRole(data?.role)
    }
  }

  useEffect(() => {
    if (user) {
      userData()
    }
  }, [user])

  const handleOpen = () => setOpen(true);


  const handleClose = () => setOpen(false);

  return (
    <div className="nav-container shadow-lg" data-testid="navbar">
      <Navbar className={"bg-" + props.bgColor + ' text-light'} expand="md">
        <Container fluid>
          {/* <NavbarBrand className="logo" /> */}
          <NavbarToggler onClick={toggle} data-testid="navbar-toggle" />
          <Collapse isOpen={isOpen} navbar className="flex-row">
            <Nav className="mr-auto" navbar data-testid="navbar-items">
              <NavItem>
                <PageLink href="/" className="nav-link text-light" testId="navbar-home">
                  Movie Theater Management
                </PageLink>
              </NavItem>
            </Nav>
            <Nav className="d-none d-md-block end-0 float-end ms-auto nav-bar-login" style={{display: 'flex !important', alignItems: 'center'}} navbar>
              <div>
                {user && < PageLink href="/chat" icon="user" className="d-none d-md-block end-0 float-end ms-auto nav-bar-login" testId="navbar-admin-desktop">
                  Chat
                </PageLink>}
                {!isLoading && !user && (
                  <NavItem id="qsLoginBtn">
                    <AnchorLink
                      href="/api/auth/login"
                      className="cursor-pointer text-light"
                      tabIndex={0}
                      testId="navbar-login-desktop">
                      Log in
                    </AnchorLink>
                  </NavItem>
                )}
              </div>
              {user && (
                <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop">
                  <DropdownToggle nav caret id="profileDropDown" className='d-flex align-items-center'>
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle text-light"
                      width="100"
                      height="100"
                      decode="async"
                      data-testid="navbar-picture-desktop"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header data-testid="navbar-user-desktop">
                      {user.name}
                    </DropdownItem>
                    <DropdownItem className="dropdown-profile text-dark" tag="span">
                      <PageLink href="/profile" icon="user" testId="navbar-profile-desktop">
                        Profile
                      </PageLink>
                    </DropdownItem>
                    {role == 'Admin' && <DropdownItem className="dropdown-profile text-dark" tag="span">
                      <PageLink href="/admin" icon="user" testId="navbar-admin-desktop">
                        Admin
                      </PageLink>
                    </DropdownItem>}
                      {(role == 'Admin' || role == 'Employee') && <DropdownItem className="dropdown-profile text-dark" tag="span">
                          <PageLink href="/booking-window" icon="user" testId="navbar-book-desktop">
                              Book Patron
                          </PageLink>
                      </DropdownItem>}
                    <DropdownItem className="text-dark" id="qsLogoutBtn">
                      <AnchorLink href="/api/auth/logout" icon="power-off" testId="navbar-logout-desktop">
                        Log out
                      </AnchorLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isLoading && !user && (
              <Nav className="d-md-none end-0 float-end ms-auto" navbar>
                <AnchorLink
                  href="/api/auth/login"
                  className="btn btn-primary btn-block text-white"
                  tabIndex={0}
                  testId="navbar-login-mobile">
                  Log in
                </AnchorLink>
              </Nav>
            )}
            {user && (
              <Nav
                id="nav-mobile"
                className="d-md-none justify-content-between"
                navbar
                data-testid="navbar-menu-mobile">
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                      height="50"
                      decode="async"
                      data-testid="navbar-picture-mobile"
                    />
                    <h6 className="d-inline-block" data-testid="navbar-user-mobile">
                      {user.name}
                    </h6>
                  </span>
                </NavItem>
                <NavItem>
                  <PageLink href="/profile" icon="user" testId="navbar-profile-mobile">
                    Profile
                  </PageLink>
                </NavItem>
                {role == 'Admin' && <NavItem>
                  <PageLink href="/admin" icon="user" testId="navbar-admin-mobile">
                    Admin
                  </PageLink>
                </NavItem>}
                <NavItem id="qsLogoutBtn">
                  <AnchorLink
                    href="/api/auth/logout"
                    className="btn btn-link p-0 text-dark"
                    icon="power-off"
                    testId="navbar-logout-mobile">
                    Log out
                  </AnchorLink>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
