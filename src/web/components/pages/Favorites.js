import Enumerable from 'linq';
import React from 'react';
import Pagination from 'react-js-pagination';
import { Link, withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Alert, Badge, Breadcrumb, BreadcrumbItem, Col, Row } from 'reactstrap';
import config from './../../../constants/config';
import { getVideosList } from './../../../services/youtubeService';
import { getFavorites } from './../../../store/users';
import ButtonFavorite from './../shared/buttons/ButtonFavorite';
import Loading from './../shared/Loading';
import VideoCard from './../shared/VideoCard';

@reactn
class Favorites extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      videos: [],
      favoritesData: [],
      pagination: {
        activePage: 1,
        totalItemsCount: 0
      }
    };

    this.onVideoList = this.onVideoList.bind(this);
    this.onFavoriteRemoved = this.onFavoriteRemoved.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.getFavoriteData = this.getFavoriteData.bind(this);

    this.resultsRef = React.createRef();
    this.scrollToResultsRef = this.scrollToResultsRef.bind(this);
  }

  componentDidMount() {
    getFavorites()
      .then(favorites => {
        this.setState({ favoritesData: favorites });

        const ids = favorites.map(fav => fav.id).join();
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

  onFavoriteRemoved(videoId) {
    const { videos } = this.state;

    const index = videos.findIndex(fav => fav.id === videoId)
    const list = [...videos]
    list.splice(index, 1);

    this.onVideoList(list);
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

  /* Internal */

  getFavoriteData(id) {
    let data = null;

    const { favoritesData } = this.state;

    const _favoritesData = Enumerable.from(favoritesData);
    const query = _favoritesData.where(f => f.id == id).firstOrDefault();
    if (query)
      data = query.data;

    return data;
  }

  render() {
    const { loading, pagination } = this.state;

    if (loading)
      return <Loading />

    const { videos } = this.state;
    const hasFavorites = (videos.length > 0);
    const { activePage } = pagination;

    const videosPerPage = config.pagination.itemsCountPerPage;

    const indexOfLastVideo = activePage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

    const cardCallbacks = {
      onFavoriteRemoved: this.onFavoriteRemoved
    };

    const renderVideos = currentVideos.map((video, i) => {
      const favoriteData = this.getFavoriteData(video.id);

      return (<VideoCard key={video.id} id={video.id} title={video.snippet.title}
        author={video.snippet.channelTitle} views={0}
        description={'Added on: ' + new Date(favoriteData.addedOn.seconds * 1000).toLocaleDateString()}
        date={video.snippet.publishedAt}
        thumbnailUrl={video.snippet.thumbnails.medium.url}
        relatedSearchTerms={'&&FromFavoritesPage'}
        callbacks={cardCallbacks} />);
    });

    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
          <BreadcrumbItem active>Your favorites</BreadcrumbItem>
        </Breadcrumb>

        <h1>Your favorites <Badge color="secondary">{videos.length}</Badge></h1>

        {!hasFavorites ?
          <Alert color="info" className="text-center">
            To add a video to your favorites list, simply tap <ButtonFavorite showOnly /> !
          </Alert> :
          <hr />
        }

        <section id="results" ref={this.resultsRef}>
          <Row className="pb-3 card-columns" style={{ alignItems: 'flex-end' }}>
            {renderVideos}
          </Row>
        </section>

        {hasFavorites &&
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
        }
      </div>
    );
  }
}

export default withRouter(Favorites);
