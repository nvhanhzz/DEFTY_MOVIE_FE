import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import {deleteDirectors, getDirectors} from "../../services/directorService.tsx";
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
    const [data, setData] = useState<Director[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // State cho từ khóa tìm kiếm
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const fetchData = async (page: number, pageSize: number) => {
        setIsLoading(true);
        try {
            const response = await getDirectors(page, pageSize); // Gọi API với từ khóa
            const result = await response.json();
            console.log(result);
            const content: Director[] = result.responses;
            const directors = content.map((item: Director) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.totalElements);
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
            console.log(response);
            if (response.ok) {
                setData(prevData => prevData.filter(item => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess')); // Thông báo khi xóa nhiều thành công
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError')); // Thông báo khi xóa nhiều lỗi
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        navigate(`?page=${page}&pageSize=${pageSize || 10}`); // Cập nhật URL với từ khóa tìm kiếm
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1); // Reset lại trang về 1 khi tìm kiếm
        navigate(`?page=1&pageSize=${pageSize}&keyword=${keyword}`); // Cập nhật URL khi tìm kiếm
    };

    const dataListConfig: DataListConfig<Director> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Director, b: Director) => Number(a.id) - Number(b.id),
            },
            {
                title: 'Full name',
                dataIndex: 'fullName',
                key: 'fullName',
                sorter: (a: Director, b: Director) => (a.fullName || '').localeCompare(b.fullName || ''),
            },
            {
                title: 'Gender',
                dataIndex: 'gender',
                key: 'gender',
                sorter: (a: Director, b: Director) => (a.gender || '').localeCompare(b.gender || ''),
            },
            {
                title: 'Weight',
                dataIndex: 'weight',
                key: 'weight',
                sorter: (a: Director, b: Director) => (a.weight || '').localeCompare(b.weight || ''),
            },
            {
                title: 'Height',
                dataIndex: 'height',
                key: 'height',
                sorter: (a: Director, b: Director) => (a.height || '').localeCompare(b.height || ''),
            },
            {
                title: 'Nationality',
                dataIndex: 'nationality',
                key: 'nationality',
                sorter: (a: Director, b: Director) => (a.nationality || '').localeCompare(b.nationality || ''),
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                sorter: (a: Director, b: Director) => (a.description || '').localeCompare(b.description || ''),
            },
            {
                title: 'Avatar',
                dataIndex: 'avatar',
                key: 'avatar',
                render: (thumbnail: string) => (
                    <img src={thumbnail} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: 'Date of Birth',
                dataIndex: 'dateOfBirth',
                key: 'dateOfBirth',
                render: (dateOfBirth: Date) => dateOfBirth ? moment(dateOfBirth).format('DD/MM/YYYY') : '',
                sorter: (a: Director, b: Director) => (a.dateOfBirth ? moment(a.dateOfBirth).unix() : 0) - (b.dateOfBirth ? moment(b.dateOfBirth).unix() : 0),
            },
            // Các trường khác nếu có
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewPermission,
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/directors`, name: t('admin.director.title') }
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