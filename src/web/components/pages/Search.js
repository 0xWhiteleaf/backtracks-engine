import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Col, Jumbotron, Row } from 'reactstrap';
import config from './../../../constants/config';
import { getSearchResults } from './../../../services/youtubeService';
import Loading from './../shared/Loading';
import SearchBar from './../shared/SearchBar';
import VideoCard from './../shared/VideoCard';
import queryString from 'query-string';

@reactn
class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      lastSearchTerms: '',
      searchBarKeywords: '',
      q: queryString.parse(this.props.location.search)["?q"],
      breadcrumbSearch: this.props.breadcrumbSearch,
      videos: [],
      pagination: {
        activePage: 1,
        totalItemsCount: 0
      }
    };

    this.onSearchRequest = this.onSearchRequest.bind(this);
    this.onSearchResults = this.onSearchResults.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.resultsRef = React.createRef();
    this.scrollToResultsRef = this.scrollToResultsRef.bind(this);
  }

  componentDidMount() {
    const { q, breadcrumbSearch } = this.state;
    console.log('Query: ', q);
    console.log('BreadcrumbSearch: ', breadcrumbSearch);

    const isPushed = this.props.history.action == "PUSH";
    console.log('IsPushed: ', isPushed);

    if (isPushed && breadcrumbSearch && breadcrumbSearch != "" && breadcrumbSearch != config.defaultPrefixKeywords) {
      const extractedKeywords = breadcrumbSearch.substring(15, breadcrumbSearch.length);
      console.log('Extracted: ', extractedKeywords);

      this.setState({ searchBarKeywords: extractedKeywords });
      this.onSearchRequest(extractedKeywords, true);
    } else if (q) {
      this.setState({ searchBarKeywords: q });
      this.onSearchRequest(q, true);
    } else {
      this.onSearchRequest(null, true);
    }
  }

  onSearchRequest(keywords, isAuto = false) {
    if (!isAuto)
      this.handlePageChange(1);

    const searchTerms = keywords ? config.defaultPrefixKeywords + ' ' + keywords : config.defaultPrefixKeywords;
    this.setState({ lastSearchTerms: searchTerms, searchBarKeywords: (keywords || '') });
    console.log('Searching "' + searchTerms + '" ...');

    this.setState({ loading: true });

    getSearchResults(searchTerms)
      .then(results => {
        const items = results.data.items;

        console.log('(Size) Results: ', items.length);
        this.onSearchResults(items);
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }

  onSearchResults(results) {
    this.setState(prevState => ({
      loading: false,
      videos: [...results],
      pagination: {
        ...prevState.pagination,
        totalItemsCount: results.length
      }
    }));
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
    const { loading, pagination, lastSearchTerms, searchBarKeywords } = this.state;

    if (loading)
      return <Loading />

    const { videos } = this.state;
    const { activePage } = pagination;

    const videosPerPage = config.pagination.itemsCountPerPage;

    const indexOfLastVideo = activePage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

    const renderVideos = currentVideos.map((video, i) => {
      return (<VideoCard key={i + indexOfFirstVideo} id={video.id.videoId} title={video.snippet.title}
        author={video.snippet.channelTitle} views={0} description={video.snippet.description} date={video.snippet.publishedAt}
        thumbnailUrl={video.snippet.thumbnails.medium.url}
        relatedSearchTerms={lastSearchTerms} />)
    });

    return (
      <div>
        <Row>
          <Jumbotron className="bg-primary text-white mx-auto">
            <h1>
              Welcome to <i>{config.appName}</i> <FontAwesomeIcon icon={['fab', 'youtube']} />
            </h1>
            <p>
              <b>{config.appName}</b> is a tool that allow you to search and discover backing tracks.<br />
              Some useful features are implemented in this early version like add videos to your favorites, the ability to create playlists or even be able to comment a video.<br />
            </p>
            <hr />
            <p>
              <small>Powered by <b>Youtube Data API v3</b>.</small>
            </p>
          </Jumbotron>
        </Row>

        <Row className="pb-3">
          <SearchBar keywords={searchBarKeywords} onSearchRequest={this.onSearchRequest} />
        </Row>

        <section id="results" ref={this.resultsRef}>
          <Row className="pb-3 card-columns" style={{ alignItems: 'flex-end' }} >
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

export default withRouter(Search);
