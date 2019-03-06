import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Button } from 'reactstrap';
import { removeComment } from './../../../../store/users';

@reactn
class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id: this.props.id,
            videoId: this.props.videoId,
            addedOn: this.props.addedOn,
            content: this.props.content,
            signedBy: this.props.signedBy,
            authorId: this.props.authorId,
            _onCommentRemoved: this.props.onCommentRemoved
        };

        this.onCommentRemoved = this.onCommentRemoved.bind(this);
    }

    onCommentRemoved() {
        const { videoId, id, _onCommentRemoved } = this.state;

        if (!videoId || !id)
            return;

        this.setState({ loading: true });

        removeComment(videoId, id)
            .then(() => {
                this.setState({ loading: false });
                if (_onCommentRemoved)
                    _onCommentRemoved(id);
            })
            .catch(error => {
                console.log('Error: ', error);
                this.setState({ loading: false });
            });
    }

    render() {
        const { isLogged, user } = this.global;
        const { addedOn, content, signedBy, authorId, loading } = this.state;

        let _signedBy = <i>{signedBy}</i>;
        if (isLogged && user.id == authorId) {
            _signedBy = <b>{signedBy}</b>;
        }

        let buttonRemove = null;
        if (isLogged && user.id == authorId) {
            if (!loading)
                buttonRemove = <Button color="danger" onClick={this.onCommentRemoved}><FontAwesomeIcon icon="trash-alt" /> Remove</Button>;
            else
                buttonRemove = <Button color="danger" disabled><FontAwesomeIcon icon="spinner" spin /> Delete</Button>;
        }

        return (
            <div id="comment-container">
                <small>{addedOn}</small>
                <blockquote className="blockquote">
                    <p className="mb-0">{content}</p>
                    <footer className="blockquote-footer"><small>Signed by {_signedBy}</small></footer>
                </blockquote>
                {(isLogged && user.id == authorId) && buttonRemove}
            </div>
        );
    }
}

export default withRouter(Comment);