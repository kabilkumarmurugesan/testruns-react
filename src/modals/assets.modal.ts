import { Filters } from ".";

export interface AssetsRowData {
  is_checked:boolean;
  id: string;
  name: string;
  assetNumber: string;
  status: number;
  availability: string;
  userId: string;
  departmentId: string;
  laboratoryId: string;
  isActive: number;
  expiryDate: string;
  extraData: string;
  createdAt: string;
  purchasedDate: string;
  updatedAt: string;
  deletedAt: string;
}

interface HeaderId {
  is_checked:boolean;
    id: string;
    name: string;
    assetNumber: string;
    status: number;
    availability: string;
    userId: string;
    departmentId: string;
    laboratoryId: string;
    isActive: number;
    expiryDate: string;
    extraData: string;
    createdAt: string;
    purchasedDate: string;
    updatedAt: string;
    deletedAt: string;
}


export interface AssetsHead {
  id: keyof HeaderId;
  label: string;
  filters: Filters[];
  sort: string;
  is_show: boolean;
  type: string;
}
