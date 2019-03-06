import React from 'react';
import Pagination from 'react-js-pagination';
import { Link, withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Alert, Badge, Breadcrumb, BreadcrumbItem, Col, Row } from 'reactstrap';
import ButtonPlaylist from './../shared/buttons/ButtonPlaylist';
import PlaylistCard from './../shared/PlaylistCard';
import config from './../../../constants/config';
import { getPlaylists } from './../../../store/users';
import Loading from './../shared/Loading';

@reactn
class Playlists extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            playlists: [],
            pagination: {
                activePage: 1,
                totalItemsCount: 0
            }
        };

        this.onPlaylistsReceived = this.onPlaylistsReceived.bind(this);
        this.onPlaylistDeleted = this.onPlaylistDeleted.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

        this.resultsRef = React.createRef();
        this.scrollToResultsRef = this.scrollToResultsRef.bind(this);
    }

    componentDidMount() {
        getPlaylists()
            .then(playlists => {
                this.onPlaylistsReceived(playlists);
            })
            .catch(error => {
                console.log('Error: ', error);
            });
    }

    onPlaylistsReceived(playlists) {
        this.setState(prevState => ({
            loading: false,
            playlists: [...playlists],
            pagination: {
                ...prevState.pagination,
                totalItemsCount: playlists.length
            }
        }));

        // Checking if needed to go to previous pagination page...
        const { pagination } = this.state;
        const previousPage = (pagination.activePage - 1);
        if (previousPage > 0) {
            const playlistsPerPage = (config.pagination.itemsCountPerPage / 2);
            if (playlists.length <= (previousPage * playlistsPerPage)) {
                this.handlePageChange(previousPage);
            }
        }
    }

    onPlaylistDeleted(playlistId) {
        const { playlists } = this.state;

        const index = playlists.findIndex(playlist => playlist.id === playlistId)
        const _playlists = [...playlists]
        _playlists.splice(index, 1);

        this.onPlaylistsReceived(_playlists);
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
        const { loading, pagination } = this.state;

        if (loading)
            return <Loading />

        const playlists = this.state.playlists.filter((p) => p.data.videos.length > 0);

        const hasPlaylists = (playlists.length > 0);
        const { activePage } = pagination;

        const playlistsPerPage = (config.pagination.itemsCountPerPage / 2);

        const indexOfLastPlaylist = activePage * playlistsPerPage;
        const indexOfFirstPlaylist = indexOfLastPlaylist - playlistsPerPage;
        const currentPlaylists = playlists.slice(indexOfFirstPlaylist, indexOfLastPlaylist);

        const cardCallbacks = {
            onPlaylistDeleted: this.onPlaylistDeleted
        };

        const renderPlaylists = currentPlaylists.map((playlist, i) => {
            const { name, createdOn, videos } = playlist.data;

            return (<PlaylistCard key={playlist.id} id={playlist.id} name={name}
                createdOn={new Date(createdOn.seconds * 1000).toLocaleDateString()} videos={videos}
                callbacks={cardCallbacks} />);
        });

        return (
            <div>
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Your playlists</BreadcrumbItem>
                </Breadcrumb>

                <h1>Your playlists <Badge color="secondary">{playlists.length}</Badge></h1>

                {!hasPlaylists ?
                    <Alert color="info" className="text-center">
                        To add a video to a new playlist or to an existing one, simply tap <ButtonPlaylist showOnly /> !
                    </Alert> :
                    <hr />
                }

                <section id="results" ref={this.resultsRef}>
                    <Row className="pb-6 card-columns" style={{ alignItems: 'flex-end' }}>
                        {renderPlaylists}
                    </Row>
                </section>

                {hasPlaylists &&
                    <Row>
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                                activePage={activePage}
                                itemsCountPerPage={playlistsPerPage}
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

export default withRouter(Playlists);
