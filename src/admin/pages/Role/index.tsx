import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType } from 'antd';
import { Button, Input, Space, Table, message, Popconfirm, Row, Col } from 'antd';
import type { FilterDropdownProps, TablePaginationConfig, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation từ i18next
import './Role.scss';

interface Role {
    key: string;
    id: string;
    role: string;
    description: string;
}

type DataIndex = keyof Role;

const RolePage: React.FC = () => {
    const [, setSearchText] = useState('');
    const [, setSearchedColumn] = useState<DataIndex | ''>('');
    const [data, setData] = useState<Role[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [selectedRoleIds, setSelectedRoleIds] = useState<React.Key[]>([]);

    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();
    const { t } = useTranslation(); // Hook để dịch các văn bản

    useEffect(() => {
        const fetchData = () => {
            const roles: Role[] = [
                {
                    key: '1',
                    id: '1',
                    role: 'Administrator',
                    description: 'Admin', // Sử dụng t để dịch văn bản
                },
                {
                    key: '2',
                    id: '2',
                    role: 'Product Manager',
                    description: 'Quản lý sản phẩm',
                },
                {
                    key: '3',
                    id: '3',
                    role: 'Editor',
                    description: 'Chỉnh sửa nội dung',
                },
            ];
            setData(roles);
            setPagination((prev) => ({ ...prev, total: roles.length }));
        };
        fetchData();
    }, [t]);

    const handleTableChange = (newPagination: TablePaginationConfig, _: any, sorter: SorterResult<Role> | SorterResult<Role>[]) => {
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
        message.success(t('admin.role.deleteSuccessMessage')); // Sử dụng t để dịch văn bản
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleCreateNewRole = () => {
        navigate('create');
    };

    const handleDeleteSelected = () => {
        const newData = data.filter(item => !selectedRoleIds.includes(item.id));
        setData(newData);
        setSelectedRoleIds([]); // Reset selected role IDs
        message.success(t('admin.role.deleteSelectedSuccessMessage')); // Sử dụng t để dịch văn bản
    };

    const getColumnSearchProps = (dataIndex: DataIndex): any => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: FilterDropdownProps) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={t('admin.role.searchPlaceholder', { column: dataIndex })} // Dùng t cho placeholder
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
                        {t('admin.role.searchButton')}
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        {t('admin.role.resetButton')}
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
                        {t('admin.role.filterButton')}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        {t('admin.role.closeButton')}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value: string, record: { [x: string]: { toString: () => any; }; }) =>
            (record[dataIndex as keyof Role]?.toString() || '')  // Sử dụng optional chaining
                .toLowerCase()
                .includes((value as string).toLowerCase()),
    });

    const columns: TableColumnsType<Role> = [
        {
            title: 'No.',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            sorter: (a, b) => Number(a.id) - Number(b.id),
        },
        {
            title: t('admin.role.roleColumn'),
            dataIndex: 'role',
            key: 'role',
            width: '30%',
            sorter: (a, b) => a.role.localeCompare(b.role),
            ...getColumnSearchProps('role'),
        },
        {
            title: t('admin.role.descriptionColumn'),
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
        },
        {
            title: t('admin.role.actionColumn'),
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleUpdate(record.id)}
                    >
                        {t('admin.role.updateButton')}
                    </Button>
                    <Popconfirm
                        title={t('admin.role.deleteConfirmMessage')}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            {t('admin.role.deleteButton')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <h1>{t('admin.role.title')}</h1>
            <Row justify="space-between" className="role-header">
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNewRole}
                    >
                        {t('admin.role.createNewRoleButton')}
                    </Button>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        danger={true}
                        onClick={handleDeleteSelected}
                        disabled={selectedRoleIds.length === 0}
                    >
                        {t('admin.role.deleteSelectedButton')}
                    </Button>
                </Col>
            </Row>
            <Table<Role>
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
                    selectedRowKeys: selectedRoleIds,
                    onChange: (selectedKeys) => setSelectedRoleIds(selectedKeys),
                }}
            />
        </>
    );
};

export default RolePage;