import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const AdoptClaim = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>AdoptClaim</strong>
            <CButton color="primary" variant="outline" className="float-end mx-1">
              <FontAwesomeIcon icon={faPlusCircle} /> Add New Data
            </CButton>
          </CCardHeader>
          <CCardBody>
            <h1>AdoptClaim</h1>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AdoptClaim
