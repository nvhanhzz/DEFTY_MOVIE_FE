import ClientLayoutDefault from "../layouts/ClientLayoutDefault";
import Home from "../pages/Home";
import Test from "../pages/Test";
import Profile from "../pages/Profile";
import PersonalSettings from "../pages/Profile/PersonalSettings";
import History from "../pages/Profile/History";
import Favorites from "../pages/Profile/Favorites";
import Booked from "../pages/Profile/Booked";
import Subtitles from "../pages/Profile/Subtitles";
import MovieDetail from "../pages/MovieDetail";
import WatchMovie from "../pages/WatchMovie";
import SearchResult from "../pages/SearchResult";

const PREFIX_URL_ALBUM: string = import.meta.env.VITE_PREFIX_URL_ALBUM as string;
const PREFIX_URL_PLAY: string = import.meta.env.VITE_PREFIX_URL_PLAY as string;
const PREFIX_URL_PROFILE: string = import.meta.env.VITE_PREFIX_URL_PROFILE as string;
const PREFIX_URL_SEARCH: string = import.meta.env.VITE_PREFIX_URL_SEARCH as string;

const ClientRoutes = () => [
    {
        path: '/',
        element: <ClientLayoutDefault />,
        children: [
            { path: '', element: <Home /> },
            { path: 'test', element: <Test /> },
            { path: `/${PREFIX_URL_ALBUM}/:slug`, element: <MovieDetail /> },
            { path: `/${PREFIX_URL_PLAY}/:slug`, element: <WatchMovie /> },
            { path: `/${PREFIX_URL_SEARCH}`, element: <SearchResult /> },
            { path: `*`, element: <Home /> },
            {
                path: PREFIX_URL_PROFILE,
                element: <Profile />,
                children: [
                    { path: '', element: <PersonalSettings /> },
                    { path: 'history', element: <History /> },
                    { path: 'favorites', element: <Favorites /> },
                    { path: 'booked', element: <Booked /> },
                    { path: 'subtitles', element: <Subtitles /> },
                ]
            }
        ]
    }
];

export default ClientRoutes;
