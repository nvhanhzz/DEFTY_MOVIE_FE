import React, { useState } from 'react';
import { Table, Button, Input, Row, Col, Space, Popconfirm, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import type { ColumnType, FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/es/table/interface';
import { useTranslation } from 'react-i18next';
import "./DataList.scss";

export interface DataListConfig<T> {
    columns: TableColumnsType<T>;
    data: T[];
    rowKey: string;
    onCreateNew: () => void;
    onUpdate: (id: string) => void;
    onDelete: (id: string) => void;
    onDeleteSelected: (ids: React.Key[]) => void;
    search?: {
        keyword?: string; // Từ khóa tìm kiếm
        onSearch: (value: string) => void; // Hàm tìm kiếm
    };
    pagination: {
        totalItems: number;
        currentPage: number;
        pageSize: number;
        onPaginationChange?: (page: number, pageSize: number, keyword?: string) => void; // Hàm thay đổi phân trang
    };
}

const DataListTemplate = <T extends { id: string }>({
                                                        config,
                                                    }: { config: DataListConfig<T> }): JSX.Element => {
    const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>(config.search?.keyword || ''); // State cho từ khóa tìm kiếm
    const { t } = useTranslation();

    const handleTableChange = (
        _pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        _sorter: SorterResult<T> | SorterResult<T>[],
        _extra: TableCurrentDataSource<T>
    ) => { };

    const handleSearchEnter = () => {
        if (config.search) {
            config.search.onSearch(searchKeyword); // Gọi hàm onSearch khi nhấn Enter
        }
    };

    const actionColumn: ColumnType<T> = {
        title: t('admin.dataList.actionColumn'),
        key: 'action',
        render: (record: T) => (
            <Space className="data-list__action-buttons">
                <Button className="data-list__action-button data-list__action-button--edit" icon={<EditOutlined />} onClick={() => config.onUpdate(record.id)} />
                <Popconfirm
                    title={t('admin.dataList.deleteConfirm')}
                    onConfirm={() => config.onDelete(record.id)}
                    okText={t('admin.dataList.deleteSelectedConfirm')}
                    cancelText={t('admin.dataList.deleteSelectedCancel')}
                >
                    <Button className="data-list__action-button data-list__action-button--delete" icon={<DeleteOutlined />} danger />
                </Popconfirm>
            </Space>
        ),
    };

    return (
        <>
            <Row justify="space-between" className="data-list__header">
                <Col>
                    <Button className="data-list__create-button" type="primary" icon={<PlusOutlined />} onClick={config.onCreateNew}>
                        {t('admin.dataList.createNewButton')}
                    </Button>
                </Col>
                <Col>
                    {config.search && (
                        <Input
                            className="data-list__search-input"
                            placeholder={t('admin.dataList.searchPlaceholder')}
                            value={searchKeyword} // Hiển thị từ khóa tìm kiếm hiện tại
                            onPressEnter={handleSearchEnter} // Xử lý sự kiện nhấn Enter
                            onChange={(e) => setSearchKeyword(e.target.value)} // Cập nhật từ khóa khi người dùng nhập
                            prefix={<SearchOutlined />}
                        />
                    )}
                </Col>
            </Row>

            <Table<T>
                className="data-list__table"
                columns={[...config.columns, actionColumn]}
                dataSource={config.data}
                rowKey={config.rowKey}
                pagination={false}
                onChange={handleTableChange}
                rowSelection={{
                    selectedRowKeys: selectedIds,
                    onChange: (keys) => setSelectedIds(keys),
                }}
            />

            <Row justify="space-between" className="data-list__footer" style={{ marginTop: '16px' }}>
                <Col>
                    <Popconfirm
                        title={t('admin.dataList.deleteConfirm')}
                        onConfirm={() => config.onDeleteSelected(selectedIds)}
                        okText={t('admin.dataList.deleteSelectedConfirm')}
                        cancelText={t('admin.dataList.deleteSelectedCancel')}
                    >
                        <Button
                            className="data-list__delete-selected-button"
                            type="primary"
                            danger
                            disabled={selectedIds.length === 0}
                        >
                            {t('admin.dataList.deleteSelectedButton')}
                        </Button>
                    </Popconfirm>
                </Col>
                <Col>
                    <Pagination
                        current={config.pagination.currentPage || 1}
                        total={config.pagination.totalItems}
                        pageSize={config.pagination.pageSize}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '50', '100']}
                        onChange={(page, pageSize) => {
                            if (config.pagination.onPaginationChange) {
                                config.pagination.onPaginationChange(page, pageSize || config.pagination.pageSize, searchKeyword); // Thêm từ khóa tìm kiếm khi phân trang
                            }
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default DataListTemplate;