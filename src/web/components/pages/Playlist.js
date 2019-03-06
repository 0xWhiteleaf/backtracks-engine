import React from 'react';
import Pagination from 'react-js-pagination';
import { Link, withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Badge, Breadcrumb, BreadcrumbItem, Col, Row } from 'reactstrap';
import config from './../../../constants/config';
import { getVideosList } from './../../../services/youtubeService';
import { getPlaylist, updatePlaylist } from './../../../store/users';
import Loading from './../shared/Loading';
import VideoCard from './../shared/VideoCard';

@reactn
class Playlist extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      playlistId: this.props.playlistId,
      name: '',
      createdOn: '',
      videoIds: [],
      videos: [],
      pagination: {
        activePage: 1,
        totalItemsCount: 0
      }
    };

    this.onVideoList = this.onVideoList.bind(this);
    this.onVideoRemoved = this.onVideoRemoved.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.resultsRef = React.createRef();
    this.scrollToResultsRef = this.scrollToResultsRef.bind(this);
  }

  componentDidMount() {
    const { playlistId } = this.state;

    getPlaylist(playlistId)
      .then(playlist => {
        this.setState({ name: playlist.data().name, createdOn: new Date(playlist.data().createdOn.seconds * 1000).toLocaleDateString(), videoIds: playlist.data().videos });

        const ids = playlist.data().videos.join();
        getVideosList(ids)
          .then(videoList => {
            const list = videoList.data.items;
            this.onVideoList(list);
          })
          .catch(error => {
            console.log('Error: ', error);
          });
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }

  onVideoList(list) {
    if (!list || list.length == 0) {
      this.props.history.push({ pathname: '/playlists' });
    } else {
      this.setState(prevState => ({
        loading: false,
        videos: [...list],
        pagination: {
          ...prevState.pagination,
          totalItemsCount: list.length
        }
      }));

      // Checking if needed to go to previous pagination page...
      const { pagination } = this.state;
      const previousPage = (pagination.activePage - 1);
      if (previousPage > 0) {
        const videosPerPage = config.pagination.itemsCountPerPage;
        if (list.length <= (previousPage * videosPerPage)) {
          this.handlePageChange(previousPage);
        }
      }
    }
  }

  onVideoRemoved(videoId) {
    const { playlistId, videoIds, videos } = this.state;

    const videoIdsIndex = videoIds.findIndex(id => id === videoId);
    const videoIdsList = [...videoIds]
    videoIdsList.splice(videoIdsIndex, 1);

    const videosIndex = videos.findIndex(vid => vid.id === videoId);
    const videosList = [...videos]
    videosList.splice(videosIndex, 1);

    updatePlaylist(playlistId, videoIdsList)
      .then(() => {
        this.setState({ videoIds: videoIdsList });
        this.onVideoList(videosList);
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }

  handlePageChange(pageNumber) {
    this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        activePage: pageNumber
      }
    }));

    this.scrollToResultsRef();
  }

  scrollToResultsRef() {
    window.scrollTo({ top: this.resultsRef.current.offsetTop - 15, behavior: "smooth" });
  }

  render() {
    const { loading, playlistId, name, videos, pagination } = this.state;

    if (loading)
      return <Loading />

    const { activePage } = pagination;

    const videosPerPage = config.pagination.itemsCountPerPage;

    const indexOfLastVideo = activePage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

    const cardCallbacks = {
      onRemoveFromPlaylistClicked: this.onVideoRemoved
    };

    const renderVideos = currentVideos.map((video) => {

      return (<VideoCard key={video.id} id={video.id} title={video.snippet.title}
        author={video.snippet.channelTitle} views={0}
        date={video.snippet.publishedAt}
        thumbnailUrl={video.snippet.thumbnails.medium.url}
        relatedSearchTerms={'&&FromPlaylistsPage#' + playlistId + '(' + name + ')'}
        callbacks={cardCallbacks} showFromPlaylist />)
    });

    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/playlists">Your playlists</Link></BreadcrumbItem>
          <BreadcrumbItem active>{name}</BreadcrumbItem>
        </Breadcrumb>

        <h1>{name} <Badge color="secondary">{videos.length}</Badge></h1>
        <hr />

        <section id="results" ref={this.resultsRef}>
          <Row className="pb-3 card-columns" style={{ alignItems: 'flex-end' }}>
            {renderVideos}
          </Row>
        </section>

        <Row>
          <Col style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              itemClass={'page-item'}
              linkClass={'page-link'}
              activePage={activePage}
              itemsCountPerPage={videosPerPage}
              totalItemsCount={pagination.totalItemsCount}
              pageRangeDisplayed={config.pagination.pageRangeDisplayed}
              onChange={this.handlePageChange}
            />
          </Col>
        </Row>

      </div>
    );
  }
}

export default withRouter(Playlist);