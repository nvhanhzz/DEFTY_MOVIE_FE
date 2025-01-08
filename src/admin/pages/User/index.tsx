import React, { useEffect, useState } from 'react';
import {message, Spin, Switch} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import { getUsers, switchStatusUser} from "../../services/userService.tsx";
import SearchFormTemplate from "../../templates/Search";

export interface User {
    id: string,
    username: string,
    email: string,
    fullName: string,
    phone: string,
    gender: string,
    address: string,
    avatar: string,
    status: number,
    dateOfBirth: Date
}

const UserPage: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const navigate = useNavigate();
    const location = useLocation();

    const searchFields = [
        {
            type: 'input',
            label: t('admin.user.fullName'),
            name: 'name',
            placeholder: t('admin.user.fullName'),
        },
        {
            type: 'select',
            label: t('admin.user.gender.title'),
            name: 'gender',
            placeholder: t('admin.user.gender.title'),
            options: [
                {
                    label: t('admin.user.gender.male'),
                    value: 'male',
                },
                {
                    label: t('admin.user.gender.female'),
                    value: 'female',
                },
                {
                    label: t('admin.user.gender.other'),
                    value: 'other',
                },
            ],
        },
        {
            type: 'dateRange',
            label: t('admin.user.dateOfBirth'),
            name: 'dateOfBirth',
            placeholder: t('admin.user.dateOfBirth'),
        },
        {
            type: 'select',
            label: t('admin.dataList.status.title'),
            name: 'status',
            placeholder: t('admin.dataList.status.title'),
            options: [
                {
                    label: t('admin.dataList.status.active'),
                    value: '1',
                },
                {
                    label: t('admin.dataList.status.inactive'),
                    value: '0',
                },
                {
                    label: t('admin.dataList.status.all'),
                    value: '',
                },
            ],
        },
    ];

    const fetchData = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getUsers(page, pageSize, filters);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                setTotalItems(0);
                setData([]);
                return;
            }
            const content: User[] = result.data.content;
            const users = content.map((item: User) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(users);
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('size') || '10', 10);
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
        console.log(initialSearchValues);
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters]);

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

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
    };

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            const response = await switchStatusUser(id);
            const result = await response.json();
            if (!response.ok || result.status !== 200) {
                message.error(t('admin.message.updateError'));
                return;
            }
            setData(prevData => prevData.map(item =>
                item.id === id ? { ...item, status: checked ? 1 : 0 } : item
            ));

            message.success(t('admin.message.updateSuccess'));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    const dataListConfig: DataListConfig<User> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.user.username'),
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: t('admin.user.fullName'),
                dataIndex: 'fullName',
                key: 'fullName',
            },
            {
                title: t('admin.user.avatar'),
                dataIndex: 'avatar',
                key: 'avatar',
                render: (avatar: string) => (
                    <img src={avatar} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: t('admin.user.email'),
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: t('admin.user.phone'),
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: t('admin.user.address'),
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: t('admin.user.gender.title'),
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: t('admin.user.dateOfBirth'),
                dataIndex: 'dateOfBirth',
                key: 'dateOfBirth',
                render: (dateOfBirth: Date) => (dateOfBirth ? dayjs(dateOfBirth).format('DD/MM/YYYY') : ''),
            },
            {
                title: t('admin.director.nationality'),
                dataIndex: 'nationality',
                key: 'nationality',
            },
            {
                title: t('admin.dataList.status.title'),
                dataIndex: 'status',
                key: 'status',
                render: (status, record) => (
                    <Switch
                        checked={status === 1}
                        onChange={(checked) => handleSwitchStatus(record.id, checked)}
                    />
                ),
            },
        ],
        data,
        rowKey: 'id',
        onUpdate: () => {},
        onDeleteSelected: () => {},
        noActions: true,
        pagination: {
            currentPage,
            totalItems,
            pageSize,
            onPaginationChange: onPageChange,
        },
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/directors`, name: t('admin.user.title') },
            ]}
        >
            <SearchFormTemplate fields={searchFields} onSearch={handleSearch} initialValues={initialValues} />
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

export default UserPage;