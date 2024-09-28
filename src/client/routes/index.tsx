import ClientLayoutDefault from "../layouts/ClientLayoutDefault";
import Home from "../pages/Home";

const ClientRoutes = () => [
    {
        path: '/',
        element: <ClientLayoutDefault />,
        children: [
            { path: '', element: <Home /> },
        ]
    }
];

export default ClientRoutes;