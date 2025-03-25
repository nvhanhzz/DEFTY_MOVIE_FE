import React from "react";
import { MdOutlineStar } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import "./RecommendedBanner.scss";
import {Banner} from "../Carousel";
import dayjs from "dayjs";
import {Link, useNavigate} from "react-router-dom";

const PREFIX_URL_CATEGORY: string = import.meta.env.VITE_PREFIX_URL_CATEGORY as string;
const PREFIX_URL_PLAY: string = import.meta.env.VITE_PREFIX_URL_PLAY as string;

const RecommendedBanner: React.FC<Banner> = (banner: Banner) => {
    const bannerItemKeys: string[] = Object.keys(banner.bannerItems);
    const bannerItemValues: string[] = Object.values(banner.bannerItems);
    const navigate = useNavigate();
    const linkTo =
        banner.contentType === "movie"
            ? `${PREFIX_URL_PLAY}/${banner.contentSlug}`
            : banner.contentType === "category"
                ? `${PREFIX_URL_CATEGORY}/${banner.contentSlug}`
                : null;

    return (
        <div
            className="recommended-banner"
            style={{ backgroundImage: `url(${banner.thumbnail})` }}
            onClick={() => navigate(linkTo as string)}
        >
            <div className="recommended-banner-overlay">
                <div className="recommended-banner-content">
                    <h1 className="banner-title">{banner.contentName}</h1>
                    <p className="banner-info">
                        <span className="banner-rating">
                            <MdOutlineStar/> {5}
                        </span>
                        {banner.subBannerResponse.releaseDate &&
                            (
                                <>
                                    {" "}|{" "}
                                    <span className="banner-release-date">{dayjs(banner.subBannerResponse.releaseDate).format("YYYY")}</span>
                                </>
                            )
                        }
                        {banner.subBannerResponse.numberOfChild as number > 0 &&
                            (
                                <>
                                    {" "}|{" "}
                                    <span className="banner-number-of-child">{banner.subBannerResponse.numberOfChild} Episodes</span>
                                </>
                            )
                        }
                    </p>
                    <div className="banner-category">
                        {
                            bannerItemKeys.map((category, index) => (
                            <Link to={`${PREFIX_URL_CATEGORY}/${bannerItemValues[index]}`}
                                key={category + banner.id}
                                className="banner-tag"
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                    <p className="banner-description">{banner.subBannerResponse.description}</p>
                </div>
                <div className="recommended-banner-buttons">
                    <div className="play-icon">
                        <FaPlay />
                    </div>
                    <div className="bookmark-icon">
                        <MdOutlineBookmarkAdd />
                    </div>
                </div>
            </div>
            <div className="left-layer"></div>
            <div className="top-layer"></div>
            <div className="right-layer"></div>
            <div className="bottom-layer"></div>
        </div>
    );
};

export default RecommendedBanner;