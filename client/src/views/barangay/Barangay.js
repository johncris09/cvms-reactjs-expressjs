import React, { useEffect, useState, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import FormatDateTime from 'src/helper/FormatDateTime'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ip from './../../constant/ip'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const Barangay = () => {
  const table = 'barangay'
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(ip + table)
      const formattedData = response.data.map((item) => ({
        ...item,
        timestamp: FormatDateTime(item.timestamp),
      }))
      setData(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const columns = [
    {
      accessorKey: 'barangay',
      header: 'Barangay',
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Medication</strong>
          </CCardHeader>
          <CCardBody>
            <>
              <MaterialReactTable
                columns={columns}
                data={data}
                enableColumnFilterModes
                enableColumnOrdering
                enableGrouping
                enablePinning
                enableColumnResizing
                initialState={{ density: 'compact' }}
                positionToolbarAlertBanner="bottom"
              />
            </>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Barangay
