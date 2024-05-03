import { Filters, SelectOptions } from ".";

export interface HistoryRowData {
  is_checked:boolean;
  id: string;
  objective: string;
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
    objective: string;
    runNumber: string;
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
    perchasedDate: string;
    deletedAt: string;
}


export interface HistoryHead {
  id: keyof HeaderId;
  label: string;
  filters: Filters[];
  sort: string;
  is_show: boolean;
}
