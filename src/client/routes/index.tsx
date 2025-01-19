import ClientLayoutDefault from "../layouts/ClientLayoutDefault";
import Home from "../pages/Home";
import Test from "../pages/Test";
import Profile from "../pages/Profile";
import PersonalSettings from "../pages/Profile/PersonalSettings";
import History from "../pages/Profile/History";
import Favorites from "../pages/Profile/Favorites";
import Booked from "../pages/Profile/Booked";
import Subtitles from "../pages/Profile/Subtitles";

const ClientRoutes = () => [
    {
        path: '/',
        element: <ClientLayoutDefault />,
        children: [
            { path: '', element: <Home /> },
            { path: 'test', element: <Test /> },
            {
                path: 'profile',
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
