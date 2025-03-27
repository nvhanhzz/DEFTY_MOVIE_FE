import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import {deleteMembershipPacket, getMembershipPackets} from "../../services/membershipPackageService.tsx";

export interface MembershipPackage {
    id: string;
    name: string;
    description: string;
    price: number;
    discount: number;
}

const MembershipPacketPage: React.FC = () => {
    const [data, setData] = useState<MembershipPackage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // State cho từ khóa tìm kiếm
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const fetchData = async (page: number, pageSize: number, keyword: string) => {
        setIsLoading(true);
        try {
            const response = await getMembershipPackets(page, pageSize, 'name', keyword);
            const result = await response.json();
            console.log(result)
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

    // Hàm xử lý khi thay đổi trang
    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}&keyword=${searchKeyword}`); // Cập nhật URL với từ khóa tìm kiếm
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1); // Reset lại trang về 1 khi tìm kiếm
        navigate(`?page=1&pageSize=${pageSize}&keyword=${keyword}`); // Cập nhật URL khi tìm kiếm
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
                title: t('admin.membership-packet.descriptionColumn'),
                dataIndex: 'description',
                key: 'description',
                align: 'center',
                sorter: (a: MembershipPackage, b: MembershipPackage) => a.description.localeCompare(b.description),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewMembershipPacket,
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/membership-packets`, name: t('admin.membership-packet.title') }
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

export default MembershipPacketPage;