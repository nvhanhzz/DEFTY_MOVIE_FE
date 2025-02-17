import React, {useState, useEffect, useRef} from "react";
import "./Carousel.scss";
import RecommendedMovie from "../RecommendedMovie";
import { Movie } from "../MovieCard";

const Carousel: React.FC = () => {
    const movies: Movie[] = [
        {
            name: "Titanic",
            category: ["Drama", "Romance", "Classic"],
            rating: 9.5,
            releaseDate: "1997-12-19",
            description: "Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. Incorporating both historical and fictionalized aspects, it is based on accounts of the sinking of RMS Titanic in 1912. Leonardo DiCaprio and Kate Winslet star as members of different social classes who fall in love during the ship's maiden voyage. The film also features an ensemble cast of Billy Zane, Kathy Bates, Frances Fisher, Bernard Hill, Jonathan Hyde, Danny Nucci, David Warner and Bill Paxton.",
            thumbnail: "https://th.bing.com/th/id/R.667009e0b2d0878fed8c8a2b45af4376?rik=CTuVDirCs9KsrQ&riu=http%3a%2f%2fhdqwalls.com%2fwallpapers%2ftitanic-movie-full-hd.jpg&ehk=shuYoCshdWaPmf8iswXCLMCuKFbhdMKIwKhFoDL2slk%3d&risl=&pid=ImgRaw&r=0",
        },
        // Lặp lại 4 lần nữa
        {
            name: "Naruto",
            category: ["Anime"],
            rating: 9.5,
            releaseDate: "1997-12-19",
            description: "Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. Incorporating both historical and fictionalized aspects, it is based on accounts of the sinking of RMS Titanic in 1912. Leonardo DiCaprio and Kate Winslet star as members of different social classes who fall in love during the ship's maiden voyage. The film also features an ensemble cast of Billy Zane, Kathy Bates, Frances Fisher, Bernard Hill, Jonathan Hyde, Danny Nucci, David Warner and Bill Paxton.",
            thumbnail: "https://img4.goodfon.com/wallpaper/nbig/3/28/by-dennisstelly-uchiha-sasuke-uzumaki-naruto-naruto-anime-ja.jpg",
        },
        {
            name: "Titanic3",
            category: ["Drama", "Romance", "Classic"],
            rating: 9.5,
            releaseDate: "1997-12-19",
            description: "Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. Incorporating both historical and fictionalized aspects, it is based on accounts of the sinking of RMS Titanic in 1912. Leonardo DiCaprio and Kate Winslet star as members of different social classes who fall in love during the ship's maiden voyage. The film also features an ensemble cast of Billy Zane, Kathy Bates, Frances Fisher, Bernard Hill, Jonathan Hyde, Danny Nucci, David Warner and Bill Paxton.",
            thumbnail: "https://th.bing.com/th/id/R.667009e0b2d0878fed8c8a2b45af4376?rik=CTuVDirCs9KsrQ&riu=http%3a%2f%2fhdqwalls.com%2fwallpapers%2ftitanic-movie-full-hd.jpg&ehk=shuYoCshdWaPmf8iswXCLMCuKFbhdMKIwKhFoDL2slk%3d&risl=&pid=ImgRaw&r=0",
        },
        {
            name: "Titanic",
            category: ["Drama", "Romance", "Classic"],
            rating: 9.5,
            releaseDate: "1997-12-19",
            description: "Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. Incorporating both historical and fictionalized aspects, it is based on accounts of the sinking of RMS Titanic in 1912. Leonardo DiCaprio and Kate Winslet star as members of different social classes who fall in love during the ship's maiden voyage. The film also features an ensemble cast of Billy Zane, Kathy Bates, Frances Fisher, Bernard Hill, Jonathan Hyde, Danny Nucci, David Warner and Bill Paxton.",
            thumbnail: "https://th.bing.com/th/id/R.667009e0b2d0878fed8c8a2b45af4376?rik=CTuVDirCs9KsrQ&riu=http%3a%2f%2fhdqwalls.com%2fwallpapers%2ftitanic-movie-full-hd.jpg&ehk=shuYoCshdWaPmf8iswXCLMCuKFbhdMKIwKhFoDL2slk%3d&risl=&pid=ImgRaw&r=0",
        },
        {
            name: "Titanic",
            category: ["Drama", "Romance", "Classic"],
            rating: 9.5,
            releaseDate: "1997-12-19",
            description: "Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. Incorporating both historical and fictionalized aspects, it is based on accounts of the sinking of RMS Titanic in 1912. Leonardo DiCaprio and Kate Winslet star as members of different social classes who fall in love during the ship's maiden voyage. The film also features an ensemble cast of Billy Zane, Kathy Bates, Frances Fisher, Bernard Hill, Jonathan Hyde, Danny Nucci, David Warner and Bill Paxton.",
            thumbnail: "https://th.bing.com/th/id/R.667009e0b2d0878fed8c8a2b45af4376?rik=CTuVDirCs9KsrQ&riu=http%3a%2f%2fhdqwalls.com%2fwallpapers%2ftitanic-movie-full-hd.jpg&ehk=shuYoCshdWaPmf8iswXCLMCuKFbhdMKIwKhFoDL2slk%3d&risl=&pid=ImgRaw&r=0",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Sử dụng useRef để giữ reference của interval
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Hàm khởi động lại interval
    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Xóa interval cũ
        }
        intervalRef.current = setInterval(nextSlide, 5000); // Tạo interval mới
    };

    // Chuyển đến slide tiếp theo
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    };

    // Chuyển đến slide trước đó
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? movies.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        nextSlide();
        resetInterval();
    };
//hello
    // Xử lý khi người dùng bấm nút Prev
    const handlePrev = () => {
        prevSlide();
        resetInterval();
    };

    // Tự động chuyển slide khi component mount
    useEffect(() => {
        resetInterval(); // Khởi động interval khi component được mount

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current); // Dọn dẹp interval khi unmount
            }
        };
    }, [movies.length]);

    return (
        <div className="carousel">
            <div
                className="carousel-container"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {movies.map((movie, index) => (
                    <div className="carousel-slide" key={index}>
                        <RecommendedMovie {...movie} />
                    </div>
                ))}
            </div>

            {/* Nút chuyển slide */}
            <button className="carousel-button prev" onClick={handlePrev}>
                ❮
            </button>
            <button className="carousel-button next" onClick={handleNext}>
                ❯
            </button>

            {/* Dots điều hướng */}
            <div className="carousel-dots">
                {movies.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;