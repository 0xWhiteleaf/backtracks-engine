import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardImg, CardSubtitle, CardText, CardTitle, Col } from 'reactstrap';
import ButtonFavorite from './buttons/ButtonFavorite';
import ButtonPlaylist from './buttons/ButtonPlaylist';

class VideoCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showFromPlaylist: this.props.showFromPlaylist,
      id: this.props.id,
      title: this.props.title,
      author: this.props.author,
      views: this.props.views,
      date: this.props.date,
      description: this.props.description,
      thumbnailUrl: this.props.thumbnailUrl,
      relatedSearchTerms: this.props.relatedSearchTerms,
      callbacks: {
        onFavoriteRemoved: this.props.callbacks ? this.props.callbacks.onFavoriteRemoved : null,
        onRemoveFromPlaylistClicked: this.props.callbacks ? this.props.callbacks.onRemoveFromPlaylistClicked : null
      }
    };

    this.onWatchClick = this.onWatchClick.bind(this);
    this.onRemoveFromPlaylistClick = this.onRemoveFromPlaylistClick.bind(this);
  }

  onWatchClick() {
    const { id, relatedSearchTerms } = this.state;

    this.props.history.push({
      pathname: '/video/' + id,
      state: { relatedSearchTerms: relatedSearchTerms }
    });
  }

  onRemoveFromPlaylistClick() {
    const { id, callbacks } = this.state;

    this.setState({ loading: true });

    if (callbacks.onRemoveFromPlaylistClicked)
      callbacks.onRemoveFromPlaylistClicked(id);
  }

  render() {
    const { showFromPlaylist, loading,
      thumbnailUrl, title, author, date,
      description, id, callbacks } = this.state;

    let buttonRemove = null;
    if (showFromPlaylist) {
      if (!loading)
        buttonRemove = <Button color="danger" onClick={this.onRemoveFromPlaylistClick} block><FontAwesomeIcon icon="minus-circle" /> Delete</Button>
      else
        buttonRemove = <Button color="danger" block disabled><FontAwesomeIcon icon="spinner" spin /> Delete</Button>;
    }

    return (
      <Col sm="3">
        <Card>
          {showFromPlaylist && buttonRemove}
          <CardImg src={thumbnailUrl} className="thumbnail" />
          <CardBody>
            <CardTitle><h5>{title}</h5></CardTitle>
            <CardSubtitle style={!showFromPlaylist ? { marginBottom: '1rem' } : null}>{author} <small>- {new Date(date).toLocaleDateString()}</small></CardSubtitle>
            {description && <CardText>{description}</CardText>}
          </CardBody>
          <CardFooter style={{ textAlign: "center" }}>
            <ButtonGroup style={{ display: "flow-root" }}>
              <Button color="primary" onClick={this.onWatchClick} ><FontAwesomeIcon icon="eye" /> Watch</Button>
              <ButtonFavorite videoId={id}
                onFavoriteRemoved={callbacks.onFavoriteRemoved} />
              <ButtonPlaylist videoId={id} videoTitle={title} />
            </ButtonGroup>
          </CardFooter>
        </Card>
      </Col>
    );
  }
}

export default withRouter(VideoCard);