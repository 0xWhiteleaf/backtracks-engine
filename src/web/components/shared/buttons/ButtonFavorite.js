import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Button } from 'reactstrap';
import { addFavorite, getFavorite, removeFavorite } from './../../../../store/users';

@reactn
class ButtonFavorite extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showOnly: this.props.showOnly,
            loading: true,
            videoId: this.props.videoId,
            isFavorite: false,
            onFavoriteRemoved: this.props.onFavoriteRemoved
        };

        this.onAddToFavClick = this.onAddToFavClick.bind(this);
        this.onRemoveFromFavClick = this.onRemoveFromFavClick.bind(this);
    }

    componentWillMount() {
        const { isLogged } = this.global;
        const { videoId } = this.state;

        if (isLogged && videoId) {
            getFavorite(videoId)
                .then(favorite => {
                    this.setState({ isFavorite: favorite.exists, loading: false });
                })
                .catch(error => {
                    console.log('Error: ', error);
                    this.setState({ loading: false });
                });
        } else {
            this.setState({ loading: false });
        }
    }

    onAddToFavClick() {
        const { videoId } = this.state;

        if (!videoId)
            return;

        this.setState({ loading: true });

        addFavorite(videoId)
            .then(() => {
                this.setState(prevState => ({
                    loading: false,
                    isFavorite: true
                }));
            })
            .catch(error => {
                console.log('Error: ', error);
                this.setState({ loading: false });
            });
    }

    onRemoveFromFavClick() {
        const { videoId } = this.state;

        if (!videoId)
            return;

        this.setState({ loading: true });

        removeFavorite(videoId)
            .then(() => {
                this.setState({ loading: false, isFavorite: false });

                const { onFavoriteRemoved } = this.state;
                if (onFavoriteRemoved)
                    onFavoriteRemoved(videoId);
            })
            .catch(error => {
                console.log('Error: ', error);
                this.setState({ loading: false });
            });
    }

    render() {
        const { isLogged } = this.global;
        const { loading, showOnly, isFavorite } = this.state;

        if (loading)
            return (<Button color="warning" disabled><FontAwesomeIcon icon="spinner" spin /> Favorite</Button>);

        if (!isLogged || showOnly) {
            return (<Button color="warning" disabled><FontAwesomeIcon icon={['far', 'star']} /> Favorite</Button>);
        } else {


            if (!isFavorite)
                return (<Button color="warning" onClick={this.onAddToFavClick}><FontAwesomeIcon icon={['far', 'star']} /> Favorite</Button>)
            else
                return (<Button color="warning" onClick={this.onRemoveFromFavClick}><FontAwesomeIcon icon={['fas', 'star']} /> Favorite</Button>);
        }
    }
}

export default withRouter(ButtonFavorite);