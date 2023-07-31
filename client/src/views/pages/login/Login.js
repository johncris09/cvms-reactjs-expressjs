import React, { useState, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import ip from './../../../constant/ip'
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
  CRow,
} from '@coreui/react'
import logo from './../../../assets/images/logo.png'
import Swal from 'sweetalert2'
import GetErrorMessage from './../../../helper/GetErrorMessage'
import axios from 'axios'

const Login = () => {
  const table = 'login'
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [validated, setValidated] = useState(false)
  const [formData, setFormData] = useState({
    username: 'johncris',
    password: 'johncris',
  })

  useEffect(() => {
    // Check if the token is set in local storage or cookies
    const token = localStorage.getItem('token') // Assuming the token is stored in local storage

    if (token) {
      // If the token is set, navigate to the dashboard
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleLogin = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const _formData = new FormData(form)
    const username = _formData.get('username')
    const password = _formData.get('password')
    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        const response = await axios.post(ip + table, { username, password })
        const token = response.data.token

        // Set the token to localStorage
        localStorage.setItem('token', token)

        // Navigate to the dashboard
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      // Show error message
      Swal.fire({
        title: 'Error!',
        html: GetErrorMessage(error),
        icon: 'error',
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })
  }

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

                  <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleLogin}
                  >
                    <h3 className="text-center">
                      Office of the City Veterinarian <br /> Monitoring System
                    </h3>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>

                    <CFormInput
                      type="text"
                      className="text-center py-2"
                      feedbackInvalid="Name of Farmer is required"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      required
                    />
                    <CFormInput
                      type="password"
                      className="text-center py-2"
                      feedbackInvalid="Name of Farmer is required"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                    />
                    <CButton type="submit" color="primary">
                      Login
                    </CButton>
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
