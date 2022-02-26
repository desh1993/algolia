import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js'
import React, { createElement, Fragment, useEffect, useRef } from 'react'
import { render } from 'react-dom'
import { SearchBox } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import '@algolia/autocomplete-theme-classic/dist/theme.css';
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
//https://codesandbox.io/s/beautiful-brook-ozj2ls?file=/app.tsx
const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'search',
    limit: 3,
    transformSource({ source, onRemove }) {
        return {
            ...source,
            getItemUrl({ item }) {
                return `https://google.com?q=${item.Title}`;
            },
            templates: {
                ...source.templates,
                header({ state }) {
                    if (state.query) {
                        return null
                    }
                    return (
                        <Fragment>
                            <span className="aa-SourceHeaderTitle">Your searches</span>
                            <div className="aa-SourceHeaderLine" />
                        </Fragment>
                    );
                }
            }
        };
    }
});

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient,
    indexName: 'movies',
    getSearchParams() {
        return recentSearchesPlugin.data.getAlgoliaSearchParams({
            hitsPerPage: 5
        });
    },
    categoryAttribute: [
        'Genre',
    ],
    transformSource({ source, onTapAhead }) {
        return {
            ...source,
            getItemUrl({ item }) {
                return `https://google.com?q=${item.query}`;
            },
            templates: {
                ...source.templates,
                item(params) {
                    const { item } = params;
                    return (
                        <>
                            <div className="aa-SourceHeaderLine" />
                            <div className="aa-ItemTitle">
                                {item.Title}
                            </div>
                        </>
                    )
                }
            }
        }
    }
})

function AutoCompleteComponent(props) {
    const containerRef = useRef(null)
    useEffect(() => {
        console.log(containerRef.current)
        if (!containerRef.current) {
            return undefined
        }

        const search = autocomplete({
            container: containerRef.current,
            renderer: { createElement, Fragment },
            render({ children }, root) {
                render(
                    <div className="aa-Grid">
                        {/* <div className="aa-Results aa-Column">{children}</div> */}
                        <div className="aa-PanelLayout aa-Panel--scollable">{children}</div>
                    </div>, root)
            },
            placeholder: 'Want to Search A Movie?',
            showLoadingIndicator: true,
            cssClasses: {
                root: 'MyCustomSearchBox',
                form: [
                    'MyCustomSearchBoxForm',
                    'MyCustomSearchBoxForm--subclass',
                ],
            },
            defaultActiveItemId: 0,
            plugins: [recentSearchesPlugin],
            ...props
        })

        return () => {
            search.destroy()
        }
    }, [props])

    return (
        <div ref={containerRef} className='MyCustomSearchBox'>
        </div>
    )
}

function ProductItem({
    hit,
    components
}) {
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

function AutoComplete() {
    return (
        <>
            <div className="app-container">
                <AutoCompleteComponent
                    openOnFocus={true}
                    getSources={({ query }) => [
                        {
                            sourceId: 'movies',
                            getItems() {
                                return getAlgoliaResults({
                                    searchClient,
                                    queries: [
                                        {
                                            indexName: 'movies',
                                            query,
                                            params: {
                                                hitsPerPage: 4,
                                            },
                                        },
                                    ],
                                });
                            },
                            getItemUrl({ item }) {
                                return item.poster;
                            },
                            templates: {
                                item({ item, components }) {
                                    return <ProductItem hit={item} components={components} />;
                                },
                            },
                        },

                    ]}

                />
            </div>
        </>
    )
}

export default AutoComplete