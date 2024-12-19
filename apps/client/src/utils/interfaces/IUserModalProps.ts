export interface UserModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (userData: {
      id?: string;
      name: string;
      email: string;
      role: string;
      status: string;
      password?: string;
    }) => Promise<void>;
    initialData?: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
    };
    mode: "add" | "edit";
  }