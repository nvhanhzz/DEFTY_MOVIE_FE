import ClientLayoutDefault from "../layouts/ClientLayoutDefault";
import Home from "../pages/Home";
import Test from "../pages/Test";

const ClientRoutes = () => [
    {
        path: '/',
        element: <ClientLayoutDefault />,
        children: [
            { path: '/test', element: <Test /> },
            { path: '', element: <Home /> },
        ]
    }
];

export default ClientRoutes;