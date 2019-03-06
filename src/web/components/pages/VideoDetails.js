import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Youtube from 'react-youtube';
import { Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Row, UncontrolledCollapse } from 'reactstrap';
import { getComments } from './../../../store/users';
import Comments from './../shared/comments/Comments';
import { getVideoDetails } from './../../../services/youtubeService';
import ButtonFavorite from './../shared/buttons/ButtonFavorite';
import ButtonPlaylist from './../shared/buttons/ButtonPlaylist';
import Loading from './../shared/Loading';

class VideoDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      relatedSearchTerms: this.props.relatedSearchTerms,
      videoId: this.props.videoId,
      video: null,
      comments: []
    };

    this.onCommentsEdited = this.onCommentsEdited.bind(this);
  }

  componentDidMount() {
    const { videoId } = this.state;

    console.log('Asking for "' + videoId + '" details ...');
    getVideoDetails(videoId)
      .then(details => {
        const videoDetails = details.data.items[0];
        console.log('Details: ', videoDetails);

        this.setState({ video: videoDetails });

        getComments(videoId)
          .then(coms => {
            this.setState({ comments: coms, loading: false });
          })
          .catch(error => {
            console.log('Error: ', error);
            this.setState({ loading: false });
          });
      })
      .catch(error => {
        console.log('Errror: ', error);
      });
  }

  onCommentsEdited(comments) {
    this.setState({ comments: [...comments] });
  }

  render() {
    const opts = {
      width: '100%',
      playerVars: {
        autoplay: 1
      }
    };

    const { loading, videoId, video, comments } = this.state;

    if (loading)
      return <Loading />

    const formattedDate = new Date(video.snippet.publishedAt).toLocaleDateString();

    const { relatedSearchTerms } = this.state;
    let breadcrumbItems = null;

    if (relatedSearchTerms == "&&FromFavoritesPage") {
      breadcrumbItems = (
        <Breadcrumb>
          <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/favorites">Your favorites</Link></BreadcrumbItem>
          <BreadcrumbItem active>{video.snippet.title}</BreadcrumbItem>
        </Breadcrumb>)
    } else if (relatedSearchTerms.includes("&&FromPlaylistsPage")) {
      const playlistId = relatedSearchTerms.split('#')[1].split('(')[0];
      const playlistName = relatedSearchTerms.split('(')[1].split(')')[0];
      breadcrumbItems = (
        <Breadcrumb>
          <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/playlists">Your playlists</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to={'/playlist/' + playlistId}>{playlistName}</Link></BreadcrumbItem>
          <BreadcrumbItem active>{video.snippet.title}</BreadcrumbItem>
        </Breadcrumb>)
    } else {
      breadcrumbItems = (
        <Breadcrumb>
          <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
          {relatedSearchTerms && <BreadcrumbItem><Link to={{
            pathname: "/",
            state: relatedSearchTerms
          }}>{relatedSearchTerms}</Link></BreadcrumbItem>}
          <BreadcrumbItem active>{video.snippet.title}</BreadcrumbItem>
        </Breadcrumb>)
    }

    return (
      <div>
        {breadcrumbItems}

        <Row>
          <Col sm="12" md={{ size: 12 }}>
            <Card>
              <CardBody>
                <Youtube videoId={videoId} opts={opts} className="yt-player" />
                <CardTitle><h5>{video.snippet.title}</h5></CardTitle>
                <CardSubtitle style={{ marginBottom: '0.5rem' }}>{video.statistics.viewCount} view<small><i>s</i></small></CardSubtitle>
                <CardSubtitle style={{ marginBottom: '0.5rem' }}>{video.snippet.channelTitle} <small>- {formattedDate}</small></CardSubtitle>
                <hr />
                <Button color="primary" id="toggler" style={{ marginBottom: '1rem' }} outline>
                  Description <i className="icon-arrow-down-circle" />
                </Button>
                <ButtonGroup className="float-right">
                  <HashLink smooth to="#comments">
                    <Button color="primary">
                      Comments <Badge color="secondary">{comments.length}</Badge>
                    </Button>
                  </HashLink>
                  <ButtonFavorite videoId={videoId} />
                  <ButtonPlaylist videoId={videoId} videoTitle={video.snippet.title} />
                </ButtonGroup>

                <UncontrolledCollapse toggler="#toggler">
                  <CardText style={{ marginBottom: '1rem' }}>{video.snippet.description}</CardText>
                </UncontrolledCollapse>
              </CardBody>
            </Card>

            <section id="comments">
              <Comments videoId={videoId} comments={comments} onCommentsEdited={this.onCommentsEdited} />
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(VideoDetails);
