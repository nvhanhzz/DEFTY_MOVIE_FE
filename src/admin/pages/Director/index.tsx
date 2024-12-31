import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import dayjs from 'dayjs'; // Use dayjs instead of moment
import customParseFormat from 'dayjs/plugin/customParseFormat'; // Plugin for custom date formats
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import { deleteDirectors, getDirectors } from "../../services/directorService.tsx";
import SearchFormTemplate from "../../templates/Search";

// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

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
    const { t } = useTranslation(); // Khởi tạo t từ useTranslation
    const [data, setData] = useState<Director[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
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
            type: 'date',
            label: t('admin.director.dateOfBirth'),
            name: 'dateOfBirth',
            placeholder: t('admin.director.dateOfBirth'),
        },
    ];

    const fetchData = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getDirectors(page, pageSize, filters); // Gọi API với từ khóa
            const result = await response.json();
            const content: Director[] = result.data.content;
            const directors = content.map((item: Director) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(directors);
        } catch (error) {
            message.error(t('admin.message.fetchError')); // Sử dụng t() để thay thế chuỗi
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('size') || '10', 10);
        const filtersFromUrl: Record<string, string> = {};

        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'size') {
                filtersFromUrl[key] = value;
            }
        });

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setFilters(filtersFromUrl);
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters]);

    const handleSearch = (newFilters: Record<string, any>) => {
        const formattedFilters: Record<string, any> = { ...newFilters };

        Object.keys(formattedFilters).forEach((key) => {
            if (key === 'dateOfBirth' && formattedFilters[key]) {
                formattedFilters[key] = dayjs(formattedFilters[key], 'YYYY-MM-DD').format('YYYY-MM-DD');
            }
        });

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
            const response = await deleteDirectors(ids as string[]);
            console.log(response, await response.json());
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

    const dataListConfig: DataListConfig<Director> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.director.fullName'),
                dataIndex: 'fullName',
                key: 'fullName',
            },
            {
                title: t('admin.director.avatar'),
                dataIndex: 'avatar',
                key: 'avatar',
                render: (avatar: string) => (
                    <img src={avatar} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: t('admin.director.gender.title'),
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: t('admin.director.dateOfBirth'),
                dataIndex: 'dateOfBirth',
                key: 'dateOfBirth',
                render: (dateOfBirth: Date) => (dateOfBirth ? dayjs(dateOfBirth).format('DD/MM/YYYY') : ''),
            },
            {
                title: t('admin.director.weight'),
                dataIndex: 'weight',
                key: 'weight',
            },
            {
                title: t('admin.director.height'),
                dataIndex: 'height',
                key: 'height',
            },
            {
                title: t('admin.director.nationality'),
                dataIndex: 'nationality',
                key: 'nationality',
            },
            {
                title: t('admin.director.description'),
                dataIndex: 'description',
                key: 'description',
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
            <SearchFormTemplate fields={searchFields} onSearch={handleSearch} />
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