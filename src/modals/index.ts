export interface Department {
  id: string;
  name: string;
  extraData: string;
  userId: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Laboratory {
  id: string;
  name: string;
  extraData: string;
  departmentId: string;
  userId: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  extraData: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface SelectOptions {
  value: string;
  label: string;
}

export interface Filters {
  id: string;
  type: string;
  label: string;
  options: SelectOptions[];
}

export interface CustomRowData {
  is_checked:boolean;
  id: string;
  name: string;
  type: string;
  group: string;
  status: string;
  added_on: string;
}

interface CustomHeaderId {
  is_checked:boolean;
  id: string;
  name: string,
  type: string,
  group: string,
  status: string,
  added_on: string
}

export interface CustomHead {
  id: keyof CustomHeaderId;
  label: string;
  filters: Filters[];
  sort: string;
  is_show: boolean;
}
