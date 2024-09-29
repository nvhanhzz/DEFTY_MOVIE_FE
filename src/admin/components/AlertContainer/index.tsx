import React, { useEffect } from 'react';
import { notification } from 'antd';
import { removeAlert } from '../../redux/actions/alert';
import { useAdminDispatch } from '../../hooks/useAdminDispatch';
import { useAdminSelector } from '../../hooks/useAdminSelector';

const AlertContainer: React.FC = () => {
    const dispatch = useAdminDispatch();
    const alerts = useAdminSelector((state) => state.alert.alerts);

    useEffect(() => {
        notification.destroy();

        alerts.forEach((alertsData: { message: string; description: string; duration: number; }, index: number) => {
            notification.open({
                message: alertsData.message,
                description: alertsData.description,
                duration: alertsData.duration,
                onClose: () => dispatch(removeAlert(index)),
            });
        });
    }, [alerts, dispatch]);

    return null;
};

export default AlertContainer;