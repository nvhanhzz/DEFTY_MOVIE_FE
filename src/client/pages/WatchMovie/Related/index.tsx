import React, { useEffect, useState } from "react";
import { Episode } from "../index.tsx";
import { getListEpisodeByEpisodeSlug } from "../../../services/episodeService.tsx";
import { message, Spin } from "antd";
import { useTranslation } from "react-i18next";
import SelectCustom from "../../../components/SelectCustom";
import { LoadingOutlined } from "@ant-design/icons";
import './Related.scss';
import {MovieDetailProps} from "../../MovieDetail";
import {Link} from "react-router-dom"; // Import the SCSS file
import { CgMenuGridO } from "react-icons/cg";
import { FcMenu } from "react-icons/fc";

const PREFIX_URL_ALBUM: string = import.meta.env.VITE_PREFIX_URL_ALBUM as string;
const PREFIX_URL_PLAY: string = import.meta.env.VITE_PREFIX_URL_PLAY as string;

interface RelatedProps {
    movie: MovieDetailProps;
    episode: Episode;
}

const Related: React.FC<RelatedProps> = ({ movie, episode }) => {
    const { t } = useTranslation();
    const [episodeOptions, setEpisodeOptions] = useState<string[]>([]);
    const [isListEpisodeLoading, setIsListEpisodeLoading] = useState<boolean>(false);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [selectedOption, setSelectedOption] = useState<number>(0);
    const [episodesTypeShow, setEpisodesTypeShow] = useState<'number' | 'detail'>('number');

    const handleChooseListEpisodes = async (page: number) => {
        setSelectedOption(page);
        fetchListEpisode(page + 1);
    }

    const fetchListEpisode = async (page: number) => {
        setIsListEpisodeLoading(true);
        try {
            const maxEpisodesPerGroup = 24;

            const response = await getListEpisodeByEpisodeSlug(episode.slug as string, page, maxEpisodesPerGroup);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                return;
            }

            setEpisodes(result.data.content);

            const totalEpisodes = result.data.totalElements;

            const episodeOptions = [];
            for (let i = 0; i < totalEpisodes; i += maxEpisodesPerGroup) {
                const start = i + 1;
                const end = Math.min(i + maxEpisodesPerGroup, totalEpisodes);
                if (start <= episode.number && end >= episode.number) {
                    setSelectedOption(i);
                }
                episodeOptions.push(`${start}-${end}`);
            }

            setEpisodeOptions(episodeOptions);
        } catch (error) {
            console.log(error);
            message.error(t('client.message.fetchError'));
        } finally {
            setIsListEpisodeLoading(false);
        }
    }

    useEffect(() => {
        fetchListEpisode(1);
    }, [])

    return (
        <div className="related-container">
            <Link to={`/${PREFIX_URL_ALBUM}/${movie.slug}`} className="movie-title">{movie.title}</Link>
            <div className="select-container">
                <SelectCustom
                    options={episodeOptions}
                    selectedIndex={selectedOption}
                    onSelect={(index: number) => handleChooseListEpisodes(index)}
                />
                <div className="select-container__switch" onClick={() => setEpisodesTypeShow(episodesTypeShow === 'number' ? 'detail' : 'number')}>
                    {
                        episodesTypeShow === 'number' ? <FcMenu className="icon icon-list" /> : <CgMenuGridO className="icon icon-grid" />
                    }
                </div>
            </div>

            {isListEpisodeLoading ? (
                <div className="loading-container">
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                episodesTypeShow === 'number' ?
                    <div className="episode-list-container">
                        {episodes.map((ep: Episode) => (
                            <Link to={`/${PREFIX_URL_PLAY}/${ep.slug}`}
                                  className={`episode-item ${ep.number === episode.number ? "current-item" : ""}`}
                                  key={ep.id}>
                                {ep.number}
                            </Link>
                        ))}
                    </div>
                 :
                    <div className="episode__detail-list-container">
                        {episodes.map((ep: Episode) => (
                            <Link to={`/${PREFIX_URL_PLAY}/${ep.slug}`}
                                  className={`episode-item__detail ${ep.number === episode.number ? "current-item__detail" : ""}`}
                                  key={ep.id}>
                                <img src={ep.thumbnail} alt={ep.description as string}/>
                                <span>{movie.title} Episode {ep.number}</span>
                            </Link>
                        ))}
                    </div>
            )}
        </div>
    );
};

export default Related;