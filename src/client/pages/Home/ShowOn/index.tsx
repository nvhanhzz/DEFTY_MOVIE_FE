import React, { useRef, useState, useEffect } from 'react';
import "./ShowOn.scss";
import { ShowOnInterface } from "../index.tsx";
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";
import MovieCard, { MovieShowOn } from "../MovieCard";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ShowOn: React.FC<ShowOnInterface> = ({ contentName, contentItems }) => {
    const sliderRef = useRef<Slider | null>(null);

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [slidesToShow, setSlidesToShow] = useState(8);

    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setSlidesToShow(3);
        } else if (window.innerWidth <= 992) {
            setSlidesToShow(4);
        } else if (window.innerWidth <= 1600) {
            setSlidesToShow(6);
        } else {
            setSlidesToShow(8);
        }
    };

    useEffect(() => {
        // Đăng ký sự kiện resize để thay đổi slidesToShow
        window.addEventListener('resize', handleResize);

        // Gọi hàm resize để cập nhật slidesToShow khi component được mount
        handleResize();

        // Cleanup event listener khi component bị unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const settings = {
        className: 'section-outstanding__slider',
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        initialSlide: 0,
        beforeChange: (_current: number, next: number) => {
            if (next === 0) {
                setIsAtStart(true); // Khi slider chuyển đến slide đầu tiên
            } else {
                setIsAtStart(false); // Khi không phải slide đầu tiên
            }
        },
        afterChange: (current: number) => {
            // Kiểm tra xem slider có đang ở cuối không dựa trên số lượng slide hiển thị
            if (current === contentItems.length - slidesToShow) {
                setIsAtEnd(true); // Nếu đang ở cuối slider
            } else {
                setIsAtEnd(false); // Nếu không phải cuối slider
            }
        }
    };

    return (
        <div className="show-on">
            <h2 className="show-on__title">{contentName}</h2>

            <div className="show-on__content">
                {!isAtStart && (
                    <div className="custom-slick-prev" onClick={previous}>
                        <GrPrevious />
                    </div>
                )}

                <Slider ref={sliderRef} {...settings}>
                    {
                        contentItems.map((item: MovieShowOn, index) => {
                            return (
                                <div className="test" key={index}>
                                    <MovieCard {...item} />
                                </div>
                            );
                        })
                    }
                </Slider>

                {!isAtEnd && (
                    <div className="custom-slick-next" onClick={next}>
                        <GrNext />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowOn;