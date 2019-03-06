import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { incrementSearchesCount } from './../../../services/cloudService';

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keywords: this.props.keywords
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClick = this.onClick.bind(this);

    this.search = this.search.bind(this);
  }

  onInputChange(event) {
    this.setState({ keywords: event.target.value });
  }

  onKeyPress(event) {
    if (event.key == 'Enter')
      this.search();
  }

  onClick() {
    this.search();
  }

  async search() {
    const { keywords } = this.state;
    this.setState({ keywords: '' });

    this.props.onSearchRequest(keywords);
    await incrementSearchesCount();
  }

  render() {
    const { keywords } = this.state;

    return (
      <InputGroup>
        <Input placeholder="Type of back tracks..." value={keywords} onChange={this.onInputChange} onKeyPress={this.onKeyPress} />
        <InputGroupAddon addonType="prepend"><Button onClick={this.onClick}><FontAwesomeIcon icon="search" /> Search</Button></InputGroupAddon>
      </InputGroup>
    );
  }
}

export default SearchBar;