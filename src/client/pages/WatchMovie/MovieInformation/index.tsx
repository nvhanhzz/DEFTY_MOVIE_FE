import React, { useEffect, useRef, useState } from "react";
import "./MovieInformation.scss";
import { MovieDetailProps } from "../../MovieDetail";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import CircleCast, { Person } from "../../../components/CircleCast";
import { GrFormNext, GrFormPrevious } from "react-icons/gr"; // Import icons for next and previous
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PREFIX_URL_ALBUM: string = import.meta.env.VITE_PREFIX_URL_ALBUM as string;
const PREFIX_URL_CATEGORY: string = import.meta.env.VITE_PREFIX_URL_CATEGORY as string;

const MovieInformation: React.FC<{ movieInfo: MovieDetailProps }> = ({ movieInfo }) => {
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const [descriptionClamped, setDescriptionClamped] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    const persons = [
        movieInfo.director && { ...movieInfo.director, type: "director", avatar: movieInfo.director.thumbnail },
        ...movieInfo.actor.map((actor) => ({ ...actor, type: "actor" }))
    ].filter(Boolean);

    useEffect(() => {
        if (descriptionRef.current) {
            const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight, 10);
            const totalHeight = descriptionRef.current.scrollHeight;
            const totalLines = Math.floor(totalHeight / lineHeight);

            setDescriptionClamped(totalLines > 3);
        }
    }, [movieInfo.description]);

    const [slidesToShow, setSlidesToShow] = useState(6);
    const sliderRef = useRef<Slider | null>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setSlidesToShow(4);
        } else if (window.innerWidth <= 1600) {
            setSlidesToShow(6);
        } else {
            setSlidesToShow(7);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const settings = {
        className: 'movie-persons__slider',
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow,
        slidesToScroll: slidesToShow,
        initialSlide: 0,
        centerMode: false,
        beforeChange: (_current: number, next: number) => {
            if (next === 0) {
                setIsAtStart(true); // Khi slider chuyển đến slide đầu tiên
            } else {
                setIsAtStart(false); // Khi không phải slide đầu tiên
            }
        },
        afterChange: (current: number) => {
            // Kiểm tra xem slider có đang ở cuối không dựa trên số lượng slide hiển thị
            if (current === persons.length - slidesToShow) {
                setIsAtEnd(true); // Nếu đang ở cuối slider
            } else {
                setIsAtEnd(false); // Nếu không phải cuối slider
            }
        }
    };

    const next = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const previous = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    return (
        <div className="movie-information-container">
            {movieInfo.title && (
                <Link to={`/${PREFIX_URL_ALBUM}/${movieInfo.slug}`} className="movie-title">
                    {movieInfo.title}
                </Link>
            )}

            {movieInfo.rating != null && (
                <div className="movie-rating">
                    <Link to={`/${PREFIX_URL_ALBUM}/${movieInfo.slug}`}>Rating: {movieInfo.rating}</Link>
                </div>
            )}

            {movieInfo.releaseDate && (
                <div className="movie-release-date">{dayjs(movieInfo.releaseDate).format("YYYY")}</div>
            )}

            {movieInfo.category && movieInfo.category.length > 0 && (
                <div className="movie-categories">
                    <ul>
                        {movieInfo.category.map((cat) => (
                            <li key={cat.slug}>
                                <Link to={`/${PREFIX_URL_CATEGORY}/${cat.slug}`}>{cat.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="movie-description-container">
                <div ref={descriptionRef} className={`movie-description ${descriptionExpanded ? "expanded" : "clamped"}`}>
                    <span className="movie-description-label">Description: </span>
                    <span>{movieInfo.description}</span>
                </div>
                {descriptionClamped && (
                    <button className="toggle-button" onClick={() => setDescriptionExpanded(!descriptionExpanded)}>
                        {descriptionExpanded ? "Collapse " : "More "}
                        <DownOutlined className={`icon ${descriptionExpanded ? "open" : ""}`} />
                    </button>
                )}
            </div>

            {persons.length > 0 && (
                <div className="movie-persons">
                    <div className={`custom-slick-prev ${isAtStart ? "un-display" : ""}`} onClick={previous}>
                        <GrFormPrevious />
                    </div>

                    {/* Slider for persons */}
                    <Slider ref={sliderRef} {...settings}>
                        {persons.map((person) => (
                            <div key={person.slug} className="movie-persons__item">
                                <CircleCast person={person as Person} />
                            </div>
                        ))}
                    </Slider>

                    <div className={`custom-slick-next ${(isAtEnd || slidesToShow >= movieInfo.actor.length + 1) ? "un-display" : ""}`} onClick={next}>
                        <GrFormNext />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieInformation;