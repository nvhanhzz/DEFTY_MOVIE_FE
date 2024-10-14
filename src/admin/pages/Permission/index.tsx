import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllPermission, deletePermissions } from '../../services/permissionService';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';

export interface Permission {
    id: string;
    name: string;
    description: string;
}

const PermissionsPage: React.FC = () => {
    const [data, setData] = useState<Permission[]>([]);
    const [, setSelectedPermissionIds] = useState<React.Key[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading cho việc fetch
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Bắt đầu loading
            try {
                const response = await getAllPermission();
                const result = await response.json();
                const dataWithKeys = result.data.map((item: any) => ({
                    ...item,
                    key: item.id,
                }));
                setData(dataWithKeys);
            } catch (error) {
                message.error(t('admin.permission.fetchError'));
            } finally {
                setIsLoading(false); // Kết thúc loading
            }
        };
        fetchData();
    }, [t]);

    const handleDelete = async (id: string) => {
        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await deletePermissions([id]); // Gọi API xóa quyền
            if (response.ok) {
                setData(prevData => prevData.filter(item => item.id !== id));
                message.success(t('admin.permission.deleteSuccessMessage'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.permission.deleteErrorMessage'));
            }
        } catch (error) {
            console.error("Error deleting permission:", error);
            message.error(t('admin.permission.deleteErrorMessage'));
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewPermission = () => {
        navigate('create');
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await deletePermissions(ids as string[]); // Gọi API xóa nhiều quyền
            if (response.ok) {
                const newData = data.filter(item => !ids.includes(item.id));
                setData(newData);
                setSelectedPermissionIds([]);
                message.success(t('admin.permission.deleteSelectedSuccessMessage'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.permission.deleteErrorMessage'));
            }
        } catch (error) {
            console.error("Error deleting selected permissions:", error);
            message.error(t('admin.permission.deleteErrorMessage'));
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const dataListConfig: DataListConfig<Permission> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1, // Hiển thị số thứ tự tăng dần
                sorter: (a: Permission, b: Permission) => Number(a.id) - Number(b.id), // Không cần thiết cho cột này
            },
            {
                title: t('admin.permission.nameColumn'),
                dataIndex: 'name',
                key: 'name',
                sorter: (a: Permission, b: Permission) => a.name.localeCompare(b.name),
            },
            {
                title: t('admin.permission.descriptionColumn'),
                dataIndex: 'description',
                key: 'description',
                sorter: (a: Permission, b: Permission) => a.description.localeCompare(b.description),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewPermission,
        onUpdate: handleUpdate,
        onDelete: handleDelete,
        onDeleteSelected: handleDeleteSelected,
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/permissions`, name: t('admin.permission.title') }
            ]}
        >
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}> {/* Căn giữa spinner */}
                    <Spin tip={t('admin.role.update.loadingMessage')} />
                </div>
            ) : (
                <DataListTemplate config={dataListConfig} />
            )}
        </OutletTemplate>
    );
};

export default PermissionsPage;