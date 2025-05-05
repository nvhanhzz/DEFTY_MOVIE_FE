import React, { useEffect, useState } from 'react';
import {message, Spin, Switch} from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate, { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import {deleteEpisodes, getEpisodesByMovie, switchStatusEpisode} from '../../services/episodeService';
import { getMovieById } from '../../services/movieService';
import SearchFormTemplate from "../../templates/Search";

export interface Episode {
    id: string;
    number: number;
    description: string;
    thumbnail: string;
    link: string;
    movieId: number;
}

const EpisodePage: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<Episode[]>([]);
    const [movieName, setMovieName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const { id: movieId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});

    const searchFields = [
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

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            const response = await switchStatusEpisode(id);
            const result = await response.json();
            console.log(response, result);
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

    const fetchMovieName = async (movieId: string) => {
        try {
            const response = await getMovieById(movieId);
            const result = await response.json();
            if (response.ok) {
                setMovieName(result.data.title);
            } else {
                message.error(result.message || t('admin.message.fetchError'));
            }
        } catch {
            message.error(t('admin.message.fetchError'));
        }
    };

    const fetchData = async (movieId: string, page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getEpisodesByMovie(movieId, page, pageSize, filters);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                setTotalItems(0);
                setData([]);
                return;
            }
            const content: Episode[] = result.data.content.map((item: Episode) => ({
                ...item,
                key: item.id,
            }));
            setData(content);
            setTotalItems(result.data.totalElements);
        } catch {
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
        fetchMovieName(movieId as string);
        fetchData(movieId as string, currentPage, pageSize, filters);
    }, [movieId, currentPage, pageSize, filters]);

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewPermission = () => {
        navigate('create');
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteEpisodes(ids as string[]);
            if (response.ok) {
                setData(prevData => prevData.filter(item => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError'));
            }
        } catch {
            message.error(t('admin.message.deleteError'));
        } finally {
            setIsLoading(false);
        }
    };

    const onPageChange = (page: number, pageSize?: number) => {
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
    };

    const dataListConfig: DataListConfig<Episode> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                align: 'center',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.episode.number'),
                dataIndex: 'number',
                key: 'number',
                align: 'center',
            },
            {
                title: t('admin.episode.description'),
                dataIndex: 'description',
                key: 'description',
                align: 'center',
            },
            {
                title: t('admin.episode.thumbnail'),
                dataIndex: 'thumbnail',
                key: 'thumbnail',
                align: 'center',
                render: (thumbnail: string) => (
                    <img src={thumbnail} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: t('admin.episode.video'),
                dataIndex: 'link',
                key: 'link',
                align: 'center',
                render: (link: string) => (
                    <video controls style={{ width: '150px', height: 'auto' }}>
                        <source src={link} type="video/mp4" />
                        {t('admin.message.videoNotSupported')}
                    </video>
                ),
            },
            {
                title: t('admin.episode.movie'),
                key: 'movieName',
                align: 'center',
                render: () => (
                    <a href={`${import.meta.env.VITE_PREFIX_URL_ADMIN}/movies/${movieId}`} rel="noopener noreferrer">
                        {movieName}
                    </a>
                ),
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
        onToggleFilter: () => setShowFilter(prev => !prev),
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/movies`, name: t('admin.movie.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/movies/${movieId}/episode`, name: t('admin.episode.title') },
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

export default EpisodePage;