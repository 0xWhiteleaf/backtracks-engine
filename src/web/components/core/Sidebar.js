/* global window */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Nav, NavItem } from 'reactstrap';

const SidebarNavItems = () => (
  <div>
    <NavItem>
      <Link className={`nav-link ${window.location.pathname === '/' && 'active'}`} to="/">
        <FontAwesomeIcon icon="search" />
        <span>
          &nbsp;Search
        </span>
      </Link>
    </NavItem>
    <NavItem>
      <Link className={`nav-link ${window.location.pathname.startsWith('/favorites') && 'active'}`} to="/favorites">
        <FontAwesomeIcon icon={['fas', 'star']} />
        <span>
          &nbsp;Your favorites
        </span>
      </Link>
    </NavItem>
    <NavItem>
      <Link className={`nav-link ${window.location.pathname.startsWith('/playlists') && 'active'}`} to="/playlists">
        <FontAwesomeIcon icon="list-alt" />
        <span>
          &nbsp;Your playlists
        </span>
      </Link>
    </NavItem>
  </div>
);

const Sidebar = () => (
  <div>
    <Col sm="3" md="2" className="d-none d-sm-block sidebar">
      <Nav vertical>
        {SidebarNavItems()}
      </Nav>
    </Col>
  </div>
);

export { Sidebar, SidebarNavItems };

