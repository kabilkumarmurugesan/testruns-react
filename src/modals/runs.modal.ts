import { Filters } from ".";

export interface RunsRowData {
  is_checked: boolean;
  id: string;
  objective: string;
  runNumber: string;
  availability: string;
  departmentId: string;
  laboratoryId: string;
  extraData: string;
  isActive: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

interface HeaderId {
  is_checked: boolean;
  id: string;
  objective: string;
  runNumber: string;
  availability: string;
  departmentId: string;
  laboratoryId: string;
  userId: string;
  extraDate: string;
  isActive: number;
  dueDate: string;
  createdAt: number;
  updatedAt: string;
  deletedAt: string;
}


export interface RunsHead {
  id: keyof HeaderId;
  label: string;
  filters: Filters[];
  sort: string;
  is_show: boolean;
  type: string;
}