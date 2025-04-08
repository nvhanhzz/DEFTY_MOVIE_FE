import React, { useEffect, useState } from 'react';
import {message, Spin, Switch} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {deleteRole, getRoles, switchStatus} from '../../services/roleSevice';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { Permission } from '../Permission';
import { LoadingOutlined } from '@ant-design/icons';
import SearchFormTemplate from "../../templates/Search";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Role {
    id: string;
    name: string;
    description: string;
    status: number;
    rolePermissions: Permission[];
}

const RolePage: React.FC = () => {
    const [data, setData] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [showFilter, setShowFilter] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const searchFields = [
        {
            type: 'input',
            label: t('admin.role.roleColumn'),
            name: 'name',
            placeholder: t('admin.role.roleColumn'),
        }
    ];

    const fetchData = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getRoles(page, pageSize, filters); // Gọi API với từ khóa
            if (!response.ok) {
                message.error(t('admin.message.fetchError'));
                return;
            }
            const result = await response.json();
            const content: Role[] = result.data.content;
            // console.log(content);
            const roles = content.map((item: any) => ({ ...item, key: item.id }));
            setTotalItems(result.data.totalElements);
            setData(roles);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('pageSize') || '10', 10);
        const filtersFromUrl: Record<string, string> = {};
        const initialSearchValues: Record<string, any> = {};

        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'size') {
                filtersFromUrl[key] = value;
                const field = searchFields.find((f) => f.name === key);
                if (field) {
                    initialSearchValues[key] = value;
                }
            }
        });

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setFilters(filtersFromUrl);
        setInitialValues(initialSearchValues);
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters]);

    // Hàm xử lý xóa các mục
    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteRole(ids as string[]);
            console.log(response);
            if (response.ok) {
                setData(prevData => prevData.filter(item => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess')); // Thông báo khi xóa nhiều thành công
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError')); // Thông báo khi xóa nhiều lỗi
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.deleteError')); // Thông báo khi xóa nhiều thất bại
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            setData(prevData => prevData.map(item =>
                item.id === id ? { ...item, status: checked ? 1 : 0 } : item
            ));
            const response = await switchStatus(id);
            if (response.status === 200) {
                message.success(t('admin.message.updateSuccess'));
            } else {
                message.error(t('admin.message.updateError'));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setData(prevData => prevData.map(item =>
                item.id === id ? { ...item, status: item.status === 1 ? 0 : 1 } : item
            ));
            message.error(t('admin.message.updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (newFilters: Record<string, any>) => {
        setCurrentPage(1);
        setFilters(newFilters);

        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('size', pageSize.toString());

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value.toString());
        });

        navigate(`?${queryParams.toString()}`);
    };

    // Hàm thay đổi trang
    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}&keyword=${searchKeyword}`);
    };

    // Cấu hình dữ liệu cho DataListTemplate
    const dataListConfig: DataListConfig<Role> = {
        columns: [
            {
                title: 'No.',
                dataIndex: 'key',
                align: 'center',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Role, b: Role) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.role.roleColumn'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
            },
            {
                title: t('admin.role.descriptionColumn'),
                dataIndex: 'description',
                key: 'description',
                align: 'center',
                sorter: (a: Role, b: Role) => a.description.localeCompare(b.description),
            },
            {
                title: t('admin.movie.status'),
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                sorter: (a: Role, b: Role) => a.status - b.status,
                render: (status, record) => (
                    <Switch
                        checked={status === 1}
                        onChange={(checked) => handleSwitchStatus(record.id, checked)}
                    />
                ),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: () => navigate('create'),
        onUpdate: (id: string) => navigate(`update/${id}`),
        onDeleteSelected: handleDeleteSelected,
        pagination: {
            currentPage,
            totalItems,
            pageSize,
            onPaginationChange: onPageChange,
        },
        onToggleFilter: () => setShowFilter(prev => !prev),
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/roles`, name: t('admin.role.title') },
            ]}
        >
            {showFilter && (
                <SearchFormTemplate fields={searchFields} onSearch={handleSearch} initialValues={initialValues} />
            )}
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
