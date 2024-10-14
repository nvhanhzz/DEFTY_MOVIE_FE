import { useAuth } from "../hooks/useAuth";
import AdminLayoutDefault from "../layouts/AdminLayoutDefault";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import Test from "../pages/Test";
import RolePage from "../pages/Role";
import CreateRole from "../pages/Role/Create"; // Import trang tạo mới Role
import EditRole from "../pages/Role/Update"; // Import trang sửa Role
import SettingPage from "../pages/Setting";
import PermissionsPage from "../pages/Permission";
import CreatePermission from "../pages/Permission/Create";
import EditPermission from "../pages/Permission/Update";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

interface RouteType {
    path: string;
    element: React.ReactElement;
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
    {
        path: 'test',
        element: <Test />,
    },
    {
        path: 'dashboard',
        element: <DashboardPage />,
    },
    {
        path: 'roles/create', // Route cho tạo mới Role
        element: <CreateRole />,
    },
    {
        path: 'roles/update/:id', // Route cho sửa Role
        element: <EditRole />,
    },
    {
        path: 'roles',
        element: <RolePage />,
    },
    {
        path: 'permissions/create', // Route cho tạo mới Role
        element: <CreatePermission />,
    },
    {
        path: 'permissions/update/:id', // Route cho sửa Role
        element: <EditPermission />,
    },
    {
        path: 'permissions',
        element: <PermissionsPage />,
    },
    {
        path: 'settings',
        element: <SettingPage />,
    },
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
    // const isLoggedIn = false;

    return [
        {
            path: PREFIX_URL_ADMIN,
            element: isLoggedIn ? <AdminLayoutDefault /> : <AdminAuthLayout />,
            children: isLoggedIn ? DefaultRoutes : AuthRoutes, // Chỉ giữ children ở đây
        }
    ];
};

export default AdminRoutes;