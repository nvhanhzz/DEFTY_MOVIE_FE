import AdminLayoutDefault from "../layouts/AdminLayoutDefault";
import Login from "../pages/Login";

function AdminRoutes() {
    return [
        {
            path: '/admin',
            element: <AdminLayoutDefault />,
            children: [
                { path: '', element: <Login /> },
            ]
        }
    ];
};

export default AdminRoutes;