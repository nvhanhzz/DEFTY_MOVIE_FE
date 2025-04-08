import React, {useEffect, useState} from 'react';
import {message, Spin, Switch} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import type {DataListConfig} from '../../templates/DataList';
import DataListTemplate from '../../templates/DataList';
import {LoadingOutlined, VideoCameraOutlined} from '@ant-design/icons';
import {deleteCategories, getCategories, switchStatusCategory} from "../../services/categoryService.tsx";
import SearchFormTemplate from "../../templates/Search";

export interface Category {
    id: string;
    name: string;
    description: string;
    status: number;
    numberOfMovies: number;
}

const CategoryPage: React.FC = () => {
    const { t } = useTranslation(); // Khởi tạo t từ useTranslation
    const [data, setData] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const location = useLocation();
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});

    const searchFields = [
        {
            type: 'input',
            label: t('admin.category.name'),
            name: 'name',
            placeholder: t('admin.category.name'),
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
            const response = await getCategories(page, pageSize, filters);
            const result = await response.json();

            if (!response.ok || result.status === 404) {
                setTotalItems(0);
                setData([]);
                return;
            }
            const content: Category[] = result.data.content;
            const categories = content.map((item: Category) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(categories);
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
        navigate(`/admin/category/update/${id}`);
    };

    const handleCreateNewPermission = () => {
        navigate('/admin/category/create');
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteCategories(ids as string[]);
            if (response.ok) {
                setData((prevData) => prevData.filter((item) => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess')); // Dùng t() cho thông báo
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError')); // Dùng t() cho thông báo
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.deleteError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            const response = await switchStatusCategory(id);
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

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
    };

    const dataListConfig: DataListConfig<Category> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                align: 'center',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.category.name'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
            },
            {
                title: t('admin.category.description'),
                dataIndex: 'description',
                key: 'description',
                align: 'center',
            },
            {
                title: t('admin.category.numberOfMovies'),
                dataIndex: 'numberOfMovies',
                key: 'numberOfMovies',
                align: 'center',
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
            {
                title: t('admin.category.detailMovies'),
                dataIndex: 'numberOfMovie',
                key: 'numberOfMovie',
                align: 'center',
                render: (text, record) => (<>
                        <span>{text}</span>
                        <VideoCameraOutlined
                            style={{color: "#1890ff", cursor: "pointer"}}
                            onClick={() => navigate(`/admin/moviesOfCategory/${record.id}`)}
                        />
                    </>
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
        onToggleFilter: () => setShowFilter(prev => !prev),
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}`, name: t('admin.dashboard.title') },
                { path: ``, name: t('admin.category.title') },
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

export default CategoryPage;