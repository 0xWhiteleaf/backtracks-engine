import React from 'react';

class Playlist extends React.Component {

  constructor(props) {
    super(props);
  }

  render = () => {
    const { Layout } = this.props;
    const playlistId = this.props.match.params.id;

    return (
      <Layout playlistId={playlistId} />
    );
  }
}

export default Playlist;
