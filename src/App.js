import React, {Component} from 'react';
import loader from './images/loader.svg';
import Gif from './Gif.js';
import clearButton from './images/close-icon.svg';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {}
    {hasResults ? (
      <img src={clearButton} onClick={clearSearch} />
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ? <img src={loader} className="block mx-auto" /> : hintText}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      hintText: 'Hit enter to search',
      gifs: []
    };
  }

  searchGiphy = async searchTerm => {
    this.setState({
      loading: true
    });
    //first we try our fetch
    try {
      //here we use the await keyword to await foir our response to come back
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=Rqp6uchDSSfpP8TDkJN3kDF43ipK5Z2X&q=${searchTerm}&limit=25&offset=0&rating=R&lang=en`
      );

      //here we convert our raw response into json data
      const {data} = await response.json();

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      const randomGif = randomChoice(data);

      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }));

      //if it fails we catch it here
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
    }
  };

  handleChange = event => {
    const {value} = event.target;

    this.setState((prevState, props) => ({
      //we take our old props and spread them out here
      ...prevState,
      //and then overwrite the ones we want after
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

  handleKeyPress = event => {
    const {value} = event.target;

    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value);
    }
  };

  // clear state function
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    this.textInput.focus();
  };

  render() {
    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length;

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {this.state.gifs.map(gif => <Gif {...gif} />)}

          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>

        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
