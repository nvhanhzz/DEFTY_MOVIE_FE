import React from 'react';
import SearchResultHeader from "./SearchResultHeader";
import ListMovie from "./ListMovie";
import PopularSearch from "./PopularSearch";
import "./searchResult.scss";

const SearchResult: React.FC = () => {

    return (
        <div className="search-result">
            <SearchResultHeader />
            <div className="search-result__content">
                <div className="search-result__content--container">
                    <div className="search-result__content--container--list-movie">
                        <ListMovie />
                    </div>
                    <div className="search-result__content--container--hot-search">
                        <PopularSearch />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;