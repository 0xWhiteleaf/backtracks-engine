import React from 'react';

class Default extends React.Component {

  constructor(props) {
    super(props);
  }

  render = () => {
    const { Layout } = this.props;

    return (
      <Layout />
    );
  }
}

export default Default;