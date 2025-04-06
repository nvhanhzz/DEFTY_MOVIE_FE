import React, {useEffect, useRef, useState} from "react";
import { MdOutlineStar } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { RiVipCrown2Fill } from "react-icons/ri";
import { MdOutlineIosShare } from "react-icons/md";
import { IoDownloadOutline } from "react-icons/io5";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import "./MovieInformation.scss";
import { MovieDetailProps } from "../index.tsx";
import dayjs from "dayjs";
import {DownOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";

const PREFIX_URL_CATEGORY = import.meta.env.VITE_PREFIX_URL_CATEGORY as string;
const PREFIX_URL_CAST = import.meta.env.VITE_PREFIX_URL_CAST as string;
const PREFIX_URL_DIRECTOR = import.meta.env.VITE_PREFIX_URL_DIRECTOR as string;
const PREFIX_URL_PLAY = import.meta.env.VITE_PREFIX_URL_PLAY as string;

const MovieInformation: React.FC<MovieDetailProps> = ({
                                                 title,
                                                 rating,
                                                 releaseDate,
                                                 duration,
                                                 description,
                                                 coverImage,
                                                 trailer,
                                                 director,
                                                 category,
                                                 actor,
                                                slug
                                            }) => {
    const navigate = useNavigate();
    console.log(trailer);

    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const [descriptionClamped, setDescriptionClamped] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    useEffect(() => {
        if (descriptionRef.current) {
            const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight, 10);
            const totalHeight = descriptionRef.current.scrollHeight;
            const totalLines = Math.floor(totalHeight / lineHeight);

            setDescriptionClamped(totalLines > 3);
        }
    }, [description]);

    return (
        <div className="movie-information-container">
            <div className="movie-information">
                <div className="movie-information-overlay">
                    <div className="movie-information-content">
                        <h1 className="movie-title">{title}</h1>
                        <div className="movie-badge">
                            <span className="movie-badge-top">TOP 1</span>
                            <span className="movie-badge-hot">Hot</span>
                        </div>
                        <p className="movie-info">
                            <span className="movie-rating">
                                <MdOutlineStar/> {rating ? rating : '0'}
                            </span>
                            {releaseDate && (
                                <>
                                    <span className="movie-info-break">|</span>
                                    <span className="movie-release-date">{dayjs(releaseDate).format('YYYY')}</span>
                                </>
                            )}
                            {duration !== null && duration !== undefined && (
                                <>
                                    <span className="movie-info-break">|</span>
                                    <span className="movie-duration">{duration}</span>
                                </>
                            )}
                        </p>
                        {category && (
                            <div className="movie-category">
                                {category.map((tag, index) => (
                                    <Link to={`/${PREFIX_URL_CATEGORY}/${tag.slug}`} key={index} className="movie-tag">
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <div className="vip-button">
                            <RiVipCrown2Fill className="vip-button-icon" /> First month only đ23,000
                        </div>
                        {director && (
                            <p className="movie-cast">Director: <Link to={`/${PREFIX_URL_DIRECTOR}/${director.slug}`} className="movie-cast-content">{director.name}</Link></p>
                        )}
                        {actor && (
                            <p className="movie-cast">
                                Cast:
                                {
                                    actor.map((item, index) => (
                                        index !== actor.length - 1 ?
                                            <Link to={`/${PREFIX_URL_CAST}/${item.slug}`} className="movie-cast-content" key={index}>{item.name}, </Link> :
                                            <Link to={`/${PREFIX_URL_CAST}/${item.slug}`} className="movie-cast-content" key={index}>{item.name}</Link>
                                        )
                                    )
                                }
                            </p>
                        )}
                        <p
                            className={`movie-description ${descriptionExpanded ? "expanded" : "clamped"}`}
                            ref={descriptionRef}
                        >
                            {/*<span className="movie-description-title">Description:</span> Chu Li just graduated from university. With a passion towards publishing, she successfully entered Yuan Yue Publishing House. However, at the moment the publishing industry undergoes huge changes. As a fresh editor, she was shocked by the state of the publishing industry but she stayed true and gave it all in becoming an author focusing on producing good books. Together with Yuan Yue Publishing House, they braved the impact of social change. With sincerity and professionalism, she impressed the renowned author and joined them as the exclusive editor. Chu Li also helped authors that are in struggle and transformed them. She discovered new authors with her unique vision. In the end, she overcame obstacles in career and paved her way becoming the top editor. With that, she earned a love relationship with a renowned author that involved work interaction, argument and happiness.*/}
                            <span className="movie-description-title">Description:</span> {description}
                        </p>
                        {descriptionClamped && (
                            <button className="toggle-button" onClick={() => setDescriptionExpanded(!descriptionExpanded)}>
                                {descriptionExpanded ? "Collapse " : "More "}
                                <DownOutlined className={`icon ${descriptionExpanded ? "open" : ""}`} />
                            </button>
                        )}
                    </div>
                    <div className="movie-information-buttons">
                        <div className="button play-button" onClick={() => {navigate(`/${PREFIX_URL_PLAY}/${slug}`)}}><FaPlay /> Play</div>
                        <div className="button other-button"><MdOutlineIosShare /><span>Share</span></div>
                        <div className="button other-button"><IoDownloadOutline /><span>APP</span></div>
                        <div className="button other-button"><MdOutlineBookmarkAdd /><span>Watch Later</span></div>
                    </div>
                </div>

                <div className="movie-information-thumbnail">
                    <div className="movie-information-thumbnail-inner">
                        <img src={coverImage} alt="cover-image" />
                        <div className="top-layer"></div>
                        <div className="left-layer"></div>
                        <div className="bottom-layer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieInformation;