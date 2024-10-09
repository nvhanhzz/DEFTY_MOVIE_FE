import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType } from 'antd';
import { Button, Input, Space, Table, message, Popconfirm, Row, Col } from 'antd';
import type { FilterDropdownProps, TablePaginationConfig, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Permission.scss';

interface Permission {
    key: string;
    id: string;
    name: string;
    description: string;
}

type DataIndex = keyof Permission;

const PermissionsPage: React.FC = () => {
    const [, setSearchText] = useState('');
    const [, setSearchedColumn] = useState<DataIndex | ''>('');
    const [data, setData] = useState<Permission[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<React.Key[]>([]);

    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();
    const { t } = useTranslation(); // Hook để dịch các văn bản

    useEffect(() => {
        const fetchData = () => {
            const permissions: Permission[] = [
                {
                    key: '1',
                    id: '1',
                    name: 'Create',
                    description: 'Permission to create new entries',
                },
                {
                    key: '2',
                    id: '2',
                    name: 'Read',
                    description: 'Permission to read data',
                },
                {
                    key: '3',
                    id: '3',
                    name: 'Update',
                    description: 'Permission to update existing entries',
                },
                {
                    key: '4',
                    id: '4',
                    name: 'Delete',
                    description: 'Permission to delete entries',
                },
            ];
            setData(permissions);
            setPagination((prev) => ({ ...prev, total: permissions.length }));
        };
        fetchData();
    }, [t]);

    const handleTableChange = (newPagination: TablePaginationConfig, _: any, sorter: SorterResult<Permission> | SorterResult<Permission>[]) => {
        setPagination(newPagination);

        if (!Array.isArray(sorter) && sorter.order) {
            const sortedData = [...data].sort((a, b) => {
                const field = sorter.field as DataIndex;
                if (sorter.order === 'ascend') {
                    return a[field].toString().localeCompare(b[field].toString());
                }
                return b[field].toString().localeCompare(a[field].toString());
            });
            setData(sortedData);
        }
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const handleDelete = (id: string) => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        message.success(t('admin.permission.deleteSuccessMessage')); // Sử dụng t để dịch văn bản
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewPermission = () => {
        navigate('create');
    };

    const handleDeleteSelected = () => {
        const newData = data.filter(item => !selectedPermissionIds.includes(item.id));
        setData(newData);
        setSelectedPermissionIds([]); // Reset selected permission IDs
        message.success(t('admin.permission.deleteSelectedSuccessMessage')); // Sử dụng t để dịch văn bản
    };

    const getColumnSearchProps = (dataIndex: DataIndex): any => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: FilterDropdownProps) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={t('admin.permission.searchPlaceholder', { column: dataIndex })} // Dùng t cho placeholder
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        {t('admin.permission.searchButton')}
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        {t('admin.permission.resetButton')}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        {t('admin.permission.filterButton')}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        {t('admin.permission.closeButton')}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value: string, record: { [x: string]: { toString: () => any; }; }) =>
            (record[dataIndex as keyof Permission]?.toString() || '')  // Sử dụng optional chaining
                .toLowerCase()
                .includes((value as string).toLowerCase()),
    });

    const columns: TableColumnsType<Permission> = [
        {
            title: 'No.',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            sorter: (a, b) => Number(a.id) - Number(b.id),
        },
        {
            title: t('admin.permission.nameColumn'),
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: t('admin.permission.descriptionColumn'),
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
        },
        {
            title: t('admin.permission.actionColumn'),
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleUpdate(record.id)}
                    >
                        {t('admin.permission.updateButton')}
                    </Button>
                    <Popconfirm
                        title={t('admin.permission.deleteConfirmMessage')}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            {t('admin.permission.deleteButton')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <h1>{t('admin.permission.title')}</h1>
            <Row justify="space-between" className="permission-header">
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNewPermission}
                    >
                        {t('admin.permission.createNewPermissionButton')}
                    </Button>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        danger={true}
                        onClick={handleDeleteSelected}
                        disabled={selectedPermissionIds.length === 0}
                    >
                        {t('admin.permission.deleteSelectedButton')}
                    </Button>
                </Col>
            </Row>
            <Table<Permission>
                columns={columns}
                dataSource={data}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                }}
                onChange={handleTableChange}
                rowKey="id"
                rowSelection={{
                    selectedRowKeys: selectedPermissionIds,
                    onChange: (selectedKeys) => setSelectedPermissionIds(selectedKeys),
                }}
            />
        </>
    );
};

export default PermissionsPage;