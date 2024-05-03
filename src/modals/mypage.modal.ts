import { Filters, SelectOptions } from ".";

export interface MypageRowData {
    is_checked: boolean;
    id: string;
    name: string;
    mypageNumber: string;
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
    is_checked: boolean;
    id: string;
    name: string;
    mypageNumber: string;
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


export interface MypageHead {
    id: keyof HeaderId;
    label: string;
    filters: Filters[];
    sort: string;
    is_show: boolean;
}
