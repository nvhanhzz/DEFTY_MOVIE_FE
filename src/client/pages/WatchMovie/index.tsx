import React, {useEffect, useState} from "react";
import "./WatchMovie.scss";
import MovieInformation from "./MovieInformation";
import PlayVideo from "./PlayVideo";
import Related from "./Related";
import Recommended from "./Recommended";
import Comments from "./Comments";

const WatchMovie: React.FC = () => {
    const [showEpisodesBottom, setShowEpisodesBottom] = useState<boolean>(false);

    const updateVisibleListEpisode = () => {
        const width = window.innerWidth;
        if(width < 1024) {
            setShowEpisodesBottom(true)
        } else {
            setShowEpisodesBottom(false)
        }
    };

    useEffect(() => {
        updateVisibleListEpisode();
        window.addEventListener('resize', updateVisibleListEpisode);

        return () => {
            window.removeEventListener('resize', updateVisibleListEpisode);
        };
    }, []);

    return (
        <div className="watch-movie-wrapper">
            <div className="watch-movie-container">
                <div className="watch-movie-main-block">
                    <div className="watch-movie-main-block__play">
                        <PlayVideo />
                    </div>

                    {!showEpisodesBottom && (
                        <div className="watch-movie-main-block__related_play">
                            <Related />
                        </div>
                    )}
                </div>

                <div className="watch-movie-bottom-block">
                    <div className="watch-movie-information-container">
                        <div className="watch-movie-information-container__left">
                            <MovieInformation />
                        </div>

                        {showEpisodesBottom && (
                            <div className="watch-movie-information-container__middle">
                                <Related />
                            </div>
                        )}

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