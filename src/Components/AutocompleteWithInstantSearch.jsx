//https://codesandbox.io/s/react-instantsearch-with-autocomplete-sxzt3?file=/src/App.js:1089-1100
import React, { useCallback, useMemo, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import {
    InstantSearch,
    Hits,
    RefinementList,
    Pagination,
    Highlight,
    connectSearchBox,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import { Autocomplete } from './Custom/AutoComplete';
import '../App.css';
import '@algolia/autocomplete-theme-classic/dist/theme.css';

const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);
const VirtualSearchBox = connectSearchBox(() => null);
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'search',
    limit: 5,
});

function ProductItems({ hit, components }) {
    return (
        <>
            <a href={hit.Poster} className="aa-ItemLink">
                <div className="aa-ItemContent">
                    <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>
                    </div>
                    <div className="aa-ItemTitle">
                        <components.Highlight hit={hit} attribute="Title" />
                    </div>
                    <div>
                        <components.ReverseHighlight hit={hit} attribute="Director" />
                    </div>
                </div>
                <div className='aa-ItemActions'>
                    <div className="aa-ItemActions"><button className="aa-ItemActionButton" title="Fill query with &quot;adaptor&quot;"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z"></path></svg></button></div>
                </div>
            </a>
        </>
    )
}

function AutocompleteWithInstantSearch() {
    const [searchState, setSearchState] = useState({})

    const onSubmit = useCallback(
        ({ state }) => {
            console.log('ON submit')
            console.log(state)
            setSearchState(searchState => ({
                ...searchState,
                query: state.query
            }))
        },
        [],
    )

    const onReset = useCallback(
        () => {
            console.log('ON RESET')
            setSearchState(searchState => ({
                ...searchState,
                query: ''
            }))
        },
        [],
    )

    const onStateChange = useCallback(
        (item) => {
            if (item.state.query !== undefined || item.state.query !== '') {
                setSearchState(searchState => ({
                    ...searchState,
                    query: item.state.query
                }))
            }
        },
        [],
    )

    const plugins = useMemo(() => [
        recentSearchesPlugin,
        createQuerySuggestionsPlugin({
            searchClient,
            indexName: 'movies',
            getSearchParams() {
                return recentSearchesPlugin.data.getAlgoliaSearchParams({
                    hitsPerPage: 5
                });
            },
            transformSource({ source, onTapAhead }) {
                console.log(source)
                return {
                    ...source,
                    getItemUrl({ item }) {
                        console.log(item)
                        return ``;
                    },
                    onSelect(params) {
                        const { Title } = params.item
                        setSearchState(searchState => ({
                            ...searchState,
                            query: Title
                        }))
                    },
                    templates: {
                        ...source.templates,
                        item(params) {
                            const { item, components } = params;
                            return (
                                <>
                                    <ProductItems hit={item} components={components} />
                                </>
                            )
                        }
                    }
                }
            }
        })
    ], [])

    return (
        <div>
            <header className="header">
                <h1 className="header-title">
                    <a href="/">AutoComplete</a>
                </h1>
                <p className="header-subtitle">
                    using{' '}
                    <a href="https://github.com/algolia/react-instantsearch">
                        React InstantSearch
                    </a>
                </p>
            </header>
            <div className="container">
                <InstantSearch
                    searchClient={searchClient}
                    indexName="movies"
                    searchState={searchState}
                    onSearchStateChange={setSearchState}
                >
                    {/* A virtual search box is required for InstantSearch to understand the `query` search state property */}
                    <VirtualSearchBox />
                    <div className="search-panel">
                        <div className="search-panel__filters">
                            <RefinementList attribute="Genre" />
                        </div>
                        <div className="search-panel__results">
                            <Autocomplete
                                initialState={{ query: searchState.query }}
                                openOnFocus={true}
                                // onSubmit={onSubmit}
                                // onReset={onReset}
                                onStateChange={onStateChange}
                                plugins={plugins}
                            />
                            <Hits hitComponent={Hit} />
                            <div className="pagination">
                                <Pagination />
                            </div>
                        </div>
                    </div>
                </InstantSearch>
            </div>
        </div>
    )
}

function Hit(props) {
    return (<article>
        <h1>
            <Highlight
                attribute="Title"
                hit={props.hit}
            />
        </h1>
        <div>
            <Highlight attribute="Director" hit={props.hit} />
        </div>
        <br />
        <div className="hit-description">
            <Highlight attribute="Plot" hit={props.hit} />
        </div>
    </article>)
}

Hit.propTypes = {
    hit: PropTypes.object.isRequired,
};
export default AutocompleteWithInstantSearch