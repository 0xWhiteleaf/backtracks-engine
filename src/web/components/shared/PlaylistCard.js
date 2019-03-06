import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardSubtitle, CardTitle, Col } from 'reactstrap';
import { deletePlaylist } from './../../../store/users';

class PlaylistCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id: this.props.id,
            name: this.props.name,
            createdOn: this.props.createdOn,
            videos: this.props.videos,
            callbacks: {
                onPlaylistDeleted: this.props.callbacks ? this.props.callbacks.onPlaylistDeleted : null
            }
        };

        this.onOpenClick = this.onOpenClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
    }

    onOpenClick() {
        this.props.history.push({
            pathname: '/playlist/' + this.state.id
        });
    }

    onDeleteClick() {
        const { id, callbacks } = this.state;

        this.setState({ loading: true });

        deletePlaylist(id)
            .then(() => {
                this.setState({ loading: false });
                if (callbacks.onPlaylistDeleted)
                    callbacks.onPlaylistDeleted(id);
            })
            .catch(error => {
                console.log('Error: ', error);
            });
    }

    render() {
        const { loading, name, createdOn, videos } = this.state;

        let buttonDelete = null;
        if (!loading)
            buttonDelete = <Button color="danger" onClick={this.onDeleteClick} ><FontAwesomeIcon icon="eraser" /> Delete</Button>
        else
            buttonDelete = <Button color="danger" disabled><FontAwesomeIcon icon="spinner" spin /> Delete</Button>;


        return (
            <Col sm="6">
                <Card>
                    <CardBody>
                        <CardTitle><h5>{name}{' '}<Badge color="info" className="float-right" style={{ lineHeight: 'unset' }}>{videos.length}{' '}<small>video(s)</small></Badge></h5></CardTitle>
                        <CardSubtitle style={{ marginBottom: '-0.5rem' }}>Created on : {createdOn}</CardSubtitle>
                    </CardBody>
                    <CardFooter style={{ textAlign: "center" }}>
                        <ButtonGroup style={{ display: "flow-root" }}>
                            <Button color="primary" onClick={this.onOpenClick} ><FontAwesomeIcon icon="folder-open" /> Open</Button>
                            {buttonDelete}
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </Col >
        );
    }
}

export default withRouter(PlaylistCard);