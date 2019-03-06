import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarToggler, NavItem, NavLink, UncontrolledDropdown } from 'reactstrap';
import { updateLastConnectionDate } from './../../../store/users';
import config from './../../../constants/config';
import { getSearchesCount } from './../../../services/cloudService';
import { setGlobal } from './../../../store/persistence';
import { SidebarNavItems } from './Sidebar';

@reactn
class Header extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.state = {
      isOpen: false,
      statistics: {
        searches: 0
      }
    };

    this.updateStatistics = this.updateStatistics.bind(this);
  }

  componentDidMount() {
    const { isLogged } = this.global;
    if (isLogged)
      updateLastConnectionDate();

    this.updateStatistics();
    this.updateStatisticsTask = setInterval(() => this.updateStatistics(), config.statisticsUpdateFrequency);
  }

  componentWillUnmount() {
    clearInterval(this.updateStatisticsTask);
  }

  updateStatistics() {
    getSearchesCount()
      .then(result => {
        this.setState(prevState => ({
          statistics: {
            ...prevState.statistics,
            searches: result.data.searches
          }
        }));
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }

  onLogout = () => {
    setGlobal({ isLogged: false, user: null });
  }

  toggleDropDown = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { isOpen, statistics } = this.state;
    const { isLogged, user } = this.global;

    return (
      <header>
        <Navbar dark color="primary" expand="sm" className="fixed-top">
          <Link to="/" className="navbar-brand" style={{ color: '#FFF' }}>
            {config.appName}
            {' '}
            <FontAwesomeIcon icon={['fab', 'youtube']} />
          </Link>
          <NavbarToggler onClick={this.toggleDropDown} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {isLogged && (
                <NavItem>
                  <NavLink className="nav-link">
                    <React.Fragment>{user.phoneNumber}</React.Fragment> <FontAwesomeIcon icon="lock" />
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                {!isLogged ? (<Link to="/auth" className={`nav-link ${window.location.pathname.startsWith('/auth') && 'active'}`}>
                  <React.Fragment>Authentication</React.Fragment> <FontAwesomeIcon icon="sign-in-alt" />
                </Link>) :
                  <NavLink onClick={this.onLogout} className="nav-link">
                    <React.Fragment>Disconnect</React.Fragment> <FontAwesomeIcon icon="sign-out-alt" />
                  </NavLink>}
              </NavItem>
              <div className="d-block d-sm-none">
                {SidebarNavItems()}
              </div>
              <UncontrolledDropdown nav>
                <DropdownToggle nav caret>
                  About
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Statistics</DropdownItem>
                  <DropdownItem disabled>
                    <small>
                      {statistics.searches} search<i>(es)</i>
                    </small>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem header>Links</DropdownItem>
                  <DropdownItem>
                    <small>
                      <a target="_blank" rel="noopener noreferrer" href="https://github.com/Zaliro/backtracks-engine">
                        Github
                      </a>
                    </small>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

export default withRouter(Header);
