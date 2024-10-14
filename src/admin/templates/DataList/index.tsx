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
    onPaginationChange?: (page: number, pageSize: number) => void;
}

const DataListTemplate = <T extends { id: string }>({
    config,
}: { config: DataListConfig<T> }): JSX.Element => {
    const [searchText, setSearchText] = useState('');
    const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
    const { t } = useTranslation();

    const handleTableChange = (
        _pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        _sorter: SorterResult<T> | SorterResult<T>[],
        _extra: TableCurrentDataSource<T>
    ) => {
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
                    okText={t('admin.dataList.assignPermissionConfirm')}
                    cancelText={t('admin.dataList.assignPermissionCancel')}
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
                    <Input
                        className="data-list__search-input"
                        placeholder={t('admin.dataList.searchPlaceholder')}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        prefix={<SearchOutlined />}
                    />
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
                        okText={t('admin.dataList.assignPermissionConfirm')}
                        cancelText={t('admin.dataList.assignPermissionCancel')}
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
                        className="data-list__pagination"
                        defaultCurrent={1}
                        total={config.data.length}
                        showSizeChanger
                        onChange={config.onPaginationChange}
                    />
                </Col>
            </Row>
        </>
    );
};

export default DataListTemplate;