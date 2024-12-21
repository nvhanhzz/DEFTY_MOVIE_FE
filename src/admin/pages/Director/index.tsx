import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  // Import useTranslation
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import { deleteDirectors, getDirectors } from "../../services/directorService.tsx";
import moment from 'moment';

export interface Director {
    id: string;
    fullName: string,
    gender: string,
    dateOfBirth: Date,
    weight: string,
    height: string,
    nationality: string,
    description: string,
    avatar: string
}

const DirectorPage: React.FC = () => {
    const { t } = useTranslation();  // Khởi tạo t từ useTranslation
    const [data, setData] = useState<Director[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // State cho từ khóa tìm kiếm
    const navigate = useNavigate();
    const location = useLocation();

    const fetchData = async (page: number, pageSize: number) => {
        setIsLoading(true);
        try {
            const response = await getDirectors(page, pageSize); // Gọi API với từ khóa
            const result = await response.json();
            const content: Director[] = result.data.content;
            const directors = content.map((item: Director) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(directors);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));  // Sử dụng t() để thay thế chuỗi
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('pageSize') || '10', 10);
        const keywordFromUrl = searchParams.get('keyword') || ''; // Lấy từ khóa tìm kiếm từ URL

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setSearchKeyword(keywordFromUrl); // Cập nhật từ khóa tìm kiếm
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize); // Gọi fetchData với từ khóa tìm kiếm
    }, [currentPage, pageSize, searchKeyword]);

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
                setData(prevData => prevData.filter(item => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess'));  // Dùng t() cho thông báo
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError'));  // Dùng t() cho thông báo
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

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
        navigate(`?page=1&pageSize=${pageSize}&keyword=${keyword}`);
    };

    const dataListConfig: DataListConfig<Director> = {
        columns: [
            {
                title: 'No.',  // Dùng t() cho tiêu đề cột
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Director, b: Director) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.director.fullName'),  // Dùng t() cho tiêu đề cột
                dataIndex: 'fullName',
                key: 'fullName',
                sorter: (a: Director, b: Director) => (a.fullName || '').localeCompare(b.fullName || ''),
            },
            {
                title: t('admin.director.gender.title'),  // Dùng t() cho tiêu đề cột
                dataIndex: 'gender',
                key: 'gender',
                sorter: (a: Director, b: Director) => (a.gender || '').localeCompare(b.gender || ''),
            },
            {
                title: t('admin.director.weight'),  // Dùng t() cho tiêu đề cột
                dataIndex: 'weight',
                key: 'weight',
                sorter: (a: Director, b: Director) => (a.weight || '').localeCompare(b.weight || ''),
            },
            {
                title: t('admin.director.height'),  // Dùng t() cho tiêu đề cột
                dataIndex: 'height',
                key: 'height',
                sorter: (a: Director, b: Director) => (a.height || '').localeCompare(b.height || ''),
            },
            {
                title: t('admin.director.nationality'),  // Dùng t() cho tiêu đề cột
                dataIndex: 'nationality',
                key: 'nationality',
                sorter: (a: Director, b: Director) => (a.nationality || '').localeCompare(b.nationality || ''),
            },
            {
                title: t('admin.director.description'),  // Dùng t() cho tiêu đề cột
                dataIndex: 'description',
                key: 'description',
                sorter: (a: Director, b: Director) => (a.description || '').localeCompare(b.description || ''),
            },
            {
                title: t('admin.director.avatar'),  // Dùng t() cho tiêu đề cột
                dataIndex: 'avatar',
                key: 'avatar',
                render: (thumbnail: string) => (
                    <img src={thumbnail} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: t('admin.director.dateOfBirth'),  // Dùng t() cho tiêu đề cột
                dataIndex: 'dateOfBirth',
                key: 'dateOfBirth',
                render: (dateOfBirth: Date) => dateOfBirth ? moment(dateOfBirth).format('DD/MM/YYYY') : '',
                sorter: (a: Director, b: Director) => (a.dateOfBirth ? moment(a.dateOfBirth).unix() : 0) - (b.dateOfBirth ? moment(b.dateOfBirth).unix() : 0),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewPermission,
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/directors`, name: t('admin.director.title') },
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

export default DirectorPage;