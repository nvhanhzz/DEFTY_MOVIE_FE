import { useAuth } from "../hooks/useAuth";
import AdminLayoutDefault from "../layouts/AdminLayoutDefault";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

interface RouteType {
    path: string;
    element: React.ReactElement;
    children?: RouteType[];
}

const AuthRoutes: RouteType[] = [
    {
        path: '',
        element: <LoginPage />,
    },
    {
        path: '*',
        element: <LoginPage />,
    },
];

const DefaultRoutes: RouteType[] = [
    // {
    //     path: '/test',
    //     element: <PrivateRoute element={Test} />,
    // },
    {
        path: '',
        element: <DashboardPage />,
    },
    {
        path: '*',
        element: <DashboardPage />,
    },
];

function AdminRoutes() {
    const isLoggedIn = useAuth();

    return [
        {
            path: PREFIX_URL_ADMIN,
            element: isLoggedIn ? <AdminLayoutDefault /> : <AdminAuthLayout />,
            children: isLoggedIn
                ? DefaultRoutes
                : AuthRoutes,
        }
    ];
};

export default AdminRoutes;