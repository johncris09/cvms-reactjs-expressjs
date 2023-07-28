import React, { useEffect, useState } from 'react'
import MaterialReactTable from 'material-react-table'
import { ExportToCsv } from 'export-to-csv'
import { Box, darken } from '@mui/material'
import FormatDateTime from './../../../helper/FormatDateTime'
import FormatDate from './../../../helper/FormatDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ip from './../../../constant/ip'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

pdfMake.vfs = pdfFonts.pdfMake.vfs
const Disposed = () => {
  const table = 'disposed_dog'
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const response = await axios.get(ip + table)
      const formattedData = response.data.map((item) => ({
        ...item,
        date: FormatDate(item.date),
        disposed_date: FormatDate(item.disposed_date),
        timestamp: FormatDateTime(item.timestamp),
      }))
      setData(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const columns = [
    {
      accessorKey: 'disposed_date',
      header: 'Disposed Date',
    },
    {
      accessorKey: 'medicine',
      header: 'Medicine',
    },
    {
      accessorKey: 'owner_name',
      header: 'Owner Name',
    },
    {
      accessorKey: 'pet_name',
      header: 'Pet Name',
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    {
      accessorKey: 'sex',
      header: 'Sex',
    },
    {
      accessorKey: 'size',
      header: 'Size',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'timestamp',
      header: 'Created At',
    },
  ]

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)

  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          date: item.date,
          or_number: item.or_number,
          owner_name: item.owner_name,
          pet_name: item.pet_name,
          color: item.color,
          sex: item.sex,
          size: item.size,
          address: item.address,
          created_at: item.timestamp,
        }
      })
    csvExporter.generateCsv(exportedData)
  }
  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        date: item.date,
        or_number: item.or_number,
        owner_name: item.owner_name,
        pet_name: item.pet_name,
        color: item.color,
        sex: item.sex,
        size: item.size,
        address: item.address,
        created_at: item.timestamp,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Disposed Dogs</strong>
          </CCardHeader>
          <CCardBody>
            <>
              <MaterialReactTable
                columns={columns}
                data={data}
                muiTablePaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: '0',
                    border: '1px dashed #e0e0e0',
                  },
                }}
                muiTableBodyProps={{
                  sx: (theme) => ({
                    '& tr:nth-of-type(odd)': {
                      backgroundColor: darken(theme.palette.background.default, 0.05),
                    },
                  }),
                }}
                enableColumnFilterModes
                enableColumnOrdering
                enableGrouping
                enablePinning
                enableColumnResizing
                initialState={{ density: 'compact' }}
                positionToolbarAlertBanner="bottom"
                enableRowSelection
                renderTopToolbarCustomActions={({ table }) => (
                  <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                    <CButton size="md" className="btn-info text-white" onClick={handleExportData}>
                      <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                    </CButton>
                    <CButton
                      disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                      //only export selected rows
                      onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                      variant="outline"
                    >
                      <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                    </CButton>
                  </Box>
                )}
              />
            </>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Disposed
