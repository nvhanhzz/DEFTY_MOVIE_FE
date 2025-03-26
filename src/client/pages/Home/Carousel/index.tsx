import React, {useState, useEffect, useRef} from "react";
import "./Carousel.scss";
import RecommendedBanner from "../RecommendedBanner";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import {message, Spin} from "antd";
import {getBanners} from "../../../services/bannerService.tsx";
import {LoadingOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

export interface Banner {
    id: number;
    thumbnail: string;
    title: string;
    link: string;
    contentType: "movie" | "category";
    position: number;
    status: number;
    contentName: string | null;
    contentSlug: string | null;
    subBannerResponse: {
        description: string | null;
        numberOfChild: number | null;
        releaseDate: string | null;
    };
    bannerItems: [];
}

const Carousel: React.FC = () => {
    const { t } = useTranslation();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [indexes, setIndexes] = useState({ prevIndex: -1, currentIndex: 0 });

    const nextSlide = () => {
        setDirection("next");
        setIndexes((prev) => ({
            prevIndex: prev.currentIndex,
            currentIndex: (prev.currentIndex + 1) % banners.length,
        }));
    };

    const prevSlide = () => {
        setDirection("prev");
        setIndexes((prev) => ({
            prevIndex: prev.currentIndex,
            currentIndex: prev.currentIndex === 0 ? banners.length - 1 : prev.currentIndex - 1
        }));
    };

    useEffect(() => {
        const fetchBanners = async () => {
            setIsLoading(true);
            try {
                const response = await getBanners();
                const result = await response.json();
                if (!response.ok || result.status === 404) return;

                const sortedBanners: Banner[] = result.data.content.sort((a: Banner, b: Banner) => a.position - b.position);

                setBanners(sortedBanners);
            } catch (e) {
                console.error(e);
                message.error(t('client.message.fetchError'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(nextSlide, 5000);

        return () => clearInterval(intervalRef.current);
    }, [indexes.currentIndex, banners]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                <Spin indicator={<LoadingOutlined spin />} />
            </div>
        );
    }

    return (
        <div className="carousel">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`carousel-slide 
                    ${index === indexes.currentIndex ? "active" : ""} 
                    ${index === indexes.prevIndex ? (direction === "next" ? "exit-left" : "exit-right") : ""}`}
                >
                    <RecommendedBanner
                        id={banner.id}
                        thumbnail={banner.thumbnail}
                        title={banner.title}
                        link={banner.link}
                        contentType={banner.contentType}
                        position={banner.position}
                        status={banner.status}
                        contentName={banner.contentName}
                        contentSlug={banner.contentSlug}
                        subBannerResponse={banner.subBannerResponse}
                        bannerItems={banner.bannerItems}
                    />
                </div>
            ))}
            {
                banners.length > 1 && (
                    <>
                        <button className="carousel-button prev" onClick={() => { prevSlide(); }}>
                            <GrPrevious/>
                        </button>
                        <button className="carousel-button next" onClick={() => { nextSlide(); }}>
                            <GrNext/>
                        </button>

                        <div className="carousel-dots">
                            {banners.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${index === indexes.currentIndex ? "active" : ""}`}
                                ></span>
                            ))}
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default Carousel;