import React, { useEffect, useState } from 'react';
import { Button, message, Popconfirm, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllPermission } from '../../services/permissionService';
import DataListTemplate from '../../templates/DataList';
import OutletTemplate from '../../templates/Outlet';
import type { SorterResult, TablePaginationConfig } from 'antd/es/table/interface';

interface Permission {
    id: string;
    name: string;
    description: string;
}

const PermissionsPage: React.FC = () => {
    const [data, setData] = useState<Permission[]>([]);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<React.Key[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Kích thước trang mặc định
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetchPermissions();
    }, [currentPage, pageSize]);

    // Hàm gọi API để lấy danh sách quyền
    const fetchPermissions = async () => {
        try {
            const response = await getAllPermission();
            const result = await response.json();
            if (result.status === 200) {
                setData(result.data.map((item: Permission, index: number) => ({
                    ...item,
                    key: index + 1, // Thêm key để đánh số thứ tự
                })));
            } else {
                message.error(t('admin.permission.fetchError'));
            }
        } catch (error) {
            message.error(t('admin.permission.fetchError'));
        }
    };

    // Hàm xử lý xóa quyền
    const handleDelete = (id: string) => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        message.success(t('admin.permission.deleteSuccessMessage'));
    };

    // Hàm xử lý cập nhật quyền
    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    // Hàm tạo mới quyền
    const handleCreateNewPermission = () => {
        navigate('create');
    };

    // Hàm xóa nhiều quyền
    const handleDeleteSelected = () => {
        const newData = data.filter((item) => !selectedPermissionIds.includes(item.id));
        setData(newData);
        setSelectedPermissionIds([]);
        message.success(t('admin.permission.deleteSelectedSuccessMessage'));
    };

    // Hàm xử lý thay đổi phân trang, sắp xếp và bộ lọc
    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, any>,
        sorter: SorterResult<Permission> | SorterResult<Permission>[]
    ) => {
        console.log('Pagination:', pagination);
        console.log('Filters:', filters);
        console.log('Sorter:', sorter);

        // Cập nhật lại phân trang dựa trên thay đổi
        setCurrentPage(pagination.current || 1);
        setPageSize(pagination.pageSize || 10);
    };

    // Định nghĩa cấu hình cho bảng (Permissions)
    const tableConfig = {
        columns: [
            {
                title: 'No.',
                dataIndex: 'key',
                key: 'key',
                width: '10%',
            },
            {
                title: t('admin.permission.nameColumn'),
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                sorter: (a: Permission, b: Permission) => a.name.localeCompare(b.name),
            },
            {
                title: t('admin.permission.descriptionColumn'),
                dataIndex: 'description',
                key: 'description',
                width: '40%',
                sorter: (a: Permission, b: Permission) => a.description.localeCompare(b.description),
            },
        ],
        data, // Dữ liệu bảng
        rowKey: 'id', // Khóa duy nhất cho mỗi hàng
        pagination: {
            current: currentPage, // Trang hiện tại
            pageSize: pageSize, // Kích thước trang
            total: data.length, // Tổng số bản ghi
            showSizeChanger: true, // Hiển thị lựa chọn kích thước trang
        },
        onCreateNew: handleCreateNewPermission, // Hàm xử lý sự kiện tạo mới
        onUpdate: handleUpdate, // Hàm xử lý sự kiện cập nhật
        onDelete: handleDelete, // Hàm xử lý sự kiện xóa
        onDeleteSelected: handleDeleteSelected, // Hàm xử lý sự kiện xóa nhiều
        onTableChange: handleTableChange, // Hàm xử lý thay đổi phân trang, sắp xếp và bộ lọc
    };

    // Định nghĩa cấu hình breadcrumb
    const breadcrumbItems = [
        { name: t('admin.dashboard'), path: '/' },
        { name: t('admin.permission.title'), path: '/permissions' },
    ];

    return (
        <OutletTemplate
            breadcrumbItems={breadcrumbItems} // Sử dụng cấu hình breadcrumb mới
        >
            <DataListTemplate config={tableConfig} />
        </OutletTemplate>
    );
};

export default PermissionsPage;
