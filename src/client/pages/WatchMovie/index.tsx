import React from "react";
import "./WatchMovie.scss";
import MovieInformation from "./MovieInformation";
import PlayVideo from "./PlayVideo";
import Related from "./Related";
import Recommended from "./Recommended";
import Comments from "./Comments";

const WatchMovie: React.FC = () => {
    return (
        <div className="watch-movie-wrapper">
            <div className="watch-movie-container">
                <div className="watch-movie-main-block">
                    <div className="watch-movie-main-block__play">
                        <PlayVideo />
                    </div>

                    <div className="watch-movie-main-block__related_play">
                        <Related />
                    </div>
                </div>

                <div className="watch-movie-bottom-block">
                    <div className="watch-movie-information-container">
                        <div className="watch-movie-information-container__left">
                            <MovieInformation />
                        </div>

                        <div className="watch-movie-information-container__right">
                            Right information (Ex: drama, movies ...)
                        </div>
                    </div>

                    <div className="watch-movie-recommended">
                        <Recommended />
                    </div>

                    <div className="watch-movie-comments">
                        <Comments />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WatchMovie;