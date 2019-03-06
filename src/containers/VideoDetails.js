import React from 'react';

class VideoDetails extends React.Component {

  constructor(props) {
    super(props);
  }

  render = () => {
    const { Layout } = this.props;
    const videoId = this.props.match.params.id;

    let relatedSearchTerms = null;
    if (this.props.location && this.props.location.state)
      relatedSearchTerms = this.props.location.state.relatedSearchTerms;

    return (
      <Layout videoId={videoId} relatedSearchTerms={relatedSearchTerms} />
    );
  }
}

export default VideoDetails;
