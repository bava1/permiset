export interface UserItemProps {
    userItem: any;
    hasPermission: (permission: string) => boolean;
    openEditModal: (user: any) => void;
    openDeleteDialog: (user: any) => void;
    user: any;
    getChipColor: (role: string) => string;
  }