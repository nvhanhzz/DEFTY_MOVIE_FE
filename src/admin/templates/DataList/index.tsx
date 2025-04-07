import React, { useState } from 'react';
import { Table, Button, Input, Row, Col, Space, Popconfirm, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import type { ColumnType, FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/es/table/interface';
import { useTranslation } from 'react-i18next';
import "./DataList.scss";

export interface DataListConfig<T> {
    columns: TableColumnsType<T>;
    data: T[];
    rowKey: string;
    onCreateNew?: () => void;
    onUpdate?: (id: string) => void;
    onDeleteSelected?: (ids: React.Key[]) => void;
    onViewDetail?: (id: string) => void;
    search?: {
        keyword?: string;
        onSearch: (value: string) => void;
    };
    pagination: {
        totalItems: number;
        currentPage: number;
        pageSize: number;
        onPaginationChange?: (page: number, pageSize: number, keyword?: string) => void;
    };
}

const DataListTemplate = <T extends { id: string }>( { config }: { config: DataListConfig<T> }): JSX.Element => {
    const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>(config.search?.keyword || '');
    const { t } = useTranslation();

    // Xử lý sự kiện thay đổi bảng (không thay đổi gì trong phần này)
    const handleTableChange = (
        _pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        _sorter: SorterResult<T> | SorterResult<T>[],
        _extra: TableCurrentDataSource<T>
    ) => {
        // Nếu cần, có thể xử lý thêm logic phân trang hoặc sắp xếp tại đây
    };

    // Xử lý sự kiện tìm kiếm khi nhấn Enter
    const handleSearchEnter = () => {
        if (config.search) {
            config.search.onSearch(searchKeyword); // Gọi hàm onSearch khi nhấn Enter
        }
    };

    const actionColumn: ColumnType<T> = {
        title: t('admin.dataList.actionColumn'),
        key: 'action',
        align: 'center',
        render: (record: T) => (
            <Space className="data-list__action-buttons">
                { config.onViewDetail && (
                    <Button className="data-list__action-button data-list__action-button--view" icon={<EyeOutlined />} onClick={() => config.onViewDetail && config.onViewDetail(record.id)} />
                )}
                { config.onUpdate && (
                    <Button className="data-list__action-button data-list__action-button--edit" icon={<EditOutlined />} onClick={() => config.onUpdate && config.onUpdate(record.id)} />
                )}
                { config.onDeleteSelected && (
                    <Popconfirm
                        title={t('admin.dataList.deleteConfirm')}
                        onConfirm={() => config.onDeleteSelected && config.onDeleteSelected([record.id])} // Sử dụng onDeleteSelected thay vì onDelete
                        okText={t('admin.dataList.deleteSelectedConfirm')}
                        cancelText={t('admin.dataList.deleteSelectedCancel')}
                    >
                        <Button className="data-list__action-button data-list__action-button--delete" icon={<DeleteOutlined />} />
                    </Popconfirm>
                )}
            </Space>
        ),
    };

    return (
        <>
            <Row justify="space-between" className="data-list__header">
                <Col>
                    {config.onCreateNew && (
                        <Button className="data-list__create-button" type="primary" icon={<PlusOutlined />} onClick={config.onCreateNew}>
                            {t('admin.dataList.createNewButton')}
                        </Button>
                    )}
                </Col>
                <Col>
                    {config.search && (
                        <Input
                            className="data-list__search-input"
                            placeholder={t('admin.dataList.searchPlaceholder')}
                            value={searchKeyword}
                            onPressEnter={handleSearchEnter}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    )}
                </Col>
            </Row>

            <Table<T>
                className="data-list__table"
                columns={(config.onViewDetail || config.onUpdate || config.onDeleteSelected) ? [...config.columns, actionColumn] : config.columns }
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
                    {config.onDeleteSelected && (
                        <Popconfirm
                            title={t('admin.dataList.deleteConfirm')}
                            onConfirm={() => config.onDeleteSelected && config.onDeleteSelected(selectedIds)}  // Xóa nhiều mục khi chọn checkbox
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
                    )}
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
                                config.pagination.onPaginationChange(page, pageSize || config.pagination.pageSize, searchKeyword);
                            }
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default DataListTemplate;
