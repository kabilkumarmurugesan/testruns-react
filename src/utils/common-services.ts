/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
 
export const handleCheckboxChange =
  (
    Rows: any[],
    setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>,
    setIsDeselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    setIsselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    setTableHeaderVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setVisibleRow: React.Dispatch<React.SetStateAction<any[]>>,
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const checked = event.target.checked;
    const updatedRows = Rows.map((row) => {
      if (row._id === id) {
        return { ...row, is_checked: checked };
      }
      return row;
    });
    setSelectedRows(updatedRows);
    const anyCheckboxSelected = updatedRows.some((row) => row.is_checked);
    setIsDeselectAllChecked(false);
    setIsselectAllChecked(false);
    setTableHeaderVisible(anyCheckboxSelected);
    setVisibleRow(updatedRows);
  };

export const handledAllSelected =
  (
    status: boolean,
    Rows: any[],
    setAssetsData: React.Dispatch<React.SetStateAction<any[]>>,
    setIsDeselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    setIsselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    setVisibleRow: React.Dispatch<React.SetStateAction<any[]>>,
    setRowId: React.Dispatch<React.SetStateAction<any[]>>,
  ) =>
  () => {
    const allChecked = Rows.every((row: any) => row.is_checked);
    // if (!allChecked) {
    const updatedRows = Rows.map((row: any) => ({ ...row, is_checked: true }));
    const rowsId = [];
    rowsId.push(Rows.map((row: any) => row._id));
    setAssetsData(updatedRows);
    setIsDeselectAllChecked(false);
    setIsselectAllChecked(true);
    setVisibleRow(updatedRows);
    setRowId(rowsId.flat());
    // }
  };

export const handleDeCheckboxChange =
  (
    status: boolean,
    assetsData: any[],
    setAssetsData: React.Dispatch<React.SetStateAction<any[]>>,
    setIsDeselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    setIsselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    setTableHeaderVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setRowId: React.Dispatch<React.SetStateAction<any[]>>,
    // setVisibleRow: React.Dispatch<React.SetStateAction<any[]>>
  ) =>
  () => {
    var updatedRows = assetsData.map((row: any) => ({
      ...row,
      is_checked: false,
    }));
    setAssetsData(updatedRows);
    setIsDeselectAllChecked(status);
    setIsselectAllChecked(false);
    setTableHeaderVisible(false);
    setRowId([]);
    // setVisibleRow(updatedRows)
  };

export const handleLogouFunction = (
  message: string = `You have been successfully logged out!`,
) => {
  typeof window !== 'undefined' && window.localStorage.clear();
  toast(`${message} !`, {
    style: {
      background: '#00bf70',
      color: '#fff',
    },
  });
  window.location.href = '/login';
 };
