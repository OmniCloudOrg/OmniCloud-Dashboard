export interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: any;
}

export interface UserData {
  email: string;
  name?: string;
  displayName?: string;
  full_name?: string;
  display_name?: string;
  firstName?: string;
  lastName?: string;
}