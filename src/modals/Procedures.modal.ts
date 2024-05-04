import { Filters } from '.';

export interface ProceduresRowData {
  is_checked: boolean;
  _id: string;
  isDeleted?: boolean;
  name: string;
  procedureNumber: string;
  procedureDetials: string;
  departmentId: [string];
  laboratoryId: [string];
  organisationId?: string | any;
  assestId: string;
  userId: string;
  extraData: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
  createdOn?: string;
  updatedAt: string;
  deletedAt: string;
}

interface HeaderId {
  is_checked: boolean;
  id: string;
  name: string;
  procedureNumber: string;
  procedureDetials: string;
  departmentId: string;
  laboratoryId: string;
  assestId: string;
  userId: string;
  extraData: string;
  perchasedDate: string;
  isActive: number;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
  createdOn: string;
  deletedAt: string;
}

export interface ProceduresHead {
  id: keyof HeaderId;
  label: string;
  filters: Filters[];
  sort: string;
  is_show: boolean;
  type: string;
}
