import React from "react";
import { useLocation } from "react-router-dom";
import "./searchResultHeader.scss";

const SearchResultHeader: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || "";

    return (
        <div className="search-result-header">
            <div className="search-result-header__has-result">
                The following results are found based on your search “
                <span>{searchQuery}</span>
                ".
            </div>
            <div className="search-result-header__feedback">
                <span className="search-result-header__feedback--desc">Not happy with the search result? </span>
                <span className="search-result-header__feedback--enter" >Click for feedback</span>
            </div>
        </div>
    )
};

export default SearchResultHeader;