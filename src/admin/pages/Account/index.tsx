import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import {deleteAccounts, getAccounts} from '../../services/accountService.tsx';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Account {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    gender: string;
    address: string;
    avatar: string;
    dateOfBirth: Date;
    role: string;
}

const AccountPage: React.FC = () => {
    const [data, setData] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // Thêm state lưu từ khóa tìm kiếm
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Hàm fetch dữ liệu, bao gồm cả tìm kiếm
    const fetchData = async (page: number, pageSize: number, keyword?: string) => {
        setIsLoading(true);
        try {
            const response = await getAccounts(page, pageSize, 'username', keyword);
            if (!response.ok) {
                message.error(t('admin.message.fetchError'));
                return;
            }
            const result = await response.json();
            const content: Account[] = result.data.content;
            const accounts = content.map((item) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(accounts);
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
        setSearchKeyword(keywordFromUrl); // Đặt từ khóa tìm kiếm trong state

        // Fetch dữ liệu ban đầu
        fetchData(pageFromUrl, pageSizeFromUrl, keywordFromUrl);
    }, [location.search]);

    const handleDelete = async (id: string) => {
        console.log(id);
        setIsLoading(true);
        try {
            const response = await deleteAccounts([id]);
            if (response.ok) {
                setData(prevData => prevData.filter(item => item.id !== id));
                message.success(t('admin.message.deleteSuccess')); // Thông báo khi xóa thành công
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError')); // Thông báo khi có lỗi xóa
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.deleteError')); // Thông báo khi xóa thất bại
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewAccount = () => {
        navigate('create');
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteAccounts(ids as string[]);
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

    const onPageChange = (page: number, pageSize?: number) => {
        const keyword = searchKeyword || '';
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}&keyword=${keyword}`);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1); // Reset lại trang hiện tại về trang 1 khi tìm kiếm
        navigate(`?page=1&pageSize=${pageSize}&keyword=${keyword}`);
    };

    const dataListConfig: DataListConfig<Account> = {
        columns: [
            {
                title: 'No.',
                dataIndex: 'key',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Account, b: Account) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.account.username'),
                dataIndex: 'username',
                key: 'username',
                sorter: (a: Account, b: Account) => a.username.localeCompare(b.username),
            },
            {
                title: t('admin.account.email'),
                dataIndex: 'email',
                key: 'email',
                sorter: (a: Account, b: Account) => (a.email || '').localeCompare(b.email || ''),
            },
            {
                title: t('admin.account.fullName'),
                dataIndex: 'fullName',
                key: 'fullName',
                sorter: (a: Account, b: Account) => (a.fullName || '').localeCompare(b.fullName || ''),
            },
            {
                title: t('admin.account.phone'),
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: t('admin.account.gender.title'),
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: t('admin.account.role.title'),
                dataIndex: 'role',
                key: 'role',
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewAccount,
        onUpdate: handleUpdate,
        onDelete: handleDelete,
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
        },
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/accounts`, name: t('admin.account.title') },
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

export default AccountPage;
