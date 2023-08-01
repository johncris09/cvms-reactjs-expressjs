import React, { useEffect, useState } from 'react'
import MaterialReactTable from 'material-react-table'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { MenuItem, ListItemIcon } from '@mui/material'
import RequiredNote from 'src/helper/RequiredNote'
import ConvertToTitleCase from '../../helper/ConvertToTitleCase'
import FormatDateTime from 'src/helper/FormatDateTime'
import GetErrorMessage from 'src/helper/GetErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ip from './../../constant/ip'
import Draggable from 'react-draggable'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CFormSelect,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
} from '@coreui/react'

const User = () => {
  const table = 'users'
  const [data, setData] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [validated, setValidated] = useState(false)
  const [newDataFormModalVisible, setNewDataFormModalVisible] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [isPasswordFieldVisible, setPasswordFieldVisible] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    role_type: '',
    status: '',
  })
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
  const handleAdd = () => {
    setEditMode(false)
    setNewDataFormModalVisible(true)
    setValidated(false)
    setSelectedItemId(null)
    setPasswordFieldVisible(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const _formData = new FormData(form)
    const name = _formData.get('name')
    const email = _formData.get('email')
    const username = _formData.get('username')
    const password = _formData.get('password')
    const role_type = _formData.get('role_type')
    const status = _formData.get('status')

    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        if (selectedItemId) {
          // Update operation
          await updateData({
            name,
            email,
            username,
            password,
            role_type,
            status,
            id: selectedItemId,
          })
        } else {
          // Add operation
          await addData({
            name,
            email,
            username,
            password,
            role_type,
            status,
          })
          setFormData({
            ...formData,
            name: '',
            email: '',
            username: '',
            password: '',
            role_type: '',
            status: '',
          })
          setValidated(false)
        }

        // Fetch updated data
        fetchData()

        setValidated(true)
        setNewDataFormModalVisible(false)
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

  const updateData = async (data) => {
    const response = await axios.put(ip + table, data)

    // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const addData = async (data) => {
    const response = await axios.post(ip + table, data)
    // // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const deleteData = async (id) => {
    const response = await axios.delete(ip + table, { data: { id: id } })

    // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role_type',
      header: 'Role Type',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'timestamp',
      header: 'Created At',
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>User</strong>
            <CButton
              color="primary"
              variant="outline"
              className="float-end mx-1"
              onClick={handleAdd}
            >
              <FontAwesomeIcon icon={faPlusCircle} /> Add New Data
            </CButton>
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
                enableRowActions
                enableColumnResizing
                initialState={{ density: 'compact' }}
                positionToolbarAlertBanner="bottom"
                renderRowActionMenuItems={({ closeMenu, row }) => [
                  <MenuItem
                    key={0}
                    onClick={async () => {
                      closeMenu()
                      setFormData({
                        name: row.original.name,
                        email: row.original.email,
                        username: row.original.username,
                        role_type: row.original.role_type,
                        sdtatus: row.original.sdtatus,
                      })
                      setPasswordFieldVisible(!isPasswordFieldVisible)
                      setSelectedItemId(row.original.id) // Set the selected item ID
                      setNewDataFormModalVisible(true)
                      setEditMode(true)
                    }}
                    sx={{ m: 0 }}
                  >
                    <ListItemIcon>
                      <EditSharp />
                    </ListItemIcon>
                    Edit
                  </MenuItem>,
                  <MenuItem
                    key={1}
                    onClick={() => {
                      closeMenu()
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          let itemId = row.original.id
                          await deleteData(itemId)
                          fetchData()
                        }
                      })
                    }}
                    sx={{ m: 0 }}
                  >
                    <ListItemIcon>
                      <DeleteOutline />
                    </ListItemIcon>
                    Delete
                  </MenuItem>,
                ]}
              />
            </>
          </CCardBody>
        </CCard>
      </CCol>
      {/* Add New Data */}
      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onStop={(e, data) => {
          setModalPosition({ x: data.x, y: data.y })
        }}
      >
        <CModal
          alignment="center"
          visible={newDataFormModalVisible}
          onClose={() => setNewDataFormModalVisible(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>{editMode ? 'Edit Data' : 'Add New Data'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <RequiredNote />
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Name is required"
                  id="name"
                  label={
                    <>
                      Name
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="email"
                  feedbackInvalid="Email is required"
                  id="email"
                  label={
                    <>
                      Email
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Username is required"
                  id="date"
                  label={
                    <>
                      Username
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <>
                {isPasswordFieldVisible && (
                  <CCol md={12}>
                    <CFormInput
                      type="password"
                      feedbackInvalid="Password is required"
                      id="date"
                      label={
                        <>
                          Password
                          <span className="text-warning">
                            <strong>*</strong>
                          </span>
                        </>
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                )}
              </>
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="User's Role Type is required"
                  id="role-type"
                  label={
                    <>
                      User&apos;s Role Type
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="role_type"
                  value={formData.role_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">Super Admin</option>
                </CFormSelect>
              </CCol>
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Status is required"
                  id="status"
                  label={
                    <>
                      Status
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option value="User">Pending</option>
                  <option value="Admin">Approved</option>
                </CFormSelect>
              </CCol>
              <hr />
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {editMode ? 'Update' : 'Submit form'}
                </CButton>
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>
      </Draggable>
    </CRow>
  )
}

export default User
