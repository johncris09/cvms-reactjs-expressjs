import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const DatabaseBackup = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>DatabaseBackup</strong>
          </CCardHeader>
          <CCardBody>
            <h1>DatabaseBackup</h1>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DatabaseBackup
