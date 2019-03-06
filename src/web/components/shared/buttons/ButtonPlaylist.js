import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withRouter } from 'react-router-dom';
import reactn from 'reactn';
import { Button, DropdownItem, DropdownMenu, DropdownToggle, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupButtonDropdown, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { createPlaylist, getPlaylists, updatePlaylist } from './../../../../store/users';

@reactn
class ButtonPlaylist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showOnly: this.props.showOnly,
            creatingOrUpdating: false,
            loading: true,
            isModalOpen: false,
            isDropdownOpen: false,
            video: {
                id: this.props.videoId,
                title: this.props.videoTitle
            },
            playlists: [],
            newPlaylistName: '',
            existingPlaylistId: null,
            existingPlaylistName: '',
            existingPlaylistVideos: []
        };

        this.onModalOpened = this.onModalOpened.bind(this);
        this.onModalClosed = this.onModalClosed.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);

        this.isValidContent = this.isValidContent.bind(this);
        this.isEmptyContent = this.isEmptyContent.bind(this);
        this.onNewPlaylistNameChange = this.onNewPlaylistNameChange.bind(this);
        this.onExistingPlaylistSelected = this.onExistingPlaylistSelected.bind(this);

        this.createNewPlaylist = this.createNewPlaylist.bind(this);
        this.addToExistingPlaylist = this.addToExistingPlaylist.bind(this);
    }

    onModalOpened() {
        this.setState({ loading: true });

        getPlaylists('name', 'asc')
            .then(playlists => {
                this.setState({ playlists: playlists, loading: false });
            })
            .catch(error => {
                console.log('Error: ', error);
            });
    }

    onModalClosed() {
        this.setState({
            playlists: [],
            newPlaylistName: '',
            existingPlaylistId: null,
            existingPlaylistName: '',
            existingPlaylistVideos: []
        });
    }

    toggleModal() {
        this.setState(prevState => ({
            isModalOpen: !prevState.isModalOpen
        }));
    }

    toggleDropdown() {
        this.setState(prevState => ({
            isDropdownOpen: !prevState.isDropdownOpen
        }));
    }

    isValidContent() {
        return this.state.newPlaylistName.length >= 3;
    }

    isEmptyContent() {
        return this.state.newPlaylistName == null || this.state.newPlaylistName.length == 0 || this.state.newPlaylistName == '';
    }

    onNewPlaylistNameChange(e) {
        this.setState({ newPlaylistName: event.target.value, existingPlaylistId: null, existingPlaylistName: '' });
    }

    onExistingPlaylistSelected(id, name, videos) {
        this.setState({ existingPlaylistId: id, existingPlaylistName: name, existingPlaylistVideos: videos, newPlaylistName: '' });
    }

    createNewPlaylist() {
        const { newPlaylistName, video } = this.state;

        this.setState({ creatingOrUpdating: true });

        createPlaylist(newPlaylistName, video.id)
            .then(() => {
                this.setState({ creatingOrUpdating: false });
                this.toggleModal();

                this.props.history.push({
                    pathname: '/playlists'
                });
            })
            .catch(error => {
                console.log('Error: ', error);
                this.setState({ creatingOrUpdating: false });
            });
    }

    addToExistingPlaylist() {
        const { existingPlaylistId, existingPlaylistVideos, video } = this.state;

        this.setState({ creatingOrUpdating: true });

        updatePlaylist(existingPlaylistId, [video.id, ...existingPlaylistVideos])
            .then(() => {
                this.setState({ creatingOrUpdating: false });
                this.toggleModal();
            })
            .catch(error => {
                console.log('Error: ', error);
                this.setState({ creatingOrUpdating: false });
            });
    }

    render() {
        const { isLogged } = this.global;
        const { showOnly, isModalOpen, isDropdownOpen, loading, creatingOrUpdating } = this.state;
        const { video, playlists, newPlaylistName, existingPlaylistName } = this.state;

        const dropdownMenuModifiers = {
            setMaxHeight: { enabled: true, order: 890, fn: (data) => { return { ...data, styles: { ...data.styles, overflow: 'auto', maxHeight: 150, }, } } }
        }

        let isButtonEnabled = false;
        let buttonFunction = null;

        if (newPlaylistName != '') {
            isButtonEnabled = this.isValidContent();
            buttonFunction = this.createNewPlaylist;
        } else if (existingPlaylistName != '') {
            isButtonEnabled = (existingPlaylistName.length > 0);
            buttonFunction = this.addToExistingPlaylist;
        }

        let buttonAdd = <Button color="primary" onClick={buttonFunction} disabled={!isButtonEnabled}><FontAwesomeIcon icon="plus-circle" /> Add</Button>;
        if (creatingOrUpdating)
            buttonAdd = <Button color="primary" disabled><FontAwesomeIcon icon="spinner" spin /> Add</Button>;

        const isDropdownLoading = loading;
        const isDropdownEnabled = !isDropdownLoading && playlists.length > 0;

        let renderDropdownItemsCount = 0;
        const renderDropdownItems = playlists.map((playlist, i) => {
            const { name, videos } = playlist.data;
            if (!videos.includes(video.id)) {
                renderDropdownItemsCount++;
                return (<DropdownItem key={playlist.id} onClick={() => this.onExistingPlaylistSelected(playlist.id, name, videos)}>{name}</DropdownItem>);
            }
        });

        return (
            <React.Fragment>
                <Button color="info" onClick={this.toggleModal} disabled={!isLogged || showOnly}><FontAwesomeIcon icon="list-alt" /> Playlist</Button>

                <Modal isOpen={isModalOpen} toggle={this.toggleModal} onOpened={this.onModalOpened} onClosed={this.onModalClosed} centered>
                    <ModalHeader toggle={this.toggleModal}>Add <b>{video.title}</b> <small>({video.id})</small> to...</ModalHeader>
                    <ModalBody>
                        <h6>A new playlist</h6>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">+</InputGroupAddon>
                            <Input placeholder="Name of the new playlist" value={newPlaylistName} onChange={this.onNewPlaylistNameChange}
                                invalid={(!this.isValidContent() && !this.isEmptyContent())} />
                            {(!this.isValidContent() && !this.isEmptyContent()) && <FormFeedback>Your playlist name must contain at least 3 characters</FormFeedback>}
                        </InputGroup>

                        <hr />

                        <h6>An existing playlist</h6>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                            <Input placeholder={isDropdownEnabled ? (renderDropdownItemsCount > 0 ? "Select an existing playlist" : "No playlist selectable") : "You do not have playlists yet"} value={existingPlaylistName} readOnly />
                            <InputGroupButtonDropdown addonType="prepend" isOpen={isDropdownOpen} toggle={this.toggleDropdown} direction="left">
                                <DropdownToggle split={!isDropdownLoading} outline disabled={(!isDropdownEnabled || renderDropdownItemsCount == 0)}>
                                    {isDropdownLoading && <FontAwesomeIcon icon="spinner" spin />}
                                </DropdownToggle>
                                <DropdownMenu modifiers={dropdownMenuModifiers}>
                                    {renderDropdownItems}
                                </DropdownMenu>
                            </InputGroupButtonDropdown>
                        </InputGroup>
                    </ModalBody>
                    <ModalFooter>
                        {buttonAdd}
                        {' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default withRouter(ButtonPlaylist);