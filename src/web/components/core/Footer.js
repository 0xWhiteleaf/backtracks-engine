import React from 'react';
import { Col, Row } from 'reactstrap';

const Footer = () => (
  <footer className="mt-5">
    <Row>
      <Col sm="12" className="text-right pt-3">
        <p>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/Zaliro">
            Noé COMTE
          </a>,
          &nbsp;<a target="_blank" rel="noopener noreferrer" href="https://github.com/Miljana123">
            Miljana VUJICIC
          </a>
          &nbsp; & &nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/lydiadekkiche">
            Lydia DEKKICHE
          </a>.
        </p>
      </Col>
    </Row>
  </footer>
);

export default Footer;
