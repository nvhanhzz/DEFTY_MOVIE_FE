import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { getArticles } from '../../services/articleService';

export interface Article {
    id: string,
    title: string,
    content: string,
    author: string,
    thumbnail: string,
    slug: string
}

const ArticlesPage: React.FC = () => {
    const [data, setData] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const fetchData = async (page: number, pageSize: number) => {
        setIsLoading(true);
        try {
            const response = await getArticles(page, pageSize);
            const result = await response.json();
            const articles: Article[] = result.data.articleResponses;
            setTotalItems(result.data.totalElements);
            setData(articles.map((item) => ({ ...item, key: item.id })));
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    // Cập nhật `currentPage` từ URL khi component được mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('pageSize') || '10', 10);
        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

    // Hàm thay đổi trang và cập nhật URL
    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
    };

    const dataListConfig: DataListConfig<Article> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
                sorter: (a: Article, b: Article) => Number(a.id) - Number(b.id),
            },
            {
                title: t('admin.article.titleColumn'),
                dataIndex: 'title',
                key: 'title',
                sorter: (a: Article, b: Article) => a.title.localeCompare(b.title),
            },
            {
                title: t('admin.article.thumbnail'),
                dataIndex: 'thumbnail',
                key: 'thumbnail',
                render: (thumbnail: string) => (
                    <img src={thumbnail} alt="thumbnail" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                ),
            },
            {
                title: t('admin.article.author'),
                dataIndex: 'author',
                key: 'author',
                sorter: (a: Article, b: Article) => a.author.localeCompare(b.author),
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: () => navigate('create'),
        onUpdate: (id) => navigate(`update/${id}`),
        onDelete: () => { },
        onDeleteSelected: () => { },
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/articles`, name: t('admin.article.title') }
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

export default ArticlesPage;