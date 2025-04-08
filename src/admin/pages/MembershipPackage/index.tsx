import React, {useEffect, useState} from 'react';
import {message, Spin, Switch} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import type {DataListConfig} from '../../templates/DataList';
import DataListTemplate from '../../templates/DataList';
import {LoadingOutlined} from '@ant-design/icons';
import {deleteMembershipPacket, getMembershipPackets, switchStatus} from "../../services/membershipPackageService.tsx";
import SearchFormTemplate from "../../templates/Search";
import {Role} from "../Role";

export interface MembershipPackage {
    id: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    membershipType: number;
    status: number;
}

const MembershipPacketPage: React.FC = () => {
    const [data, setData] = useState<MembershipPackage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const navigate = useNavigate();
    const [showFilter, setShowFilter] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();


    const searchFields = [
        {
            type: 'select',
            label: t('admin.membership-packet.nameColumn'),
            name: 'name',
            placeholder: t('admin.membership-packet.nameColumn'),
            options: [
                { label: 'Normal', value: "Normal"},
                { label: 'Premium', value: "Premium" },
                { label: 'Free Trial', value: "Free Trial" },
            ],
        },
        {
            type: 'select',
            label: t('admin.membership-packet.create.duration'),
            name: 'duration',
            placeholder: t('admin.membership-packet.create.duration'),
            options: [
                { label: '0 tháng', value: 0 },
                { label: '1 tháng', value: 1 },
                { label: '3 tháng', value: 3 },
                { label: '6 tháng', value: 6 },
                { label: '9 tháng', value: 9 },
                { label: '12 tháng', value: 12 },
            ],
        }

    ];
    const fetchData = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getMembershipPackets(page, pageSize, filters);
            const result = await response.json();
            // console.log(result)
            const content: MembershipPackage[] = result.data.content;
            const membershipPackets = content.map((item: any) => ({
                ...item,
                key: item.id,
            }));
            setTotalItems(result.data.totalElements);
            setData(membershipPackets);
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

    const handleCreateNewMembershipPacket = () => {
        navigate('create');
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteMembershipPacket(ids as string[]);
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

    const handleSwitchStatus = async (id: string, checked: boolean) => {
        setIsLoading(true);
        try {
            setData(prevData => prevData.map(item =>
                item.id === id ? { ...item, status: checked ? 1 : 0 } : item
            ));
            const response = await switchStatus(id);
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

    const dataListConfig: DataListConfig<MembershipPackage> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                align: 'center',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: MembershipPackage, b: MembershipPackage) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.membership-packet.nameColumn'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                sorter: (a: MembershipPackage, b: MembershipPackage) => a.name.localeCompare(b.name),
            },
            {
                title: t('admin.membership-packet.create.duration'),
                dataIndex: 'duration',
                key: 'duration',
                align: 'center',
                render: (value) => `${value ?? 0} ${t('admin.membership-packet.month')}`,
            },
            {
                title: t('admin.membership-packet.price'),
                dataIndex: 'price',
                key: 'price',
                align: 'center',
                render: (value) => `${value ?? 0} VNĐ`,
            },

            {
                title: t('admin.membership-packet.descriptionColumn'),
                dataIndex: 'description',
                key: 'description',
                align: 'center',
                sorter: (a: MembershipPackage, b: MembershipPackage) => a.description.localeCompare(b.description),
            },
            {
                title: t('admin.membership-packet.status'),
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                sorter: (a: Role, b: Role) => a.status - b.status,
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
        onCreateNew: handleCreateNewMembershipPacket,
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/membership-packets`, name: t('admin.membership-packet.title') }
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

export default MembershipPacketPage;