import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const ActivityLog = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>ActivityLog</strong>
          </CCardHeader>
          <CCardBody>
            <h1>ActivityLog</h1>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ActivityLog
