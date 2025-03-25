import React, { useState } from 'react';
import './CustomTransfer.scss';
import { Button, Modal, message, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { assignPermission, unassignPermission } from '../../services/roleSevice';
import { useTranslation } from 'react-i18next';

interface Permission {
    id: string;
    name: string;
    description: string;
}

interface CustomTransferProps {
    dataSource: Permission[];
    target: Permission[];
    onChange: (nextTarget: Permission[]) => void;
    roleId: string;
    statusRole: number;
}

const CustomTransfer: React.FC<CustomTransferProps> = ({ dataSource, target, onChange, roleId, statusRole }) => {
    const { t } = useTranslation();
    const [selectedSourceKeys, setSelectedSourceKeys] = useState<string[]>([]);
    const [selectedTargetKeys, setSelectedTargetKeys] = useState<string[]>([]);
    const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [action, setAction] = useState<'add' | 'remove'>('add');
    const [sourceSearch, setSourceSearch] = useState<string>('');
    const [targetSearch, setTargetSearch] = useState<string>('');

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

    const toggleSelectAllSource = () => {
        if (selectedSourceKeys.length === filteredSourceData.length) {
            setSelectedSourceKeys([]);
        } else {
            setSelectedSourceKeys(filteredSourceData.map(item => item.id));
        }
    };

    const toggleSelectAllTarget = () => {
        if (selectedTargetKeys.length === filteredTargetData.length) {
            setSelectedTargetKeys([]);
        } else {
            setSelectedTargetKeys(filteredTargetData.map(item => item.id));
        }
    };

    const showConfirm = (action: 'add' | 'remove') => {
        setAction(action);
        setIsConfirmVisible(true);
    };

    const confirmAction = async () => {
        setIsLoading(true);
        try {
            if (action === 'add') {
                await assignPermission(selectedSourceKeys, roleId);
                const newTarget = [...target, ...dataSource.filter(item => selectedSourceKeys.includes(item.id))];
                onChange(newTarget);
                setSelectedSourceKeys([]);
            } else {
                await unassignPermission(selectedTargetKeys, roleId);
                const newTarget = target.filter(item => !selectedTargetKeys.includes(item.id));
                onChange(newTarget);
                setSelectedTargetKeys([]);
            }
        } catch (error) {
            console.error("Error updating permissions:", error);
            message.error(t("admin.role.Update.permissions.errorMessage"));
        } finally {
            setIsConfirmVisible(false);
            setIsLoading(false);
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
                <div className="select-all">
                    <input
                        type="checkbox"
                        checked={selectedSourceKeys.length === filteredSourceData.length && filteredSourceData.length > 0}
                        onChange={toggleSelectAllSource}
                    />
                    <span>{t("admin.role.update.permissions.selectAll")}</span>
                </div>
                <ul>
                    {filteredSourceData
                        .filter(item => !target.some(t => t.id === item.id))
                        .map(item => (
                            <li key={item.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedSourceKeys.includes(item.id)}
                                    onChange={() => handleSourceCheckboxChange(item.id)}
                                />
                                <span className="permission-title">{item.name}</span>
                                <Tooltip title={item.description}>
                                    <InfoCircleOutlined className="info-icon"/>
                                </Tooltip>
                            </li>
                        ))}
                </ul>
            </div>

            <div className="transfer-buttons">
                <button
                    onClick={() => showConfirm('add')}
                    disabled={selectedSourceKeys.length === 0 || isLoading || statusRole === 0}
                >
                    &gt;
                </button>
                <button
                    onClick={() => showConfirm('remove')}
                    disabled={selectedTargetKeys.length === 0 || isLoading || statusRole === 0}
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
                <div className="select-all">
                    <input
                        type="checkbox"
                        checked={selectedTargetKeys.length === filteredTargetData.length && filteredTargetData.length > 0}
                        onChange={toggleSelectAllTarget}
                    />
                    <span>{t("admin.role.update.permissions.selectAll")}</span>
                </div>
                <ul>
                    {filteredTargetData.map(item => (
                        <li key={item.id}>
                            <input
                                type="checkbox"
                                checked={selectedTargetKeys.includes(item.id)}
                                onChange={() => handleTargetCheckboxChange(item.id)}
                            />
                            <span className="permission-title">{item.name}</span>
                            <Tooltip title={item.description}>
                                <InfoCircleOutlined className="info-icon"/>
                            </Tooltip>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal
                title={t("admin.role.update.permissions.confirmTransferMessage")}
                open={isConfirmVisible}
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
