import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate, { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import { deleteEpisodes, getEpisodesByMovie } from '../../services/episodeService';
import { getMovieById } from '../../services/movieService';

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
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const { id: movieId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

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

    const fetchData = async (movieId: string, page: number, pageSize: number) => {
        setIsLoading(true);
        try {
            const response = await getEpisodesByMovie(movieId, page, pageSize);
            const result = await response.json();
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
        const keywordFromUrl = searchParams.get('keyword') || '';

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setSearchKeyword(keywordFromUrl);

        if (movieId) {
            fetchMovieName(movieId);
            fetchData(movieId, pageFromUrl, pageSizeFromUrl);
        }
    }, [location.search, movieId]);

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

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        navigate(`?page=1&pageSize=${pageSize}&keyword=${keyword}`);
    };

    const onPageChange = (page: number, pageSize?: number) => {
        navigate(`?page=${page}&pageSize=${pageSize || 10}&keyword=${searchKeyword}`);
    };

    const dataListConfig: DataListConfig<Episode> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.episode.number'),
                dataIndex: 'number',
                key: 'number',
            },
            {
                title: t('admin.episode.description'),
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: t('admin.episode.thumbnail'),
                dataIndex: 'thumbnail',
                key: 'thumbnail',
                render: (thumbnail: string) => (
                    <img src={thumbnail} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: t('admin.episode.video'),
                dataIndex: 'link',
                key: 'link',
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
                render: () => (
                    <a href={`${import.meta.env.VITE_PREFIX_URL_ADMIN}/movies/${movieId}`} rel="noopener noreferrer">
                        {movieName}
                    </a>
                ),
            },
        ],
        data,
        rowKey: 'id',
        onCreateNew: handleCreateNewPermission,
        onUpdate: handleUpdate,
        onDeleteSelected: handleDeleteSelected,
        search: {
            keyword: searchKeyword,
            onSearch: handleSearch,
        },
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/movies/${movieId}`, name: t('admin.movie.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/movies/${movieId}/episode`, name: t('admin.episode.title') },
            ]}
        >
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