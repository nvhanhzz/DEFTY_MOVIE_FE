import React, { useEffect, useState } from 'react';
import {message, Spin, Switch, Image, Button} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import {deleteDirectors, getDirectors, switchStatusDirector} from "../../services/directorService.tsx";
import SearchFormTemplate from "../../templates/Search";

export interface Director {
    id: string;
    fullName: string;
    gender: string;
    dateOfBirth: Date;
    weight: string;
    height: string;
    nationality: string;
    description: string;
    avatar: string;
}

const DirectorPage: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<Director[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [expandedRows, setExpandedRows] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const searchFields = [
        {
            type: 'input',
            label: t('admin.director.fullName'),
            name: 'name',
            placeholder: t('admin.director.fullName'),
        },
        {
            type: 'select',
            label: t('admin.director.gender.title'),
            name: 'gender',
            placeholder: t('admin.director.gender.title'),
            options: [
                {
                    label: t('admin.director.gender.male'),
                    value: 'male',
                },
                {
                    label: t('admin.director.gender.female'),
                    value: 'female',
                },
                {
                    label: t('admin.director.gender.other'),
                    value: 'other',
                },
            ],
        },
        {
            type: 'dateRange',
            label: t('admin.director.dateOfBirth'),
            name: 'date_of_birth',
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
        {
            type: 'nationality',
            label: t('admin.user.nationality'),
            name: 'nationality',
        }
    ];

    const fetchData = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getDirectors(page, pageSize, filters);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                setTotalItems(0);
                setData([]);
                return;
            }
            const content: Director[] = result.data.content;
            const directors = content.map((item: Director) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(directors);
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
        // console.log(initialSearchValues);
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

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewPermission = () => {
        navigate('create');
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteDirectors(ids as string[]);
            if (response.ok) {
                setData((prevData) => prevData.filter((item) => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError'));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            const response = await switchStatusDirector(id);
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

    const toggleExpand = (key: string | number) => {
        setExpandedRows((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const dataListConfig: DataListConfig<Director> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                align: 'center',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.director.fullName'),
                dataIndex: 'fullName',
                key: 'fullName',
                align: 'center',
            },
            {
                title: t('admin.director.avatar'),
                dataIndex: 'avatar',
                key: 'avatar',
                align: 'center',
                render: (avatar: string) => (
                    <Image
                        width={80}  // Điều chỉnh kích thước ảnh nếu cần
                        height={80}
                        style={{
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }}
                        src={avatar}  // Đường dẫn ảnh
                        alt="avatar"
                    />
                ),
            },
            {
                title: t('admin.director.gender.title'),
                dataIndex: 'gender',
                key: 'gender',
                align: 'center',
            },
            {
                title: t('admin.director.dateOfBirth'),
                dataIndex: 'dateOfBirth',
                key: 'dateOfBirth',
                align: 'center',
                render: (dateOfBirth: Date) => (dateOfBirth ? dayjs(dateOfBirth).format('DD/MM/YYYY') : ''),
            },
            {
                title: t('admin.director.weight') + ' (kg)',
                dataIndex: 'weight',
                key: 'weight',
                align: 'center',
            },
            {
                title: t('admin.director.height') + ' (cm)',
                dataIndex: 'height',
                key: 'height',
                align: 'center',
            },
            {
                title: t('admin.director.nationality'),
                dataIndex: 'nationality',
                key: 'nationality',
                align: 'center',
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
                align: "center",
                render: (text, record) => {
                    const expanded = expandedRows[record.id] || false;
                    const isLong = text.length > 100;

                    return (
                        <div style={{ maxWidth: 300, wordWrap: "break-word" }}>
                            {isLong ? (
                                <>
                                    {expanded ? text : `${text.substring(0, 100)}... `}
                                    <Button type="link" onClick={() => toggleExpand(record.id)}>
                                        {expanded ? t('admin.common.less') : t('admin.common.more') }
                                    </Button>
                                </>
                            ) : (
                                text
                            )}
                        </div>
                    );
                },
            },
            {
                title: t('admin.dataList.status.title'),
                dataIndex: 'status',
                key: 'status',
                align: 'center',
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/directors`, name: t('admin.director.title') },
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

export default DirectorPage;