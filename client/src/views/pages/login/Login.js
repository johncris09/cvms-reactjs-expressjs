import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import logo from './../../../assets/images/logo.png'

const Login = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={12} lg={6} xl={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <div className="text-center">
                    <CImage
                      rounded
                      src={logo}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '150px',
                        maxHeight: '150px',
                      }}
                    />
                  </div>
                  <CForm>
                    <h3 className="text-center">
                      Office of the City Veterinarian <br /> Monitoring System
                    </h3>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>
                    <CFormInput
                      className="text-center mb-2 py-2"
                      placeholder="Username"
                      autoComplete="username"
                    />
                    <CFormInput
                      className="text-center mb-4 py-2"
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                    <CRow>
                      <div className="d-grid gap-2">
                        <CButton color="primary">Login</CButton>
                      </div>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
