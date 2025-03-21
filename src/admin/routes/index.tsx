import {useAuth} from "../hooks/useAuth";
import AdminLayoutDefault from "../layouts/AdminLayoutDefault";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import RolePage from "../pages/Role";
import CreateRole from "../pages/Role/Create"; // Import trang tạo mới Role
import EditRole from "../pages/Role/Update"; // Import trang sửa Role
import PermissionsPage from "../pages/Permission";
import CreatePermission from "../pages/Permission/Create";
import EditPermission from "../pages/Permission/Update";
import ArticlesPage from "../pages/Article";
import AccountPage from "../pages/Account";
import React from "react";
import CreateAccount from "../pages/Account/Create";
import UpdateAccount from "../pages/Account/Update";
import CreateArticle from "../pages/Article/Create";
import UpdateArticle from "../pages/Article/Update";
import MoviePage from "../pages/Movie";
import CreateMovie from "../pages/Movie/Create";
import UpdateMovie from "../pages/Movie/Update";
import DirectorPage from "../pages/Director";
import CreateDirector from "../pages/Director/Create";
import UpdateDirector from "../pages/Director/Update";
import EpisodePage from "../pages/Episode";
import CreateEpisode from "../pages/Episode/Create";
import UpdateEpisode from "../pages/Episode/Update";
import MembershipPacketPage from "../pages/MembershipPackage";
import CreateMembershipPacket from "../pages/MembershipPackage/Create";
import EditMembershipPacket from "../pages/MembershipPackage/Update";
import CategoryPage from "../pages/Category";
import CreateCategory from "../pages/Category/Create";
import UpdateCategory from "../pages/Category/Update";
import ActorPage from "../pages/Actor";
import CreateActor from "../pages/Actor/Create";
import UpdateActor from "../pages/Actor/Update";
import Test from "../pages/Test";
import UserPage from "../pages/User";
import Profile from "../pages/Profile";
import UpdateProfile from "../pages/Profile/Update";
import HomeConfigPage from "../pages/HomeConfig";
import CreateShowOn from "../pages/HomeConfig/Create";
import UpdateShowOn from "../pages/HomeConfig/Update";
import Banner from "../pages/Banner";
import CreateBanner from "../pages/Banner/Create";
import UpdateBanner from "../pages/Banner/Update";

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
        path: 'dashboard',
        element: <DashboardPage />,
    },
    {
        path: 'roles/Create', // Route cho tạo mới Role
        element: <CreateRole />,
    },
    {
        path: 'roles/Update/:id', // Route cho sửa Role
        element: <EditRole />,
    },
    {
        path: 'roles',
        element: <RolePage />,
    },
    {
        path: 'permissions/Create', // Route cho tạo mới Role
        element: <CreatePermission />,
    },
    {
        path: 'permissions/Update/:id', // Route cho sửa Role
        element: <EditPermission />,
    },
    {
        path: 'permissions',
        element: <PermissionsPage />,
    },
    {
        path: 'membership-packets',
        element: <MembershipPacketPage />,
    },
    {
        path: 'membership-packets/Create',
        element: <CreateMembershipPacket />,
    },
    {
        path: 'membership-packets/Update/:id',
        element: <EditMembershipPacket />,
    },
    {
        path: 'articles',
        element: <ArticlesPage />,
    },
    {
        path: 'articles/create',
        element: <CreateArticle />,
    },
    {
        path: 'articles/update/:id',
        element: <UpdateArticle />,
    },
    {
        path: 'movies',
        element: <MoviePage />,
    },
    {
        path: 'movies/create',
        element: <CreateMovie />,
    },
    {
        path: 'movies/update/:id',
        element: <UpdateMovie />,
    },
    {
        path: 'movies/:id/episodes',
        element: <EpisodePage />,
    },
    {
        path: 'movies/:id/episodes/create',
        element: <CreateEpisode />,
    },
    {
        path: 'movies/:movieId/episodes/update/:id',
        element: <UpdateEpisode />,
    },
    {
      path: 'accounts',
      element: <AccountPage />,
    },
    {
        path: 'accounts/Create',
        element: <CreateAccount />,
    },
    {
        path: 'accounts/Update/:id',
        element: <UpdateAccount />,
    },
    {
        path: 'directors',
        element: <DirectorPage />,
    },
    {
        path: 'directors/create',
        element: <CreateDirector />,
    },
    {
        path: 'directors/update/:id',
        element: <UpdateDirector />,
    },

    {
        path: 'categories',
        element: <CategoryPage />,
    },
    {
        path: 'category/create',
        element: <CreateCategory />,
    },
    {
        path: 'category/update/:id',
        element: <UpdateCategory />,
    },
    {
        path: 'actors',
        element: <ActorPage />,
    },
    {
        path: 'actors/create',
        element: <CreateActor />,
    },
    {
        path: 'actors/update/:id',
        element: <UpdateActor />,
    },
    {
        path: 'users',
        element: <UserPage />,
    },
    {
        path: 'banners',
        element: <Banner />,
    },
    {
        path: 'banners/create',
        element: <CreateBanner />,
    },
    {
        path: 'banners/update/:id',
        element: <UpdateBanner />,
    },
    {
        path: 'users',
        element: <UserPage />,
    },
    {
        path: 'banners',
        element: <Banner />,
    },
    {
        path: 'banners/create',
        element: <CreateBanner />,
    },
    {
        path: 'banners/update/:id',
        element: <UpdateBanner />,
    },
    {
        path: 'home-config',
        element: <HomeConfigPage />,
    },
    {
        path: 'home-config/create',
        element: <CreateShowOn />,
    },
    {
        path: 'home-config/update/:id',
        element: <UpdateShowOn />,
    },
    {
        path: 'users',
        element: <UserPage />,
    },
    {
        path: 'test',
        element: <Test />,
    },
    {
        path: 'profile',
        element: <Profile />
    },
    {
        path: 'profile/update',
        element: <UpdateProfile />
    },
    // {
    //     path: 'settings',
    //     element: <SettingPage />,
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
    // const isLoggedIn = false;

    return [
        {
            path: PREFIX_URL_ADMIN,
            element: isLoggedIn ? <AdminLayoutDefault /> : <AdminAuthLayout />,
            children: isLoggedIn ? DefaultRoutes : AuthRoutes, // Chỉ giữ children ở đây
        }
    ];
}

export default AdminRoutes;