import { useNavigate, useParams } from "react-router-dom";
import {Checkbox, Image, message, Modal, Spin, Table, Tag} from "antd";
import DataListTemplate, { DataListConfig } from "../../../templates/DataList";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchFormTemplate from "../../../templates/Search";
import { LoadingOutlined } from "@ant-design/icons";
import OutletTemplate from "../../../templates/Outlet";
import {
    addMovieInCategory,
    deleteMovieOfCategory,
    getMoviesInCategory,
    getMoviesNotInCategory
} from "../../../services/categoryService.tsx";
import {Movie} from "../../Movie";
import {Role} from "../../Role";
import {getDirectors} from "../../../services/directorService.tsx";
import {Director} from "../../Director";

const MoviesOfCategory = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [directories, setDirectories] = useState<Director[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [data, setData] = useState<Movie[]>([]);
    const [dataNotIn, setDataNotIn] = useState<Movie[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovies, setSelectedMovies] = useState<Set<string>>(new Set());

    const categoryIdNumber = id && !isNaN(Number(id)) ? Number(id) : null;

    const fetchMoviesInCategory = async () => {
        setIsLoading(true);
        try {
            const response = await getMoviesInCategory(categoryIdNumber, currentPage, pageSize, filters);
            const result = await response.json();
            const content: Role[] = result.data.content;
            const movies = content.map((item: any) => ({ ...item, key: item.id }));
            setData(movies);
            setTotalItems(result.total || 0);
        } catch (error) {
            console.error("Error fetching movies in category:", error);
            setData([]);
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
        // console.log(initialSearchValues);
    }, [location.search]);

    useEffect(() => {
        if (categoryIdNumber === null) {
            console.error("Invalid categoryId:", id);
            return;
        }
        fetchMoviesInCategory()
    }, [categoryIdNumber, currentPage, pageSize, filters]);

    useEffect(() => {
        fetchDirectories(1, 999999999, {});
    }, []);

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
    const fetchDirectories = async (page: number, pageSize: number, filters: Record<string, string>) => {
        setIsLoading(true);
        try {
            const response = await getDirectors(page, pageSize, filters);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                setTotalItems(0);
                setDirectories([]);
                return;
            }
            const content: Director[] = result.data.content;
            const directors = content.map((item: Director) => ({
                ...item,
                key: item.id,
            }));
            // console.log(content)
            setTotalItems(result.data.totalElements);
            setDirectories(directors);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMoviesNotInCategory = async () => {
        setIsLoading(true);
        try {
            const response = await getMoviesNotInCategory(categoryIdNumber, currentPage, pageSize);
            const result = await response.json();
            const content: Movie[] = result.data.content;
            // console.log(content);

            const movies = content.map((item: any) =>
                ({ ...item, key: item.id })
            );
            setDataNotIn(movies);
        } catch (error) {
            console.error("Error fetching movies NOT in category:", error);
            setDataNotIn([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (categoryIdNumber === null) {
            console.error("Invalid categoryId:", id);
            return;
        }
        fetchMoviesNotInCategory();
    }, [categoryIdNumber]);

    const handleSelectMovie = async (movieId: string, checked: boolean) => {
        setSelectedMovies((prev) => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(movieId);
            } else {
                newSet.delete(movieId);
            }
            return newSet;
        });
    };

    const handleOk = async () => {
        try {
            const response = await addMovieInCategory(categoryIdNumber, Array.from(selectedMovies));
            if (!response.ok) {
                message.error(t('admin.message.updateError'));
            }
            message.success(t('admin.message.updateSuccess'));
            setIsModalOpen(false);
            setSelectedMovies(new Set());
            fetchMoviesInCategory();
            fetchMoviesNotInCategory();
        } catch (error) {
            message.error(t('admin.message.updateError'));
            console.error(error);
        }
    };

    const columns = [
        {
            title: "Tên Phim",
            dataIndex: "title",
            key: "title",
            align: "center",
        },
        {
            title: "Chọn",
            key: "action",
            align: "center",
            render: (record: { id: string }) => (
                <Checkbox
                    checked={selectedMovies.has(record.id)}
                    onChange={(e) => handleSelectMovie(record.id, e.target.checked)}
                />
            ),
        },
    ];

    const handleCancel = () => setIsModalOpen(false);

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        setPageSize(pageSize || 10);
        navigate(`?page=${page}&pageSize=${pageSize || 10}`);
    };

    const handleCreateNewMovie = () => setIsModalOpen(true);

    const handleDeleteSelected = async (ids: React.Key[]) => {
        setIsLoading(true);
        try {
            const response = await deleteMovieOfCategory(categoryIdNumber, ids as string[]);
            if (response.ok) {
                setData((prevData) => prevData.filter((item) => !ids.includes(item.id)));
                message.success(t('admin.message.deleteSuccess'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.deleteError'));
            }
            fetchMoviesNotInCategory();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.deleteError'));
        } finally {
            setIsLoading(false);
        }
    };

    const searchFields = [
        {
            type: 'input',
            label: t('admin.movie.title'),
            name: 'title',
            placeholder: t('admin.movie.title'),
        },
        {
            type: 'input',
            label: t('admin.movie.nation'),
            name: 'nation',
            placeholder: t('admin.movie.nation'),
        },
        {
            type: 'select',
            label: t('admin.movie.director'),
            name: 'director',
            placeholder: t('admin.movie.director'),
            options: directories.map(director => ({
                label: director.fullName,
                value: director.id,
            })),
        },
        {
            type: 'input',
            label: t('admin.movie.ranking'),
            name: 'ranking',
            placeholder: t('admin.movie.ranking'),
        },
        {
            type: 'dateRange',
            label: t('admin.movie.releaseDate'),
            name: 'releaseDate',
            placeholder: t('admin.movie.releaseDate'),
        },
    ];

    const dataListConfig: DataListConfig<any> = {
        columns: [
            {
                title: "No.",
                key: "no",
                align: "center",
                render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
            },
            {
                title: t("admin.movie.titleColumn"),
                dataIndex: "title",
                key: "title",
                align: "center",
            },
            {
                title: t("admin.movie.thumbnail"),
                dataIndex: "thumbnail",
                key: "thumbnail",
                align: "center",
                render: (thumbnail: string) => (
                    <Image style={{ borderRadius: "5px" }} src={thumbnail} width={120} />
                ),
            },
            {
                title: t("admin.movie.nation"),
                dataIndex: "nation",
                key: "nation",
                align: "center",
            },
            {
                title: t("admin.movie.ranking"),
                dataIndex: "ranking",
                key: "ranking",
                align: "center",
            },
            {
                title: t("admin.movie.director"),
                dataIndex: "director",
                key: "director",
                align: "center",
            },
            {
                title: t('admin.movie.membershipType'),
                dataIndex: 'membershipType',
                key: 'membershipType',
                align: 'center',
                sorter: (a: Movie, b: Movie) => a.membershipType - b.membershipType,
                render: (membershipType) => {
                    return (
                        <Tag color={membershipType === 1 ? 'green' : 'orange'}>
                            {membershipType === 1 ? 'VIP' : 'Normal'}
                        </Tag>
                    );
                },
            },
        ],
        data,
        rowKey: "id",
        onCreateNew: handleCreateNewMovie,
        onDeleteSelected: handleDeleteSelected,
        pagination: {
            currentPage,
            totalItems,
            pageSize,
            onPaginationChange: onPageChange,
        },
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}`, name: t("admin.dashboard.title") },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/categories`, name: t("admin.category.title") },
                { path: ``, name: t("admin.category.moviesOfCategory") },
            ]}
        >
            <SearchFormTemplate fields={searchFields}
                                onSearch={handleSearch}
                                initialValues={initialValues} />
            {isLoading ? (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "75vh" }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <DataListTemplate config={dataListConfig} />
            )}
            <Modal title="Danh Sách Phim" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Table
                    columns={columns}
                    dataSource={dataNotIn}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total: totalItems,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '15', '20'],
                        onChange: onPageChange,
                    }}
                    rowKey="id" />
            </Modal>
        </OutletTemplate>
    );
};

export default MoviesOfCategory;