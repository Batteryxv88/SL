import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AccessDenied } from './AccessDenied';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если данные о пользователе не загружены или его роль не входит в список разрешенных
  if (!userData || !allowedRoles.includes(userData.role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}; 