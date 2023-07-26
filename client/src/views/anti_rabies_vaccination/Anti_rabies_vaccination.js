import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const Anti_rabies_vaccination = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Anti_rabies_vaccination</strong>
            <CButton color="primary" variant="outline" className="float-end mx-1">
              <FontAwesomeIcon icon={faPlusCircle} /> Add New Data
            </CButton>
          </CCardHeader>
          <CCardBody>
            <h1>Anti_rabies_vaccination</h1>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Anti_rabies_vaccination
