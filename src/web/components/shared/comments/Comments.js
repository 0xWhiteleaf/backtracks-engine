import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Comment from './Comment';
import WriteComment from './WriteComment';

class Comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            videoId: this.props.videoId,
            canAddComment: this.props.canAddComment,
            comments: this.props.comments,
            onCommentsEdited: this.props.onCommentsEdited
        };

        this.onCommentAdded = this.onCommentAdded.bind(this);
        this.onCommentRemoved = this.onCommentRemoved.bind(this);
    }

    onCommentAdded(comment) {
        const { onCommentsEdited } = this.state;

        this.setState(prevState => ({
            comments: [comment, ...prevState.comments]
        }));

        const { comments } = this.state;

        if (onCommentsEdited)
            onCommentsEdited(comments);
    }

    onCommentRemoved(id) {
        const { comments, onCommentsEdited } = this.state;

        const index = comments.findIndex(com => com.id === id)
        const coms = [...comments]
        coms.splice(index, 1);

        this.setState({ comments: [...coms] });

        if (onCommentsEdited)
            onCommentsEdited(coms);
    }

    render() {
        const { loading } = this.state;
        
        if (loading)
            return <Loading />

        const { videoId, comments } = this.state;

        const renderComments = comments.map((com, i) => {
            const date = new Date(com.data.addedOn.seconds * 1000);
            return (
                <div key={com.id}>
                    <Comment
                        id={com.id}
                        videoId={videoId}
                        addedOn={date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}
                        content={com.data.content}
                        signedBy={com.data.phoneNumber}
                        authorId={com.data.userId}
                        onCommentRemoved={this.onCommentRemoved} />
                    {(i + 1) < comments.length && <hr />}
                </div>);
        });

        return (
            <div>
                <div className="simple-container">
                    {comments.length > 0 ?
                        (renderComments) :
                        (<p className="lead text-center" style={{ marginTop: 'inherit' }}>There are no comments yet <FontAwesomeIcon icon="sad-tear" /></p>)}
                </div>

                <WriteComment videoId={videoId} onCommentAdded={this.onCommentAdded} />
            </div>
        );
    }
}

export default withRouter(Comments);
