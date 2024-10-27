import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRoles } from '../../services/roleSevice';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { Permission } from '../Permission';
import { LoadingOutlined } from '@ant-design/icons';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Role {
    id: string;
    name: string;
    description: string;
    rolePermissions: Permission[];
}

const RolePage: React.FC = () => {
    const [data, setData] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const fetchData = async (page: number, pageSize: number) => {
        setIsLoading(true);
        try {
            const response = await getRoles(page, pageSize); // Cập nhật để gọi đúng hàm
            if (!response.ok) {
                message.error(t('admin.message.fetchError')); // Hiển thị thông báo lỗi khi lấy dữ liệu
                return;
            }
            const result = await response.json();
            const content: Role[] = result.data.content;
            const roles = content.map((item: any) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(roles);
        } catch (error) {
            message.error(t('admin.message.fetchError')); // Thông báo khi lỗi xảy ra
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('pageSize') || '10', 10);
        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleDelete = (id: string) => {
        setData(prevData => prevData.filter(item => item.id !== id));
        message.success(t('admin.message.deleteSuccess')); // Thông báo khi xóa thành công
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewRole = () => {
        navigate('create');
    };

    const handleDeleteSelected = (ids: React.Key[]) => {
        setData(prevData => prevData.filter(item => !ids.includes(item.id)));
        message.success(t('admin.message.deleteSuccess')); // Sử dụng cùng thông báo xóa thành công
    };

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`); // Cập nhật URL với page và pageSize
    };

    const dataListConfig: DataListConfig<Role> = {
        columns: [
            {
                title: 'No.',
                dataIndex: 'key',
                key: 'key',
                sorter: (a: Role, b: Role) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.role.roleColumn'),
                dataIndex: 'name',
                key: 'name',
                sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
            },
            {
                title: t('admin.role.descriptionColumn'),
                dataIndex: 'description',
                key: 'description',
                sorter: (a: Role, b: Role) => a.description.localeCompare(b.description),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewRole,
        onUpdate: handleUpdate,
        onDelete: handleDelete,
        onDeleteSelected: handleDeleteSelected,
        pagination: {
            currentPage: currentPage,
            totalItems: totalItems,
            pageSize: pageSize,
            onPaginationChange: onPageChange,
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/roles`, name: t('admin.role.title') },
            ]}
        >
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <DataListTemplate config={dataListConfig} />
            )}
        </OutletTemplate>
    );
};

export default RolePage;