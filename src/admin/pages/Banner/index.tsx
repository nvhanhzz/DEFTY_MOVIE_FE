import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {deleteBanners, getBanners, switchStatusBanner} from "../../services/bannerService.tsx";
import {Image, message, Spin, Switch} from "antd";
import DataListTemplate, {DataListConfig} from "../../templates/DataList";
import OutletTemplate from "../../templates/Outlet";
import SearchFormTemplate from "../../templates/Search";
import {LoadingOutlined} from "@ant-design/icons";

export interface Banner{
    id: string;
    key: string;
    title: string;
    link: string;
    thumbnail: string;
    status: number;
    position: number;
    contentType: string;
    contentId: string;
}

const BannerPage: React.FC = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [data, setData] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});

    const searchFields = [
        {
            type: 'input',
            label: t('admin.banner.title'),
            name: 'title',
            placeholder: t('admin.banner.title'),
        },
        {
            type: 'select',
            label: t('admin.banner.position'),
            name: 'position',
            placeholder: t('admin.banner.position'),
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
            const response = await getBanners(page, pageSize, filters); // Gọi API với từ khóa
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                setTotalItems(0);
                setData([]);
                return;
            }
            console.log(result)

            const content: Banner[] = result.data.content;
            const banners = content.map((item: Banner) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(banners);
        } catch (error) {
            console.log(error);
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
            const response = await deleteBanners(ids as string[]);
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

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
    };

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            const response = await switchStatusBanner(id);
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

    const dataListConfig: DataListConfig<Banner> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                align: 'center',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,

            },
            {
                title: t('admin.banner.title'),
                dataIndex: 'title',
                key: 'title',
                align: 'center',
            },
            {
                title: t('admin.banner.thumbnail'),
                dataIndex: 'thumbnail',
                key: 'thumbnail',
                align: 'center',
                render: (thumbnail: string) => (
                    <Image
                        width={80}
                        height={80}
                        style={{
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }}
                        src={thumbnail}
                        alt="thumbnail"
                    />
                ),
            },
            {
                title: t('admin.banner.link'),
                dataIndex: 'link',
                key: 'link',
                align: 'center',
            },
            {
                title: t('admin.banner.position'),
                dataIndex: 'position',
                key: 'position',
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/directors`, name: t('admin.banner.title') },
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
}

export default BannerPage;