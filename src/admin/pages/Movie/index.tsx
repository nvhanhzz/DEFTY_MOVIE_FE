import React, {useEffect, useState} from 'react';
import {message, Spin, Switch, Tag, Image} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {deleteMovie, getMovies, switchStatusMovie} from '../../services/movieService';
import OutletTemplate from '../../templates/Outlet';
import type {DataListConfig} from '../../templates/DataList';
import DataListTemplate from '../../templates/DataList';
import {EyeOutlined, LoadingOutlined} from '@ant-design/icons';
import SearchFormTemplate from "../../templates/Search";

export interface Movie {
    id: string;
    title: string;
    description: string;
    trailer: string;
    thumbnail: string;
    coverImage: string;
    ranking: number;
    releaseDate: Date;
    status: number;
    nation: string;
    director: string;
    membershipType: number;
}

const MoviePage: React.FC = () => {
    const [data, setData] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const searchFields = [
        {
            type: 'input',
            label: t('admin.movie.title'),
            name: 'title',
            placeholder: t('admin.movie.title'),
        },
        {
            type: 'input',
            label: t('admin.movie.nation'),
            name: 'nation',
            placeholder: t('admin.movie.nation'),
        },
        {
            type: 'input',
            label: t('admin.movie.director'),
            name: 'director',
            placeholder: t('admin.movie.director'),
        },
        {
            type: 'input',
            label: t('admin.movie.ranking'),
            name: 'ranking',
            placeholder: t('admin.movie.ranking'),
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
            type: 'dateRange',
            label: t('admin.movie.releaseDate'),
            name: 'releaseDate',
            placeholder: t('admin.movie.releaseDate'),
        },
    ];
    const fetchData = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getMovies(page, pageSize, filters);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                setTotalItems(0);
                setData([]);
                return;
            }
            const content: Movie[] = result.data.content;
            const movies = content.map((item) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            console.log(result)
            setData(movies);
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
        console.log(initialSearchValues);
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters]);

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewMovie = () => {
        navigate('create');
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

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
    };

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            setData(prevData => prevData.map(item =>
                item.id === id ? { ...item, status: checked ? 1 : 0 } : item
            ));
            const response = await switchStatusMovie(id);
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

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteMovie(ids as string[]);
            if (response.ok) {
                setData((prevData) =>
                    prevData.map((item) =>
                        ids.includes(item.id)
                            ? { ...item, status: 0 }
                            : item
                    )
                );
                message.success(t('admin.message.deleteSuccess'));
                fetchData(currentPage, pageSize, filters);
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
    const dataListConfig: DataListConfig<Movie> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                align: 'center',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.movie.titleColumn'),
                dataIndex: 'title',
                key: 'title',
                align: 'center',
            },
            {
                title: t('admin.movie.thumbnail'),
                dataIndex: 'thumbnail',
                key: 'thumbnail',
                align: 'center',
                render: (thumbnail: string) => (
                    <Image
                        style={{ borderRadius: '5px' }}
                        src={thumbnail}
                        width={120}
                    />
                ),
            },

            {
                title: t('admin.movie.director'),
                dataIndex: 'director',
                key: 'director',
                align: 'center',
            },
            {
                title: t('admin.movie.nation'),
                dataIndex: 'nation',
                key: 'nation',
                align: 'center',
            },
            {
                title: t('admin.movie.ranking'),
                dataIndex: 'ranking',
                key: 'ranking',
                align: 'center',
                sorter: (a: Movie, b: Movie) => a.ranking - b.ranking, // Sắp xếp theo thứ hạng
            },
            {
                title: t('admin.movie.releaseDate'),
                dataIndex: 'releaseDate',
                key: 'releaseDate',
                align: 'center',
                sorter: (a: Movie, b: Movie) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
                render: (releaseDate) => {
                    const date = new Date(releaseDate);
                    return date.toLocaleDateString('en-CA');
                },
            },
            {
                title: t('admin.movie.membershipType'),
                dataIndex: 'membershipType',
                key: 'membershipType',
                align: 'center',
                sorter: (a: Movie, b: Movie) => a.membershipType - b.membershipType,
                render: (membershipType) => {
                    return (
                        <Tag color={membershipType === 1 ? 'green' : 'orange'}>
                            {membershipType === 1 ? 'VIP' : 'Normal'}
                        </Tag>
                    );
                },
            },
            {
                title: t('admin.movie.status'),
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
                title: t('admin.movie.episode'),
                dataIndex: 'detail',
                key: 'detail',
                align: 'center',
                render: (_text, record) => {
                    return (
                        <a onClick={() => navigate(`/admin/movies/${record.id}/episodes`)}>
                            <EyeOutlined />
                        </a>
                    );
                },
            }

        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewMovie,
        onUpdate: handleUpdate,
        onDeleteSelected: handleDeleteSelected,
        pagination: {
            currentPage,
            totalItems,
            pageSize,
            onPaginationChange: onPageChange,
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/movies`, name: t('admin.movie.title') }
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

export default MoviePage;
