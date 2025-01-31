export interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  resetSearch: () => void;
}