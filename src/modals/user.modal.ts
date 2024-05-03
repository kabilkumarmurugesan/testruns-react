import { Filters } from ".";

export interface UserRowData {
  is_checked:boolean;
  id: string;
  firstName: string;
  lastName: string;
  status:string;
  password:string;
  token:string; 
  provider:string;
  providerDetails:string;
  extraData: string;
  organisationId:string;
  roleId:string
  isActive: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

interface HeaderId {
  is_checked:boolean;
  id: string;
  firstName: string;
  lastName: string;
  status:string;
  password:string;
  token:string; 
  provider:string;
  providerDetails:string;
  extraData: string;
  organisationId:string;
  roleId:string
  isActive: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface UserHead {
  id: keyof HeaderId;
  label: string;
  filters: Filters[];
  sort: string;
  is_show: boolean;
  type: string;
}
