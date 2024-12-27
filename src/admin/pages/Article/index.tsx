import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getArticles, deleteArticles } from '../../services/articleService';
import OutletTemplate from '../../templates/Outlet';
import DataListTemplate from '../../templates/DataList';
import type { DataListConfig } from '../../templates/DataList';
import { LoadingOutlined } from '@ant-design/icons';
import SearchFormTemplate from "../../templates/Search";

export interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    thumbnail: string;
    slug: string;
}

const ArticlesPage: React.FC = () => {
    const [data, setData] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const searchFields = [
        {
            type: 'input',
            label: t('admin.article.titleColumn'),
            name: 'title',
            placeholder: t('admin.article.titleColumn'),
        }
    ];

    const fetchData = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getArticles(page, pageSize, filters);
            const result = await response.json();
            const articles: Article[] = result.data.content;
            setTotalItems(result.data.totalElements);
            setData(articles.map(item => ({ ...item, key: item.id })));
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const pageSizeFromUrl = parseInt(searchParams.get('size') || '10', 10);
        const filtersFromUrl: Record<string, string> = {};

        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'size') {
                filtersFromUrl[key] = value;
            }
        });

        setCurrentPage(pageFromUrl);
        setPageSize(pageSizeFromUrl);
        setFilters(filtersFromUrl);
    }, [location.search]);

    useEffect(() => {
        fetchData(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters]);

    const handleSearch = (newFilters: Record<string, string>) => {
        setCurrentPage(1);
        setFilters(newFilters);

        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('size', pageSize.toString());

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        navigate(`?${queryParams.toString()}`);
    };

    const handleCreateNewArticle = () => {
        navigate('create');
    };

    const handleUpdate = (id: string) => {
        navigate(`update/${id}`);
    };

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteArticles(ids as string[]);
            if (response.ok) {
                setData(prevData => prevData.filter(item => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError'));
            }
        } catch (error) {
            message.error(t('admin.message.deleteError'));
        } finally {
            setIsLoading(false);
        }
    };

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);

        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', (pageSize || 10).toString());

        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        navigate(`?${queryParams.toString()}`);
    };

    const dataListConfig: DataListConfig<Article> = {
        columns: [
            {
                title: 'No.',
                key: 'no',
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t('admin.article.titleColumn'),
                dataIndex: 'title',
                key: 'title',
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
            },
        ],
        data: data,
        rowKey: 'id',
        onCreateNew: handleCreateNewArticle,
        onUpdate: handleUpdate,
        onDeleteSelected: handleDeleteSelected,
        pagination: {
            currentPage: currentPage,
            totalItems: totalItems,
            pageSize: pageSize,
            onPaginationChange: onPageChange,
        },
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/articles`, name: t('admin.article.title') },
            ]}
        >
            <SearchFormTemplate
                fields={searchFields}
                onSearch={handleSearch}
            />
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