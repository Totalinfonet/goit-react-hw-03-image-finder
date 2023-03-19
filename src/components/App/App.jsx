import React, { Component } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import Loader from '../Loader/Loader';

const API_KEY = '33365759-bdd854990cd5a8ba018a7d8b1';
const BASE_URL = 'https://pixabay.com/api/';

export class App extends Component {
  state = {
    images: [],
    error: null,
    query: '',
    page: 1,
    loading: false,
    showModal: false,
    selectedImage: null,
    selectedImageLoaded: false,
  };

  componentDidUpdate(_, prevState) {
    if (
      prevState.images !== this.state.images &&
      this.state.images.length > 0
    ) {
      this.setState({ loading: false });
    }
  }

  handleChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { query } = this.state;

    this.setState({ loading: true });
    try {
      const params = `?q=${query}&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

      const response = await axios.get(BASE_URL + params);
      if (response.data.hits.length > 0) {
        this.setState({ images: response.data.hits, error: null, page: 1 });
      } else {
        this.setState({ images: [], error: null, page: 1 });
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    } catch (error) {
      this.setState({ error, loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleLoadMore = async () => {
    const { query, page } = this.state;
    this.setState({ loading: true });

    try {
      const params = `?q=${query}&page=${
        page + 1
      }&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

      const response = await axios.get(BASE_URL + params);

      this.setState(prevState => ({
        images: [...prevState.images, ...response.data.hits],
        error: null,
        page: prevState.page + 1,
      }));
    } catch (error) {
      this.setState({ error, loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleImageClick = image => {
    this.setState({
      showModal: true,
      selectedImage: image,
      selectedImageLoaded: false,
    });
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
  };

  handleModalKeyDown = event => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.handleModalClose();
    }
  };

  handleImageLoad = () => {
    this.setState({ selectedImageLoaded: true });
  };

  render() {
    const {
      images,
      error,
      showModal,
      selectedImage,
      selectedImageLoaded,
      loading,
    } = this.state;

    return (
      <div className="app">
        <header className="searchbar">
          <form className="form" onSubmit={this.handleSubmit}>
            <button type="submit" className="button">
              <span className="button-label">Search</span>
            </button>

            <input
              className="input"
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="Search images and photos"
              onChange={this.handleChange}
            />
          </form>
        </header>

        {loading && <Loader />}

        {error && <div>Something went wrong: {error.message}</div>}

        <ul className="gallery">
          {images.map(({ id, webformatURL, largeImageURL }) => (
            <li key={id} className="gallery-item">
              <img
                className="image"
                src={webformatURL}
                alt=""
                onClick={() =>
                  this.handleImageClick({ id, webformatURL, largeImageURL })
                }
              />
            </li>
          ))}
        </ul>
        {images.length > 0 && images.length % 12 === 0 && (
          <button className="load-btn" onClick={this.handleLoadMore}>
            Load more
          </button>
        )}
        {showModal && (
          <div
            className="overlay"
            onClick={this.handleModalClose}
            onKeyDown={this.handleModalKeyDown}
            tabIndex="0"
          >
            <div className="modal">
              {!selectedImageLoaded && <Loader />}
              <img
                src={selectedImage.largeImageURL}
                alt=""
                onLoad={this.handleImageLoad}
                style={{ display: selectedImageLoaded ? 'block' : 'none' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}