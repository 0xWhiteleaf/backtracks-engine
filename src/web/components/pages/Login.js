import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Breadcrumb, BreadcrumbItem, Col, Row } from 'reactstrap';
import { ConfigureFirebaseUI, FirebaseUI } from './../../../lib/firebase';
import { setGlobal } from './../../../store/persistence';
import { updateLastConnectionDate } from './../../../store/users';

@reactn
class Login extends React.Component {

  constructor(props) {
    super(props);

    this.signInSuccessWithAuthResult = this.signInSuccessWithAuthResult.bind(this);
  }

  componentDidMount() {
    ConfigureFirebaseUI(this.signInSuccessWithAuthResult);
    FirebaseUI('#firebaseui');
  }

  signInSuccessWithAuthResult(authResult) {
    setGlobal({ isLogged: true, user: { id: authResult.user.uid, phoneNumber: authResult.user.phoneNumber } });
    updateLastConnectionDate();
  }

  render() {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
          <BreadcrumbItem active>Authentication</BreadcrumbItem>
        </Breadcrumb>

        <Row>
          <Col id="firebaseui" sm="12" md={{ size: 6, offset: 3 }}></Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(Login);