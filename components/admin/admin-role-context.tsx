'use client';

import * as React from 'react';
import { UserRole } from '@/types/user';
import { RoleDefinition, ROLE_DEFINITIONS } from '@/lib/permissions/rbac';

interface AdminRoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  roleConfig: RoleDefinition;
}

const AdminRoleContext = React.createContext<AdminRoleContextType | undefined>(undefined);

export function AdminRoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = React.useState<UserRole>(UserRole.SUPER_ADMIN);

  const roleConfig = ROLE_DEFINITIONS[currentRole];

  return (
    <AdminRoleContext.Provider
      value={{
        currentRole,
        setRole: setCurrentRole,
        roleConfig,
      }}
    >
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  const context = React.useContext(AdminRoleContext);
  if (!context) {
    throw new Error('useAdminRole must be used within an AdminRoleProvider');
  }
  return context;
}
