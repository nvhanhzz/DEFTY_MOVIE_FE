import React, { useState } from 'react';
import './CustomTransfer.scss';
import { Button, Modal, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons'; // Import biểu tượng từ Ant Design
import { assignPermission, unassignPermission } from '../../services/roleSevice';
import { useTranslation } from 'react-i18next'; // Import hook useTranslation

interface Permission {
    id: string; // Khóa duy nhất cho quyền
    name: string; // Tên hiển thị của quyền
    description: string; // Mô tả quyền
}

interface CustomTransferProps {
    dataSource: Permission[];
    target: Permission[]; // Cập nhật kiểu target là Permission[]
    onChange: (nextTarget: Permission[]) => void; // Callback để cập nhật quyền đã chọn
    roleId: string; // ID của vai trò
}

const CustomTransfer: React.FC<CustomTransferProps> = ({ dataSource, target, onChange, roleId }) => {
    const { t } = useTranslation(); // Sử dụng hook để lấy hàm dịch
    const [selectedSourceKeys, setSelectedSourceKeys] = useState<string[]>([]);
    const [selectedTargetKeys, setSelectedTargetKeys] = useState<string[]>([]);
    const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading
    const [action, setAction] = useState<'add' | 'remove'>('add'); // 'add' or 'remove'
    const [sourceSearch, setSourceSearch] = useState<string>(''); // Tìm kiếm cho bảng nguồn
    const [targetSearch, setTargetSearch] = useState<string>(''); // Tìm kiếm cho bảng đích

    const handleSourceCheckboxChange = (key: string) => {
        setSelectedSourceKeys(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const handleTargetCheckboxChange = (key: string) => {
        setSelectedTargetKeys(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const showConfirm = (action: 'add' | 'remove') => {
        setAction(action);
        setIsConfirmVisible(true);
    };

    const confirmAction = async () => {
        setIsLoading(true); // Bắt đầu loading
        try {
            if (action === 'add') {
                const idsToAdd = selectedSourceKeys; // IDs của quyền được chọn để thêm
                await assignPermission(idsToAdd, roleId); // Gọi hàm phân quyền
                const newTarget = [
                    ...target,
                    ...dataSource.filter(item => selectedSourceKeys.includes(item.id)),
                ];
                onChange(newTarget); // Cập nhật target mới
                setSelectedSourceKeys([]); // Reset selected keys after moving
            } else if (action === 'remove') {
                const idsToRemove = selectedTargetKeys; // IDs của quyền được chọn để xóa
                await unassignPermission(idsToRemove, roleId); // Gọi hàm xóa quyền
                const newTarget = target.filter(item => !selectedTargetKeys.includes(item.id));
                onChange(newTarget); // Cập nhật target mới
                setSelectedTargetKeys([]); // Reset selected keys after moving
            }
        } catch (error) {
            console.error("Error updating permissions:", error);
            message.error(t("admin.role.update.permissions.errorMessage")); // Hiển thị thông báo lỗi
        } finally {
            setIsConfirmVisible(false);
            setIsLoading(false); // Kết thúc loading
        }
    };

    const cancelAction = () => {
        setIsConfirmVisible(false);
    };

    const filteredSourceData = dataSource.filter(item =>
        item.name.toLowerCase().includes(sourceSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(sourceSearch.toLowerCase())
    );

    const filteredTargetData = target.filter(item =>
        item.name.toLowerCase().includes(targetSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(targetSearch.toLowerCase())
    );

    return (
        <div className="custom-transfer">
            <div className="transfer-list">
                <h3>{t("admin.role.update.permissions.permissionAvailable")}</h3>
                <input
                    className='search-input'
                    type="text"
                    placeholder={t("admin.role.update.permissions.searchPlaceholder")}
                    value={sourceSearch}
                    onChange={e => setSourceSearch(e.target.value)}
                />
                <ul>
                    {filteredSourceData
                        .filter(item => !target.some(t => t.id === item.id)) // Kiểm tra quyền đã có trong target chưa
                        .map(item => (
                            <li key={item.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedSourceKeys.includes(item.id)}
                                    onChange={() => handleSourceCheckboxChange(item.id)}
                                />
                                <span className="permission-title">{item.name}</span>
                                {/* Xóa tooltip cho icon */}
                                <InfoCircleOutlined className="info-icon" />
                            </li>
                        ))}

                </ul>
            </div>

            <div className="transfer-buttons">
                <button
                    onClick={() => showConfirm('add')}
                    disabled={selectedSourceKeys.length === 0 || isLoading} // Disable if no checkbox is selected or loading
                >
                    &gt;
                </button>
                <button
                    onClick={() => showConfirm('remove')}
                    disabled={selectedTargetKeys.length === 0 || isLoading} // Disable if no checkbox is selected or loading
                >
                    &lt;
                </button>
            </div>

            <div className="transfer-list">
                <h3>{t("admin.role.update.permissions.rolePermission")}</h3>
                <input
                    className='search-input'
                    type="text"
                    placeholder={t("admin.role.update.permissions.searchPlaceholder")}
                    value={targetSearch}
                    onChange={e => setTargetSearch(e.target.value)}
                />
                <ul>
                    {filteredTargetData.map(item => (
                        <li key={item.id}>
                            <input
                                type="checkbox"
                                checked={selectedTargetKeys.includes(item.id)}
                                onChange={() => handleTargetCheckboxChange(item.id)}
                            />
                            <span className="permission-title">{item.name}</span>
                            {/* Xóa tooltip cho icon */}
                            <InfoCircleOutlined className="info-icon" />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal Confirm */}
            <Modal
                title={action === 'add' ? t("admin.role.update.permissions.confirmTransferMessage") : t("admin.role.update.permissions.confirmTransferMessage")}
                visible={isConfirmVisible}
                onOk={confirmAction}
                onCancel={cancelAction}
                footer={[
                    <Button key="back" onClick={cancelAction}>
                        {t("admin.role.update.permissions.assignPermissionCancel")}
                    </Button>,
                    <Button key="submit" type="primary" loading={isLoading} onClick={confirmAction}>
                        {t("admin.role.update.permissions.assignPermissionConfirm")}
                    </Button>,
                ]}
            >
                <p>{t("admin.role.update.permissions.confirmTransferMessage")}</p>
            </Modal>
        </div>
    );
};

export default CustomTransfer;