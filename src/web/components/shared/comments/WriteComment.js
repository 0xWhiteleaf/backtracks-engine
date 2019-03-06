import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { addComment } from './../../../../store/users';

@reactn
class WriteComment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            videoId: this.props.videoId,
            content: '',
            onCommentAdded: this.props.onCommentAdded
        };

        this.isValidContent = this.isValidContent.bind(this);
        this.isEmptyContent = this.isEmptyContent.bind(this);
        this.onContentChange = this.onContentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    isValidContent() {
        return this.state.content.length >= 5;
    }

    isEmptyContent() {
        return this.state.content == null || this.state.content.length == 0 || this.state.content == '';
    }

    onContentChange(e) {
        this.setState({ content: e.target.value });
    }

    handleSubmit(e) {
        const { videoId, content, onCommentAdded } = this.state;

        if (!this.isValidContent())
            return;

        this.setState({ loading: true });

        addComment(videoId, content)
            .then(result => {
                this.setState({ content: '', loading: false });
                if (onCommentAdded)
                    onCommentAdded({ id: result.ref.id, data: { ...result.copy, addedOn: { seconds: (result.copy.addedOn.getTime() / 1000) } } });
            })
            .catch(error => {
                console.log('Error: ', error);
                this.setState({ loading: false });
            });

        e.preventDefault();
    }

    render() {
        const { isLogged } = this.global;
        const { loading, content } = this.state;

        let buttonSubmit = <Button color="secondary" disabled={!isLogged || !this.isValidContent()}><FontAwesomeIcon icon="comment-dots" /> Submit</Button>;
        if (loading)
            buttonSubmit = <Button color="secondary" disabled><FontAwesomeIcon icon="spinner" spin /> Submit</Button>;

        return (
            <div className="simple-container">
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="exampleText">Express yourself !</Label>
                        <Input type="textarea" id="content" value={content} onChange={this.onContentChange}
                            disabled={!isLogged || loading} placeholder={!isLogged ? 'You must be logged in to post a comment.' : null}
                            invalid={(!this.isValidContent() && !this.isEmptyContent())} />
                        {(!this.isValidContent() && !this.isEmptyContent()) && <FormFeedback>Your comment must contain at least 5 characters</FormFeedback>}
                    </FormGroup>
                    {buttonSubmit}
                </Form>
            </div>
        );
    }
}

export default withRouter(WriteComment);