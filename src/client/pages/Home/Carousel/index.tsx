import React, {useState, useEffect, useRef} from "react";
import "./Carousel.scss";
import RecommendedBanner from "../RecommendedBanner";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import {Banner} from "../index.tsx";

interface CarouselProps {
    banners: Banner[];
}

const Carousel: React.FC<CarouselProps> = ({ banners }) => {
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
        if (banners.length <= 1) return;

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(nextSlide, 5000);

        return () => clearInterval(intervalRef.current);
    }, [indexes.currentIndex, banners]);

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