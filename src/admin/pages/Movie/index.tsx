import React, { useEffect, useState } from 'react';
import {message, Spin, Tag} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMovies, deleteMovie } from '../../services/movieService';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';

export interface Movie {
    id: string;
    title: string;
    description: string;
    trailer: string;
    thumbnail: string;
    ranking: number;
    releaseDate: Date;
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
    const [searchKeyword, setSearchKeyword] = useState<string>();
    const [nation, setNation] = useState<string>();
    const [releaseDate, setReleaseDate] = useState<string>();
    const [ranking, setRanking] = useState<number>();
    const [directorId, setDirectorId] = useState<number>();
    const [status, setStatus] = useState<number>();

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const fetchData = async (page: number, pageSize: number) => {
        setIsLoading(true);
        try {
            const response = await getMovies(page, pageSize);
            const result = await response.json();
            const content: Movie[] = result.data.content;
            const movies = content.map((item) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.totalItems);
            setData(movies.map(item => ({ ...item, key: item.id })));
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
        const keywordFromUrl = searchParams.get('keyword') || '';
        const nationFromUrl = searchParams.get('nation') || '';
        const releaseDateFromUrl = searchParams.get('releaseDate') || '';
        const rankingFromUrl = parseInt(searchParams.get('ranking') || '0', 10);
        const directorIdFromUrl = parseInt(searchParams.get('directorId') || '1', 10);
        const statusFromUrl = parseInt(searchParams.get('status') || '1', 10);

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setSearchKeyword(keywordFromUrl);
        setNation(nationFromUrl);
        setReleaseDate(releaseDateFromUrl);
        setRanking(rankingFromUrl);
        setDirectorId(directorIdFromUrl);
        setStatus(statusFromUrl);
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize, searchKeyword, nation, releaseDate, ranking, directorId, status]);

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewMovie = () => {
        navigate('create');
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteMovie(ids as string[]);
            if (response.ok) {
                setData(prevData => prevData.filter(item => !ids.includes(item.id)));
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
        navigate(`?page=${page}&size=${pageSize || 10}&keyword=${searchKeyword}&nation=${nation}&releaseDate=${releaseDate}&ranking=${ranking}&directorId=${directorId}&status=${status}`);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
        navigate(`?page=1&size=${pageSize}&keyword=${keyword}&nation=${nation}&releaseDate=${releaseDate}&ranking=${ranking}&directorId=${directorId}&status=${status}`);
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
                    <img src={thumbnail} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
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
            }
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewMovie,
        onUpdate: handleUpdate,
        onDeleteSelected: handleDeleteSelected,
        search: {
            keyword: searchKeyword,
            onSearch: handleSearch,
        },
        pagination: {
            currentPage: currentPage,
            totalItems: totalItems,
            pageSize: pageSize,
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
