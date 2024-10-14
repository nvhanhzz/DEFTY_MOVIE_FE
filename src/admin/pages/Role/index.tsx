import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllRole } from '../../services/roleSevice';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { Permission } from '../Permission';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Role {
    id: string;
    name: string;
    description: string;
    rolePermissions: Permission[];
}

const RolePage: React.FC = () => {
    const [data, setData] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Bắt đầu loading
            try {
                const response = await getAllRole();
                if (!response.ok) return;

                const result = await response.json();
                const dataWithKeys = result.data.map((item: any, index: number) => ({
                    ...item,
                    key: (index + 1).toString(),
                }));
                setData(dataWithKeys);
            } catch (error) {
                message.error(t('admin.role.fetchError'));
            } finally {
                setIsLoading(false); // Kết thúc loading
            }
        };
        fetchData();
    }, [t]);

    const handleDelete = (id: string) => {
        setData(prevData => prevData.filter(item => item.id !== id));
        message.success(t('admin.role.deleteSuccessMessage'));
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewRole = () => {
        navigate('create');
    };

    const handleDeleteSelected = (ids: React.Key[]) => {
        const newData = data.filter(item => !ids.includes(item.id));
        setData(newData);
        message.success(t('admin.role.deleteSelectedSuccessMessage'));
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
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: ``, name: t('admin.role.title') },
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

export default RolePage;