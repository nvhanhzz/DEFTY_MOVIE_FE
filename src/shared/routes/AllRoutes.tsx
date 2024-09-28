import React from 'react';
import { useRoutes } from 'react-router-dom';
import AdminRoutes from '../../admin/routes';
import ClientRoutes from '../../client/routes';

const AllRoutes: React.FC = () => {
    const routes = [
        ...AdminRoutes(),
        ...ClientRoutes()
    ];

    return useRoutes(routes);
};

export default AllRoutes;