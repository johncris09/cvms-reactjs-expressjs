import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CAlert, CCardHeader, CCol, CRow } from '@coreui/react'

const Pending = ({ userInfo }) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (userInfo.status === 'Approved') {
      navigate('/dashboard', { replace: true })
    }
  }, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Dashboard</strong>
          </CCardHeader>
          <CCardBody>
            <CAlert color="info" className="d-flex align-items-center">
              <p>
                Dear <strong>{userInfo.email}</strong> , <br />
                <br />
                Thank you for logging into our system. We would like to inform you that your account
                is currently pending approval from the system administrator. We appreciate your
                patience during this process.
                <br />
                <br /> Once your account is approved, you will have full access to all the features
                and functionalities of our system. We strive to review and process account approvals
                as quickly as possible.
                <br />
                <br />
                If you have any urgent questions or require further assistance, please don&apos;t
                hesitate to reach out to our support team. We will be happy to assist you. <br />
                <br />
                Thank you for your understanding. <br />
                <br />
                Best regards, <br />
                The System Adminstrator
              </p>
            </CAlert>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Pending
