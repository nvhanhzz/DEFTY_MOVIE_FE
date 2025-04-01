import React, { useState, useEffect, useRef } from 'react';
import { CiSearch } from "react-icons/ci";
import { FiTrash2 } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";
import "./Search.scss";
import { message } from "antd";
import { searchMovie } from "../../../services/movieService.tsx";
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie.tsx';
import {useNavigate} from "react-router-dom";

const PREFIX_URL_SEARCH: string = import.meta.env.VITE_PREFIX_URL_SEARCH as string;

const Search: React.FC = () => {
    const [movieTitles, setMovieTitles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [showSuggest, setShowSuggest] = useState<boolean>(false);
    const historyRef = useRef<HTMLDivElement>(null);
    const suggestRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const history = getCookie("searchHistory");
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {

            if (historyRef.current && !historyRef.current.contains(e.target as Node)
                && searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
                setShowHistory(false);
            } else if (suggestRef.current && !suggestRef.current.contains(e.target as Node)
                && searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
                setShowSuggest(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside); // Dọn dẹp event listener khi component bị unmount
        };
    }, []);

    const saveSearchHistory = (newQuery: string) => {
        const updatedHistory = [newQuery, ...searchHistory.filter((item) => item !== newQuery)];
        setCookie("searchHistory", JSON.stringify(updatedHistory));
        setSearchHistory(updatedHistory);
    };

    const searchOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.value;
        setQuery(key);

        if (!key.trim()) {
            setShowSuggest(false);
            setShowHistory(searchHistory.length > 0);
            return;
        }

        setIsLoading(true);
        setShowHistory(false);
        try {
            const response = await searchMovie(key);
            const result = await response.json();
            if (!response.ok || result.status === 404) return;

            setMovieTitles(result.data.map((item: { name: string }) => item.name));

            if (result.data.length > 0) {
                setShowSuggest(true);
            }
        } catch (e) {
            console.error(e);
            message.error('Error fetching movies');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFocus = () => {
        if (!query.trim()) {
            setShowHistory(searchHistory.length > 0);
        }
    };

    const handleClearHistory = () => {
        deleteCookie("searchHistory");
        setSearchHistory([]);
        setShowHistory(false);
    };

    const handleItemHistoryDelete = (title: string, e: React.MouseEvent) => {
        e.stopPropagation();

        const updatedHistory = searchHistory.filter((item) => item !== title);
        if (updatedHistory.length === 0) {
            setShowHistory(false);
        }
        setCookie("searchHistory", JSON.stringify(updatedHistory));
        setSearchHistory(updatedHistory);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            handleSearch(query);
        }
    };

    const handleSearch = (title: string) => {
        setQuery(title);
        saveSearchHistory(title);
        setShowHistory(false);
        setShowSuggest(false);
        navigate(`/${PREFIX_URL_SEARCH}?query=${title}`);
    };

    return (
        <>
            <div className="search-form">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="search"
                    value={query}
                    onChange={searchOnChange}
                    onFocus={handleFocus}
                    onKeyPress={handleKeyPress}
                />
                <CiSearch onClick={() => handleSearch(query)} />
                {showHistory && searchHistory.length > 0 && query.trim() === "" && (
                    <div ref={historyRef} className="search-history">
                        <div className="search-history__header">
                            <div className="search-history__header--title">
                                Search History
                            </div>
                            <div className="search-history__header--clear" onClick={handleClearHistory}>
                                <FiTrash2 />
                            </div>
                        </div>

                        <div className="search-history__list">
                            {searchHistory.slice(Math.min(0, searchHistory.length - 20), searchHistory.length).map((item, index) => (
                                <div
                                    key={index}
                                    className="search-history__list--item"
                                    onClick={() => handleSearch(item)}
                                >
                                    <span className="search-history__list--item-title">{item}</span>
                                    <TiDelete className="search-history__list--item-delete" onClick={(e) => handleItemHistoryDelete(item, e)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isLoading && <div className="loading-indicator">Loading...</div>}
                {showSuggest && movieTitles.length > 0 && !isLoading && query.trim() !== "" && (
                    <div ref={suggestRef} className="results">
                        {movieTitles.map((title, index) => (
                            <div key={index}
                                 className="result-item"
                                 onClick={() => handleSearch(title)}
                            >
                                {title}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {(showHistory || showSuggest) && (
                <div className="search-mark">
                </div>
            )}
        </>
    );
};

export default Search;