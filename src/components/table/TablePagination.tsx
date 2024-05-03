import React from 'react';
import { Box, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';

 
const TablePagination: React.FC<any> = ({
  currentPage,
  perPage,
  handlePageChange,
  currentPageNumber,
  totalRecords,
  page,
}) => {
  return (
    <Box className="show-page">
      <Typography>
        Showing{' '}
        {page?.totalCount === 0
          ? 0
          : perPage * page?.currentPage - (perPage - 1)}{' '}
        -
        {perPage * page?.currentPage > page?.totalCount
          ? page?.totalCount
          : perPage * page?.currentPage}{' '}
        out of {page?.totalCount}
      </Typography>
      <Pagination
        count={Math.ceil(page?.totalCount / perPage)}
        variant="outlined"
        shape="rounded"
        page={page?.currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default TablePagination;
