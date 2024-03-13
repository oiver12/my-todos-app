"use client";
import React from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';


const columns: GridColDef[] = [
  {
    field: 'Name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'Date',
    headerName: 'Date',
    width: 150,
  },
  {
    field: 'ToDo',
    headerName: 'ToDo',
    width: 160,
    // valueGetter: (params: GridValueGetterParams) =>
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, Name: 'Analysis', Date: '2021-10-10', ToDo: 'Take out the trash' },
];

const DataGridComponent = () => {
    return (
        <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
        </div>
    )
}

export default DataGridComponent
