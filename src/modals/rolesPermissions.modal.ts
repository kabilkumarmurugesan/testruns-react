import { Filters, SelectOptions } from ".";

export interface RolesPermissionsRowData {
  id: string;
  userId: string;
  adminPermissions:string;
  requesterPermissions:string;
  testerPermissions:string;
  extraData: string;
}

interface HeaderId {
  id: string;
  userId: string;
  adminPermissions:string;
  requesterPermissions:string;
  testerPermissions:string;
  extraData: string;
}


export interface RolesPermissionsHead {
  id: keyof HeaderId;
  label: string;
  filters: Filters[];
  sort: string;
  is_show: boolean;
}
