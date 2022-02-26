import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  DynamicWidgets,
  RefinementList,
  Pagination,
  Highlight,
  connectPagination,
  ClearRefinements,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';

const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);

const NewPagination = ({ currentRefinement, nbPages, refine, createURL }) => (
  <ul>
    {new Array(nbPages).fill(null).map((_, index) => {
      const page = index + 1;
      const style = {
        fontWeight: currentRefinement === page ? 'bold' : '',
      };

      return (
        <li key={index}>
          <a
            href={createURL(page)}
            style={style}
            onClick={event => {
              event.preventDefault();
              refine(page);
            }}
          >
            {page}
          </a>
        </li>
      );
    })}
  </ul>
);

function App() {
  const CustomPagination = connectPagination(NewPagination);
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">ais-ecommerce-demo-app</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <InstantSearch searchClient={searchClient} indexName="movies">
          <div className="left-panel">
            <ClearRefinements />
            <h2>Genre</h2>
            <RefinementList attribute="Genre" />
            <Configure hitsPerPage={8} />
          </div>
          <div className="right-panel">
            <SearchBox />
            <Hits hitComponent={Hit} />
            <Pagination />
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

function Hit(props) {
  return (
    <article>
      <h1>
        <Highlight attribute="Title" hit={props.hit} />
      </h1>
      <div>
        <Highlight attribute="Director" hit={props.hit} />
      </div>
      <br />
      <div className="hit-description">
        <Highlight attribute="Plot" hit={props.hit} />
      </div>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
}

export default App;
