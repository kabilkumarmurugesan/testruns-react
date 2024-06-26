// Assets list

import { CustomHead, Department, Laboratory, Organization } from '../modals';
import { HistoryHead } from '../modals/history.modal';
import { AssetsHead } from '../modals/assets.modal';
import { UserHead } from '../modals/user.modal';
import { RunsHead } from '../modals/runs.modal';
import { ProceduresHead } from '../modals/Procedures.modal';

export const StatusList = [
  { id: 1, name: 'Active', value: 'Active' },
  { id: 2, name: 'In-Active', value: 'Inactive' },
];

export const AvailabilityList = [
  { id: 1, name: 'Available', value: 'Available' },
  { id: 2, name: 'In Use', value: 'In_Use' },
  { id: 3, name: 'Not Available', value: 'Not_Available' },
];

export const RunsStatusList = [
  { id: 1, name: 'Created', value: 'Created' },
  { id: 2, name: 'Started', value: 'Started' },
  { id: 3, name: 'Stopped', value: 'Stopped' },
  { id: 4, name: 'Submitted', value: 'Submitted' },
  { id: 3, name: 'Completed', value: 'Completed' },
];

export const RoleList = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Resolver' },
  { id: 3, name: 'Tester' },
];

export const InstitutionList = [
  { id: 1, name: 'Academy 1' },
  { id: 2, name: 'Academy 2' },
  { id: 3, name: 'Academy 3' },
];

export const AssetsHeaders: any = [
  {
    id: 'assetNumber',
    label: 'Assets ID',
    filters: [
      {
        id: 'assetNumber',
        type: 'autocomplete',
        label: 'Assest ID',
        options: [
          { value: 'ID1001', label: 'ID1001' },
          { value: 'ID1002', label: 'ID1002' },
          { value: 'ID1003', label: 'ID1003' },
          { value: 'ID1004', label: 'ID1004' },
          { value: 'ID1005', label: 'ID1005' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'autocomplete',
  },
  {
    id: 'name',
    label: 'Assets name',
    filters: [
      {
        id: 'search',
        type: 'textfield',
        label: 'Search',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'text',
  },
  {
    id: 'departmentId',
    label: 'Department',
    filters: [
      {
        id: 'dept',
        type: 'autocomplete',
        label: 'Department',
        options: [
          { value: 'Computer science', label: 'Computer science' },
          { value: 'Cyber security', label: 'Cyber security' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  {
    id: 'laboratoryId',
    label: 'Lab',
    filters: [
      {
        id: 'lab',
        type: 'autocomplete',
        label: 'Lab',
        options: [
          { value: 'Data mining', label: 'Data mining' },
          { value: 'Data warehouse', label: 'Data warehouse' },
          { value: 'OOPS', label: 'OOPS' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  {
    id: 'perchasedDate',
    label: 'Purchased on',
    filters: [
      {
        id: 'date',
        type: 'date',
        label: 'DD/MM/YYYY',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'date',
  },
  {
    id: 'lastUsedDate',
    label: 'Last used',
    filters: [
      {
        id: 'date',
        type: 'date',
        label: 'DD/MM/YYYY',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'date',
  },
  {
    id: 'status',
    label: 'Status',
    filters: [
      {
        id: 'status',
        type: 'autocomplete',
        label: '-Select status-',
        options: [
          { value: '1', label: 'Fully Working' },
          { value: '2', label: 'Not Working' },
          { value: '3', label: 'Issue' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  {
    id: 'availability',
    label: 'Availability',
    filters: [
      {
        id: 'availability',
        type: 'autocomplete',
        label: '-Select availablity-',
        options: [
          { value: '1', label: 'Available' },
          { value: '2', label: 'Not available' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
];
export const AssetsRows = [
  {
    is_checked: false,
    id: '1',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '2',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '3',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '4',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '5',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
];

export const UserHeaders: any = [
  // {
  //   id: 'id',
  //   label: 'User ID',
  //   filters: [
  //     {
  //       id: 'user_id',
  //       type: 'autocomplete',
  //       label: 'User ID',
  //       options: [
  //         { value: 'ID1001', label: 'ID1001' },
  //         { value: 'ID1002', label: 'ID1002' },
  //         { value: 'ID1003', label: 'ID1003' },
  //       ],
  //     },
  //   ],
  //   sort: 'asc',
  //   is_show: true,
  //   type: 'select',
  // },
  {
    id: 'fullName',
    label: 'User Name',
    filters: [
      {
        id: 'search',
        type: 'textfield',
        label: 'Search',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'text',
  },
  {
    id: 'email',
    label: 'Email',
    filters: [
      {
        id: 'search',
        type: 'textfield',
        label: 'Search',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'text',
  },
  {
    id: 'organisationId',
    label: 'Organisation',
    filters: [
      {
        id: 'dept',
        type: 'autocomplete',
        label: 'Department',
        options: [
          { value: 'Computer science', label: 'Computer science' },
          { value: 'Cyber security', label: 'Cyber security' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  // {
  //   id: 'extraData',
  //   label: 'Category',
  //   filters: [
  //     {
  //       id: 'category',
  //       type: 'autocomplete',
  //       label: 'Category',
  //       options: [
  //         { value: 'Data mining', label: 'Data mining' },
  //         { value: 'Data warehouse', label: 'Data warehouse' },
  //         { value: 'OOPS', label: 'OOPS' },
  //       ],
  //     },
  //   ],
  //   sort: 'asc',
  //   is_show: true,
  //   type: 'select',
  // },
  {
    id: 'createdOn',
    label: 'Added on',
    filters: [
      {
        id: 'date',
        type: 'date',
        label: 'DD/MM/YYYY',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'date',
  },
  {
    id: 'role',
    label: 'Role',
    filters: [
      {
        id: 'search',
        type: 'textfield',
        label: 'Search',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  {
    id: 'status',
    label: 'Status',
    filters: [
      {
        id: 'availability',
        type: 'autocomplete',
        label: '-Select Status-',
        options: [
          { value: '1', label: 'Active' },
          { value: '2', label: 'In-Active' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
];
export const UserRows = [
  {
    is_checked: false,
    id: 'ID1001',
    firstName: 'Ammeter',
    lastName: '',
    status: '1',
    password: '',
    token: '',
    provider: '',
    providerDetails: 'Computer Science',
    extraData: 'Data mining',
    organisationId: '02/10/2023',
    roleId: 'Requester',
    isActive: 2,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  },
  {
    is_checked: false,
    id: 'ID1002',
    firstName: 'voltmeter',
    lastName: '',
    status: '1',
    password: '',
    token: '',
    provider: '',
    providerDetails: 'Cyber security',
    extraData: 'Data mining',
    organisationId: '02/10/2023',
    roleId: 'Requester',
    isActive: 2,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  },
  {
    is_checked: false,
    id: 'ID1003',
    firstName: 'Ammeter',
    lastName: '',
    status: '1',
    password: '',
    token: '',
    provider: '',
    providerDetails: 'Computer Science',
    extraData: 'Data Warehouse',
    organisationId: '02/10/2023',
    roleId: 'Requester',
    isActive: 2,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  },
  {
    is_checked: false,
    id: 'ID1004',
    firstName: 'voltmeter',
    lastName: '',
    status: '1',
    password: '',
    token: '',
    provider: '',
    providerDetails: 'Cyber security',
    extraData: 'OOPS',
    organisationId: '02/10/2023',
    roleId: 'Requester',
    isActive: 2,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  },
  {
    is_checked: false,
    id: 'ID1005',
    firstName: 'Ammeter',
    lastName: '',
    status: '1',
    password: '',
    token: '',
    provider: '',
    providerDetails: 'Computer Science',
    extraData: 'Data Warehouse',
    organisationId: '02/10/2023',
    roleId: 'Requester',
    isActive: 2,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  },
];
export const CustomHeaders: readonly CustomHead[] = [
  {
    id: 'id',
    label: 'Field ID',
    filters: [
      {
        id: 'id',
        type: 'autocomplete',
        label: 'Field Id',
        options: [
          { value: 'CF1001', label: 'CF1001' },
          { value: 'CF1002', label: 'CF1002' },
          { value: 'CF1003', label: 'CF1003' },
        ],
      },
    ],
    sort: 'asc',
    is_show: true,
  },
  {
    id: 'name',
    label: 'Field Name',
    filters: [
      {
        id: 'search',
        type: 'textfield',
        label: 'Search',
        options: [],
      },
    ],
    sort: 'asc',
    is_show: true,
  },
  {
    id: 'type',
    label: 'Field Type',
    filters: [
      {
        id: 'availability',
        type: 'autocomplete',
        label: '-Select Type-',
        options: [
          { value: '1', label: 'Text' },
          { value: '2', label: 'Numberic' },
          { value: '3', label: 'Select' },
        ],
      },
    ],
    sort: 'asc',
    is_show: true,
  },
  {
    id: 'group',
    label: 'Field Group',
    filters: [
      {
        id: 'availability',
        type: 'autocomplete',
        label: '-Select Group-',
        options: [
          { value: '1', label: 'Department' },
          { value: '2', label: 'Lab' },
          { value: '3', label: 'Status' },
          { value: '4', label: 'Organization' },
        ],
      },
    ],
    sort: 'asc',
    is_show: true,
  },
  {
    id: 'status',
    label: 'Status',
    filters: [
      {
        id: 'availability',
        type: 'autocomplete',
        label: '-Select Status-',
        options: [
          { value: '1', label: 'Active' },
          { value: '2', label: 'In-Active' },
        ],
      },
    ],
    sort: 'asc',
    is_show: true,
  },
  {
    id: 'added_on',
    label: 'Added on',
    filters: [
      {
        id: 'date',
        type: 'date',
        label: 'DD/MM/YYYY',
        options: [],
      },
    ],
    sort: 'asc',
    is_show: true,
  },
];

export const ProceduresHeaders: readonly ProceduresHead[] = [
  {
    id: 'procedureNumber',
    label: 'Procedure ID',
    filters: [
      {
        id: 'assetNumber',
        type: 'autocomplete',
        label: 'Procedure ID  ',
        options: [
          { value: 'PRO1001', label: 'PRO1001' },
          { value: 'PRO1002', label: 'PRO1002' },
          { value: 'PRO1003', label: 'PRO1003' },
          { value: 'PRO1004', label: 'PRO1004' },
          { value: 'PRO1005', label: 'PRO1005' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'autocomplete',
  },
  {
    id: 'name',
    label: 'Procedure name',
    filters: [
      {
        id: 'search',
        type: 'autocomplete',
        label: 'Procedure name',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'autocomplete',
  },
  {
    id: 'departmentId',
    label: 'Department',
    filters: [
      {
        id: 'dept',
        type: 'autocomplete',
        label: 'Department',
        options: [
          { value: 'Computer science', label: 'Computer science' },
          { value: 'Cyber security', label: 'Cyber security' },
          { value: 'Data Mining', label: 'Data Mining' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  {
    id: 'laboratoryId',
    label: 'Lab',
    filters: [
      {
        id: 'lab',
        type: 'autocomplete',
        label: 'Lab',
        options: [
          { value: 'Data mining', label: 'Data mining' },
          { value: 'Data warehouse', label: 'Data warehouse' },
          { value: 'OOPS', label: 'OOPS' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  {
    id: 'createdOn',
    label: 'Created on',
    filters: [
      {
        id: 'date',
        type: 'date',
        label: 'DD/MM/YYYY',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'date',
  },
  {
    id: 'createdByName',
    label: 'Created by',
    filters: [
      {
        id: 'search',
        type: 'textfield',
        label: 'Search',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'text',
  },

  // {
  //   id: 'createdAt',
  //   label: 'Created by',
  //   filters: [
  //     {
  //       id: 'availability',
  //       type: 'autocomplete',
  //       label: '-Select User-',
  //       options: [
  //         { value: '1', label: 'username' },
  //         // { value: '2', label: 'Not available' },
  //       ],
  //     },
  //   ],
  //   sort: 'asc',
  //   is_show: true,
  //   type: 'select',
  // },
];

export const OrganizationList: Organization[] = [
  {
    id: 'ORG-1001',
    name: 'Twilight IT Solutions',
    extraData: '',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
  {
    id: 'ORG-1002',
    name: 'Twilight Softwares',
    extraData: '',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
];

export const DepartmentList: Department[] = [
  {
    id: 'DEPT-1001',
    name: 'Computer Science',
    extraData: '',
    userId: '101',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
  {
    id: 'DEPT-1002',
    name: 'Cyber Security',
    extraData: '',
    userId: '101',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
  {
    id: 'DEPT-1003',
    name: 'Data Mining',
    extraData: '',
    userId: '102',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
];

export const LaboratoryList: readonly Laboratory[] = [
  {
    id: 'LAB-1001',
    name: 'Data Structure',
    departmentId: 'DEPT-10001',
    extraData: '',
    userId: '101',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
  {
    id: 'LAB-1002',
    name: 'Data Structure',
    departmentId: 'DEPT-10001',
    extraData: '',
    userId: '101',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
  {
    id: 'LAB-1003',
    name: 'Data Structure',
    departmentId: 'DEPT-10001',
    extraData: '',
    userId: '101',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
  {
    id: 'LAB-1004',
    name: 'Data Warehouse',
    departmentId: 'DEPT-10001',
    extraData: '',
    userId: '101',
    isActive: 1,
    createdAt: '04/05/2023',
    updatedAt: '04/05/2023',
    deletedAt: '04/05/2023',
  },
];

export const RunsHeaders: any = [
  {
    id: 'runNumber',
    label: 'Runs ID',
    filters: [
      {
        id: 'runNumber',
        type: 'autocomplete',
        label: 'Runs ID',
        options: [
          { value: 'RUNS1001', label: 'RUNS-1001' },
          { value: 'RUNS1002', label: 'RUNS-1002' },
          { value: 'RUNS1003', label: 'RUNS-1003' },
          { value: 'RUNS1004', label: 'RUNS-1004' },
          { value: 'RUNS1005', label: 'RUNS-1005' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'autocomplete',
  },
  {
    id: 'procedureName',
    label: 'Procedure name',
    filters: [
      {
        id: 'search',
        type: 'autocomplete',
        label: 'Procedure name',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'autocomplete',
  },
  {
    id: 'departmentId',
    label: 'Department',
    filters: [
      {
        id: 'dept',
        type: 'autocomplete',
        label: 'Department',
        options: [
          { value: 'Computer science', label: 'Computer science' },
          { value: 'Cyber security', label: 'Cyber security' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  {
    id: 'laboratoryId',
    label: 'Lab',
    filters: [
      {
        id: 'lab',
        type: 'autocomplete',
        label: 'Lab',
        options: [
          { value: 'Data mining', label: 'Data mining' },
          { value: 'Data warehouse', label: 'Data warehouse' },
          { value: 'OOPS', label: 'OOPS' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },

  {
    id: 'createdOn',
    label: 'Created on',
    filters: [
      {
        id: 'date',
        type: 'date',
        label: 'DD/MM/YYYY',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'date',
  },
  {
    id: 'dueDate',
    label: 'Due date',
    filters: [
      {
        id: 'date',
        type: 'date',
        label: 'DD/MM/YYYY',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'date',
  },
  {
    id: 'status',
    label: 'Status',
    filters: [
      {
        id: 'status',
        type: 'autocomplete',
        label: '-Select status-',
        options: [
          { id: 1, name: 'Created', value: 'Created' },
          { id: 2, name: 'Started', value: 'Started' },
          { id: 3, name: 'Stopped', value: 'Stopped' },
          { id: 3, name: 'Completed', value: 'Completed' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'select',
  },
  {
    id: 'assignedByName',
    label: 'Assigned by',
    filters: [
      {
        id: 'search',
        type: 'autocomplete',
        label: 'Search',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
    type: 'autocomplete',
  },
  // {
  //   id: 'extraDate',
  //   label: 'Assigned by',
  //   filters: [
  //     {
  //       id: 'status',
  //       type: 'autocomplete',
  //       label: '-Select Assignee-',
  //       options: [
  //         { value: 'User 1', label: 'User 1' },
  //         { value: 'User 2', label: 'User 2' },
  //         { value: 'User 3', label: 'User 3' },
  //       ],
  //     },
  //   ],
  //   sort: 'asc',
  //   is_show: true,
  //   type: 'select',
  // },
];
export const RunsRows = [
  {
    is_checked: false,
    id: '1',
    objective: 'Stored Procedure',
    runNumber: 'RUNS-1001',
    availability: 'AVAILABLE',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1002',
    extraData: '',
    isActive: 1,
    dueDate: '02/10/2023',
    createdAt: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '2',
    objective: 'Data Collection',
    runNumber: 'RUNS-1002',
    availability: 'AVAILABLE',
    departmentId: 'DEPT-1002',
    laboratoryId: 'LAB-1001',
    extraData: '',
    isActive: 1,
    dueDate: '02/10/2023',
    createdAt: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '3',
    objective: 'Algorithms',
    runNumber: 'RUNS-1003',
    availability: 'AVAILABLE',
    departmentId: 'DEPT-1003',
    laboratoryId: 'LAB-1003',
    extraData: '',
    isActive: 1,
    dueDate: '02/10/2023',
    createdAt: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '4',
    objective: 'Pattern recognition',
    runNumber: 'RUNS-1004',
    availability: 'AVAILABLE',
    departmentId: 'DEPT-1002',
    laboratoryId: 'LAB-1001',
    extraData: '',
    isActive: 1,
    dueDate: '02/10/2023',
    createdAt: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '5',
    objective: 'Hypothesis',
    runNumber: 'RUNS-1005',
    availability: 'AVAILABLE',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1004',
    extraData: '',
    isActive: 1,
    dueDate: '02/10/2023',
    createdAt: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
];
export const HistoryHeaders: readonly HistoryHead[] = [
  {
    id: 'runNumber',
    label: 'Runs ID',
    filters: [
      {
        id: 'runNumber',
        type: 'autocomplete',
        label: 'Assest ID',
        options: [
          { value: 'ID1001', label: 'ID1001' },
          { value: 'ID1002', label: 'ID1002' },
          { value: 'ID1003', label: 'ID1003' },
          { value: 'ID1004', label: 'ID1004' },
          { value: 'ID1005', label: 'ID1005' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
  },
  {
    id: 'objective',
    label: 'Runs name',
    filters: [
      {
        id: 'search',
        type: 'textfield',
        label: 'Search',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
  },
  {
    id: 'departmentId',
    label: 'Department',
    filters: [
      {
        id: 'dept',
        type: 'autocomplete',
        label: 'Department',
        options: [
          { value: 'Computer science', label: 'Computer science' },
          { value: 'Cyber security', label: 'Cyber security' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
  },
  {
    id: 'laboratoryId',
    label: 'Lab',
    filters: [
      {
        id: 'lab',
        type: 'autocomplete',
        label: 'Lab',
        options: [
          { value: 'Data mining', label: 'Data mining' },
          { value: 'Data warehouse', label: 'Data warehouse' },
          { value: 'OOPS', label: 'OOPS' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
  },
  {
    id: 'perchasedDate',
    label: 'Last used',
    filters: [
      {
        id: 'date',
        type: 'date',
        label: 'DD/MM/YYYY',
        options: [],
      },
    ],
    sort: 'desc',
    is_show: true,
  },
  // {
  //   id: 'updatedAt',
  //   label: 'User ID',
  //   filters: [
  //     {
  //       id: 'date',
  //       type: 'date',
  //       label: 'DD/MM/YYYY',
  //       options: [],
  //     },
  //   ],
  //   sort: 'asc',
  //   is_show: true,
  // },
  {
    id: 'status',
    label: 'User Name',
    filters: [
      {
        id: 'status',
        type: 'autocomplete',
        label: '-Select status-',
        options: [
          { value: '1', label: 'Fully Working' },
          { value: '2', label: 'Not Working' },
          { value: '3', label: 'Issue' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
  },
  {
    id: 'availability',
    label: 'Status',
    filters: [
      {
        id: 'availability',
        type: 'autocomplete',
        label: '-Select availablity-',
        options: [
          { value: '1', label: 'Available' },
          { value: '2', label: 'Not available' },
        ],
      },
    ],
    sort: 'desc',
    is_show: true,
  },
];
export const HistoryRows = [
  {
    is_checked: false,
    id: '1',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '2',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '3',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '4',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
  {
    is_checked: false,
    id: '5',
    name: 'MD5 Algorithm',
    assetNumber: 'ID1001',
    status: 1,
    availability: 'AVAILABLE',
    userId: '101',
    departmentId: 'DEPT-1001',
    laboratoryId: 'LAB-1001',
    isActive: 1,
    expiryDate: '02/10/2023',
    extraData: '',
    createdAt: '02/10/2023',
    purchasedDate: '02/10/2023',
    updatedAt: '02/10/2023',
    deletedAt: '02/10/2023',
  },
];

export const TableChartStaticData: any = [
  {
    label: 'TABULAR COLUMN:1',
    value: 'TABULAR COLUMN:1',
    data: [
      {
        label: 'Volume Of NaOH Solution',
        values: [21, 21],
      },
      {
        label: 'Volume Of Oxalic Acid',
        values: [21, 212],
      },
      {
        label: 'Concordant Titrate Value',
        values: [21, 12, 41, 5],
      },
      {
        label: 'Initial',
        values: [21, 1, 54, 45],
      },
      {
        label: 'Final',
        values: [21, 554],
      },
    ],
  },
  {
    label: 'TABULAR COLUMN:2',
    value: 'TABULAR COLUMN:2',
    data: [
      {
        label: 'Volume Of NaOH Solution2',
        values: [21, 21],
      },
      {
        label: 'Volume Of Oxalic Acid2',
        values: [21, 212],
      },
      {
        label: 'Concordant Titrate Value2',
        values: [21, 12, 41, 5],
      },
      {
        label: 'Initial2',
        values: [21, 1, 54, 45],
      },
    ],
  },
];
