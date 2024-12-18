import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {deleteRole, getRoles} from '../../services/roleSevice';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { Permission } from '../Permission';
import { LoadingOutlined } from '@ant-design/icons';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Role {
    id: string;
    name: string;
    description: string;
    rolePermissions: Permission[];
}

const RolePage: React.FC = () => {
    const [data, setData] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Hàm fetch dữ liệu với API
    const fetchData = async (page: number, pageSize: number, keyword: string) => {
        setIsLoading(true);
        try {
            const response = await getRoles(page, pageSize, 'name', keyword); // Gọi API với từ khóa
            if (!response.ok) {
                message.error(t('admin.message.fetchError'));
                return;
            }
            const result = await response.json();
            const content: Role[] = result.data.content;
            const roles = content.map((item: any) => ({ ...item, key: item.id }));
            setTotalItems(result.data.totalElements);
            setData(roles);
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý URLSearchParams để theo dõi các tham số page, pageSize và keyword
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('pageSize') || '10', 10);
        const keywordFromUrl = searchParams.get('keyword') || ''; // Lấy từ khóa tìm kiếm từ URL

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setSearchKeyword(keywordFromUrl);

        fetchData(pageFromUrl, pageSizeFromUrl, keywordFromUrl); // Gọi dữ liệu mỗi khi URL thay đổi
    }, [location.search]);

    // Hàm xử lý xóa các mục
    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteRole(ids as string[]);
            console.log(response);
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

    // Hàm xử lý tìm kiếm
    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1); // Reset lại trang hiện tại khi tìm kiếm
        navigate(`?page=1&pageSize=${pageSize}&keyword=${keyword}`); // Cập nhật URL với từ khóa tìm kiếm
    };

    // Hàm thay đổi trang
    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}&keyword=${searchKeyword}`);
    };

    // Cấu hình dữ liệu cho DataListTemplate
    const dataListConfig: DataListConfig<Role> = {
        columns: [
            {
                title: 'No.',
                dataIndex: 'key',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Role, b: Role) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.role.roleColumn'),
                dataIndex: 'name',
                key: 'name',
                sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
            },
            {
                title: t('admin.role.descriptionColumn'),
                dataIndex: 'description',
                key: 'description',
                sorter: (a: Role, b: Role) => a.description.localeCompare(b.description),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: () => navigate('create'),
        onUpdate: (id: string) => navigate(`update/${id}`),
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
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/roles`, name: t('admin.role.title') },
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

export default RolePage;
