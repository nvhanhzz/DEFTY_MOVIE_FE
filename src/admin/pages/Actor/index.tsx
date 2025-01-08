import React, { useEffect, useState } from 'react';
import {message, Spin, Switch} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import dayjs from 'dayjs'; // Use dayjs instead of moment
import customParseFormat from 'dayjs/plugin/customParseFormat'; // Plugin for custom date formats
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import {deleteActors, getActors, switchStatusActor} from "../../services/actorService.tsx";
import SearchFormTemplate from "../../templates/Search";

// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

export interface Actor {
    id: string;
    fullName: string,
    gender: string,
    dateOfBirth: Date,
    weight: number,
    height: number,
    nationality: string,
    description: string,
    avatar: string
}

const ActorPage: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<Actor[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const location = useLocation();
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});

    const searchFields = [
        {
            type: 'input',
            label: t('admin.actor.fullName'),
            name: 'name',
            placeholder: t('admin.actor.fullName'),
        },
        {
            type: 'select',
            label: t('admin.actor.gender.title'),
            name: 'gender',
            placeholder: t('admin.actor.gender.title'),
            options: [
                {
                    label: t('admin.actor.gender.male'),
                    value: 'male',
                },
                {
                    label: t('admin.actor.gender.female'),
                    value: 'female',
                },
                {
                    label: t('admin.actor.gender.other'),
                    value: 'other',
                },
            ],
        },
        {
            type: 'dateRange',
            label: t('admin.director.dateOfBirth'),
            name: 'dateOfBirth',
            placeholder: t('admin.director.dateOfBirth'),
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
            const response = await getActors(page, pageSize, filters); // Gọi API với từ khóa
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                setTotalItems(0);
                setData([]);
                return;
            }

            const content: Actor[] = result.data.content;
            const actors = content.map((item: Actor) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(actors);
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
        const formattedFilters: Record<string, any> = { ...newFilters };

        setCurrentPage(1);
        setFilters(formattedFilters);

        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('size', pageSize.toString());

        Object.entries(formattedFilters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value.toString());
        });

        navigate(`?${queryParams.toString()}`);
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewPermission = () => {
        navigate('create');
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteActors(ids as string[]);
            if (response.ok) {
                setData((prevData) => prevData.filter((item) => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess')); // Dùng t() cho thông báo
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError')); // Dùng t() cho thông báo
            }
        } catch (error) {
            message.error(t('admin.message.deleteError'));
        } finally {
            setIsLoading(false);
        }
    };

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
    };

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            const response = await switchStatusActor(id);
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

    const dataListConfig: DataListConfig<Actor> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.actor.fullName'),
                dataIndex: 'fullName',
                key: 'fullName',
            },
            {
                title: t('admin.actor.avatar'),
                dataIndex: 'avatar',
                key: 'avatar',
                render: (avatar: string) => (
                    <img src={avatar} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: t('admin.actor.gender.title'),
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: t('admin.actor.dateOfBirth'),
                dataIndex: 'dateOfBirth',
                key: 'dateOfBirth',
                render: (dateOfBirth: Date) => (dateOfBirth ? dayjs(dateOfBirth).format('DD/MM/YYYY') : ''),
            },
            {
                title: t('admin.actor.weight'),
                dataIndex: 'weight',
                key: 'weight',
            },
            {
                title: t('admin.actor.height'),
                dataIndex: 'height',
                key: 'height',
            },
            {
                title: t('admin.actor.nationality'),
                dataIndex: 'nationality',
                key: 'nationality',
            },
            {
                title: t('admin.actor.description'),
                dataIndex: 'description',
                key: 'description',
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
        onCreateNew: handleCreateNewPermission,
        onUpdate: handleUpdate,
        onDeleteSelected: handleDeleteSelected,
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/directors`, name: t('admin.actor.title') },
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

export default ActorPage;