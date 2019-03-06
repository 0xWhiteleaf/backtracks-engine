import React from 'react';

class Search extends React.Component {

  constructor(props) {
    super(props);
  }

  render = () => {
    const { Layout } = this.props;

    const q = this.props.match.params.q;
    const breadcrumbSearch = this.props.location.state;

    return <Layout q={q} breadcrumbSearch={breadcrumbSearch} />;
  }
}

export default Search;
