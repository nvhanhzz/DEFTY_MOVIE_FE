import React, {useEffect, useState} from 'react';
import {Image, message, Spin, Switch} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import type {DataListConfig} from '../../templates/DataList';
import DataListTemplate from '../../templates/DataList';
import {LoadingOutlined} from '@ant-design/icons';
import {deleteAccounts, getAccounts, switchStatusAccount} from '../../services/accountService.tsx';
import {Role} from "../Role";
import SearchFormTemplate from "../../templates/Search";

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
    status: number;
    dateOfBirth: Date;
    role: string;
}

const AccountPage: React.FC = () => {
    const [data, setData] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [showFilter, setShowFilter] = useState(false);
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const searchFields = [
        {
            type: 'input',
            label: t('admin.account.username'),
            name: 'username',
            placeholder: t('admin.account.username'),
        }
    ];

    const fetchData = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getAccounts(page, pageSize, filters);
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

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewAccount = () => {
        navigate('create');
    };

    // Hàm xóa tài khoản (cả xóa đơn lẫn xóa nhiều mục)
    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteAccounts(ids as string[]);
            if (response.ok) {
                setData(prevData => prevData.filter(item => !ids.includes(item.id)));
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

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            setData(prevData => prevData.map(item =>
                item.id === id ? { ...item, status: checked ? 1 : 0 } : item
            ));
            const response = await switchStatusAccount(id);
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

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
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

    const dataListConfig: DataListConfig<Account> = {
        columns: [
            {
                title: 'No.',
                dataIndex: 'key',
                align: 'center',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Account, b: Account) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.account.fullName'),
                dataIndex: 'fullName',
                key: 'fullName',
                align: 'center',
                sorter: (a: Account, b: Account) => (a.fullName || '').localeCompare(b.fullName || ''),
            },
            {
                title: t('admin.account.avatar'),
                dataIndex: 'avatar',
                key: 'avatar',
                render: (avatar: string) => (
                    <Image
                        width={60}  // Điều chỉnh kích thước ảnh nếu cần
                        height={60}
                        style={{
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }}
                        src={avatar}  // Đường dẫn ảnh
                        alt="avatar"
                    />
                ),
            },
            {
                title: t('admin.account.username'),
                dataIndex: 'username',
                key: 'username',
                align: 'center',
                sorter: (a: Account, b: Account) => a.username.localeCompare(b.username),
            },
            {
                title: t('admin.account.email'),
                dataIndex: 'email',
                key: 'email',
                align: 'center',
                sorter: (a: Account, b: Account) => (a.email || '').localeCompare(b.email || ''),
            },
            {
                title: t('admin.account.fullName'),
                dataIndex: 'fullName',
                key: 'fullName',
                align: 'center',
                sorter: (a: Account, b: Account) => (a.fullName || '').localeCompare(b.fullName || ''),
            },
            {
                title: t('admin.account.phone'),
                dataIndex: 'phone',
                key: 'phone',
                align: 'center',
            },
            {
                title: t('admin.account.gender.title'),
                dataIndex: 'gender',
                key: 'gender',
                align: 'center',
            },
            {
                title: t('admin.account.role.title'),
                dataIndex: 'role',
                key: 'role',
                align: 'center',
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
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewAccount,
        onUpdate: handleUpdate,
        // Bỏ onDelete đi vì xóa tất cả thông qua onDeleteSelected
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
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/accounts`, name: t('admin.account.title') },
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

export default AccountPage;