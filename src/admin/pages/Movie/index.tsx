import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMovie, deleteMovie } from '../../services/movieService';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';

export interface Movie {
    id: string;
    title: string;
    content: string;
    author: string;
    thumbnail: string;
    slug: string;
}

const MoviePage: React.FC = () => {
    const [data, setData] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // State cho từ khóa tìm kiếm
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getMovie();
            const result = await response.json();
            const movie: Movie[] = result;
            setTotalItems(result.size);
            setData(movie.map(item => ({ ...item, key: item.id })));
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
        const keywordFromUrl = searchParams.get('keyword') || ''; // Lấy từ khóa tìm kiếm từ URL

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setSearchKeyword(keywordFromUrl); // Cập nhật từ khóa tìm kiếm
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize, searchKeyword); // Gọi fetchData với từ khóa tìm kiếm
    }, [currentPage, pageSize, searchKeyword]);

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
                message.success(t('admin.message.deleteSuccess')); // Thông báo khi xóa nhiều thành công
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError')); // Thông báo khi xóa nhiều lỗi
            }
        } catch (error) {
            message.error(t('admin.message.deleteError')); // Thông báo khi xóa nhiều thất bại
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý khi thay đổi trang
    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&size=${pageSize || 10}&keyword=${searchKeyword}`); // Cập nhật URL với từ khóa tìm kiếm
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1); // Reset lại trang về 1 khi tìm kiếm
        navigate(`?page=1&size=${pageSize}&keyword=${keyword}`); // Cập nhật URL khi tìm kiếm
    };

    const dataListConfig: DataListConfig<Movie> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Movie, b: Movie) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.movie.titleColumn'),
                dataIndex: 'title',
                key: 'title',
                sorter: (a: Movie, b: Movie) => a.title.localeCompare(b.title),
            },
            {
                title: t('admin.movie.thumbnail'),
                dataIndex: 'thumbnail',
                key: 'thumbnail',
                render: (thumbnail: string) => (
                    <img src={thumbnail} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: t('admin.movie.author'),
                dataIndex: 'author',
                key: 'author',
                sorter: (a: Movie, b: Movie) => a.author.localeCompare(b.author),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewMovie,
        onUpdate: handleUpdate,
        onDeleteSelected: handleDeleteSelected, // Sử dụng onDeleteSelected thay vì onDelete
        search: {
            keyword: searchKeyword, // Truyền từ khóa tìm kiếm vào cấu hình
            onSearch: handleSearch, // Hàm tìm kiếm
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/movie`, name: t('admin.movie.title') }
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
