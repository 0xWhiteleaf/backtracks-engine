import PropTypes from 'prop-types';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Footer from './../core/Footer';
import Header from './../core/Header';
import { Sidebar } from './../core/Sidebar';

const Template = ({ children }) => (
  <div>
    <Header />
    <Container fluid>
      <Row>
        <Sidebar />
        <Col md="10" sm="9" className="px-sm-5 py-sm-5 ml-sm-auto">
          {children}
          <Footer />
        </Col>
      </Row>
    </Container>
  </div>
);

Template.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Template;
