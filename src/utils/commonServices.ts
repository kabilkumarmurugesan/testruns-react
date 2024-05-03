
export const handleCheckboxChange = (
  Rows: any[],
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>,
  setIsDeselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setIsselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setTableHeaderVisible: React.Dispatch<React.SetStateAction<boolean>>,
) => (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
  const checked = event.target.checked;
  const updatedRows = Rows.map((row) => {
    if (row.id === id) {
      return { ...row, is_checked: checked };
    }
    return row;
  });

  setSelectedRows(updatedRows);
  const anyCheckboxSelected = updatedRows.some((row) => row.is_checked);
  setIsDeselectAllChecked(false);
  setIsselectAllChecked(false);
  setTableHeaderVisible(anyCheckboxSelected);
};



export const handledAllSelected = (
  status: boolean,
  Rows: any[],
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>,
  setIsDeselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setIsselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>
) => () => {
  const allChecked = Rows.every((row) => row.is_checked);

  if (!allChecked) {
    const updatedRows = Rows.map((row) => ({ ...row, is_checked: true }));
    setSelectedRows(updatedRows);
    setIsDeselectAllChecked(false);
    setIsselectAllChecked(true);
  }
};


export const handleDeCheckboxChange = (
  status: boolean,
  Rows: any[],
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>,
  setIsDeselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setIsselectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setTableHeaderVisible: React.Dispatch<React.SetStateAction<boolean>> 
) => () => {
  const updatedRows = Rows.map((row: any) => ({ ...row, is_checked: false }));
  setSelectedRows(updatedRows);
  setIsDeselectAllChecked(!status);
  setIsselectAllChecked(false);
  setTableHeaderVisible(false); 
};

