import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const User = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>User</strong>
          </CCardHeader>
          <CCardBody>
            <h1>User</h1>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default User
