import Carousel from "../../components/Carousel";
import ListMovieCard from "../../components/ListMovieCard";
import {Movie} from "../../components/MovieCard";

function Home() {

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
            description: "Naruto[a] is a Japanese manga series written and illustrated by Masashi Kishimoto. It tells the story of Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village. The story is told in two parts: the first is set in Naruto's pre-teen years (volumes 1–27), and the second in his teens (volumes 28–72). The series is based on two one-shot manga by Kishimoto: Karakuri (1995), which earned Kishimoto an honorable mention in Shueisha's monthly Hop Step Award the following year, and Naruto (1997).",
            "thumbnail": "https://th.bing.com/th/id/R.ef7acaddd7c1e6f080e11ffb5fb934a9?rik=spacnim%2f8s29Sw&riu=http%3a%2f%2fpm1.aminoapps.com%2f6282%2f50dd338e4d8514842990da19aa56b4a24e919269_00.jpg&ehk=ORB5UqgwdnQEGecOFPnSeOnBTogwYUaK9uA1T1gUufs%3d&risl=&pid=ImgRaw&r=0",
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
        {
            name: "Naruto",
            category: ["Anime"],
            rating: 9.5,
            releaseDate: "1997-12-19",
            description: "Naruto[a] is a Japanese manga series written and illustrated by Masashi Kishimoto. It tells the story of Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village. The story is told in two parts: the first is set in Naruto's pre-teen years (volumes 1–27), and the second in his teens (volumes 28–72). The series is based on two one-shot manga by Kishimoto: Karakuri (1995), which earned Kishimoto an honorable mention in Shueisha's monthly Hop Step Award the following year, and Naruto (1997).",
            "thumbnail": "https://th.bing.com/th/id/R.ef7acaddd7c1e6f080e11ffb5fb934a9?rik=spacnim%2f8s29Sw&riu=http%3a%2f%2fpm1.aminoapps.com%2f6282%2f50dd338e4d8514842990da19aa56b4a24e919269_00.jpg&ehk=ORB5UqgwdnQEGecOFPnSeOnBTogwYUaK9uA1T1gUufs%3d&risl=&pid=ImgRaw&r=0",
        },
        {
            name: "Naruto",
            category: ["Anime"],
            rating: 9.5,
            releaseDate: "1997-12-19",
            description: "Naruto[a] is a Japanese manga series written and illustrated by Masashi Kishimoto. It tells the story of Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village. The story is told in two parts: the first is set in Naruto's pre-teen years (volumes 1–27), and the second in his teens (volumes 28–72). The series is based on two one-shot manga by Kishimoto: Karakuri (1995), which earned Kishimoto an honorable mention in Shueisha's monthly Hop Step Award the following year, and Naruto (1997).",
            "thumbnail": "https://th.bing.com/th/id/R.ef7acaddd7c1e6f080e11ffb5fb934a9?rik=spacnim%2f8s29Sw&riu=http%3a%2f%2fpm1.aminoapps.com%2f6282%2f50dd338e4d8514842990da19aa56b4a24e919269_00.jpg&ehk=ORB5UqgwdnQEGecOFPnSeOnBTogwYUaK9uA1T1gUufs%3d&risl=&pid=ImgRaw&r=0",
        },
        {
            name: "Naruto",
            category: ["Anime"],
            rating: 9.5,
            releaseDate: "1997-12-19",
            description: "Naruto[a] is a Japanese manga series written and illustrated by Masashi Kishimoto. It tells the story of Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village. The story is told in two parts: the first is set in Naruto's pre-teen years (volumes 1–27), and the second in his teens (volumes 28–72). The series is based on two one-shot manga by Kishimoto: Karakuri (1995), which earned Kishimoto an honorable mention in Shueisha's monthly Hop Step Award the following year, and Naruto (1997).",
            "thumbnail": "https://th.bing.com/th/id/R.ef7acaddd7c1e6f080e11ffb5fb934a9?rik=spacnim%2f8s29Sw&riu=http%3a%2f%2fpm1.aminoapps.com%2f6282%2f50dd338e4d8514842990da19aa56b4a24e919269_00.jpg&ehk=ORB5UqgwdnQEGecOFPnSeOnBTogwYUaK9uA1T1gUufs%3d&risl=&pid=ImgRaw&r=0",
        },
    ];

    return (
        <>
            <Carousel />
            <ListMovieCard listTitle="Popular" movies={movies} />
        </>
    );
}

export default Home;