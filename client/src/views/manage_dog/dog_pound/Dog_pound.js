import React, { useEffect, useState } from 'react'
import MaterialReactTable from 'material-react-table'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { MenuItem, ListItemIcon } from '@mui/material'
import CalculateAge from './../../../helper/CalculateAge'
import RequiredNote from './../../../helper/RequiredNote'
import ConvertToTitleCase from './../../../helper/ConvertToTitleCase'
import FormatDateTime from './../../../helper/FormatDateTime'
import FormatDate from './../../../helper/FormatDate'
import GetErrorMessage from './../../../helper/GetErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ip from './../../../constant/ip'
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
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'

const Dog_pound = () => {
  const table = 'dog_pound'
  const [data, setData] = useState([])
  const [barangayOptions, setBarangayOptions] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [validated, setValidated] = useState(false)
  const [newDataFormModalVisible, setNewDataFormModalVisible] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [formData, setFormData] = useState({
    or_number: '',
    date: '',
    owner_name: '',
    pet_name: '',
    color: '',
    sex: '',
    size: '',
    address: '',
  })

  useEffect(() => {
    fetchData()
    fetchBarangay()
  }, [])

  const handleAdd = () => {
    setFormData({
      date_vaccinated: '',
      vaccine_type: '',
      owner_name: '',
      pet_name: '',
      address: '',
      pet_birthdate: '',
      color: '',
      sex: '',
      species: '',
      neutered: '',
    })
    setEditMode(false)
    setNewDataFormModalVisible(true)
    setValidated(false)
    setSelectedItemId(null)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(ip + table)
      const formattedData = response.data.map((item) => ({
        ...item,
        date: FormatDate(item.date),
        age: CalculateAge(item.pet_birthdate),
        timestamp: FormatDateTime(item.timestamp),
      }))
      setData(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchBarangay = async () => {
    try {
      const response = await axios.get(ip + 'barangay')
      setBarangayOptions(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const _formData = new FormData(form)
    const date = _formData.get('date')
    const or_number = _formData.get('or_number')
    const owner_name = _formData.get('owner_name')
    const pet_name = _formData.get('pet_name')
    const color = _formData.get('color')
    const sex = _formData.get('sex')
    const size = _formData.get('size')
    const address = _formData.get('address')

    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        if (selectedItemId) {
          // Update operation
          await updateData({
            date,
            or_number,
            owner_name,
            pet_name,
            color,
            sex,
            size,
            address,
            id: selectedItemId,
          })
        } else {
          // Add operation
          await addData({
            date,
            or_number,
            owner_name,
            pet_name,
            color,
            sex,
            size,
            address,
          })
          setFormData({
            or_number: '',
            date: '',
            owner_name: '',
            pet_name: '',
            color: '',
            sex: '',
            size: '',
            address: '',
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
    console.info(response.data)
    // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const addData = async (data) => {
    const response = await axios.post(ip + table, data)
    // // // Show success message
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
    const { name, value, type } = e.target
    let updatedValue = value

    // Convert text inputs to title case
    if (type === 'text') {
      updatedValue = ConvertToTitleCase(value)
    }
    setFormData({ ...formData, [name]: updatedValue })
  }
  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'or_number',
      header: 'Or #',
    },
    {
      accessorKey: 'owner_name',
      header: 'Owner Name',
    },
    {
      accessorKey: 'pet_name',
      header: 'Pet Name',
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    {
      accessorKey: 'sex',
      header: 'Sex',
    },
    {
      accessorKey: 'size',
      header: 'Size',
    },
    {
      accessorKey: 'address',
      header: 'Address',
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
            <strong>Anti Rabies Vaccination</strong>

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

                      let id = row.original.id
                      try {
                        const response = await axios.get(ip + table + '/' + id)
                        var rowData = response.data
                        const dateString = rowData.date

                        // Convert the date string to a Date object
                        const date = new Date(dateString)
                        // Add one day to the Date object
                        date.setUTCDate(date.getUTCDate() + 1)

                        // Extract the updated year, month, and day parts after adding one day
                        const updatedYear = date.getUTCFullYear()
                        const updatedMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
                        const updatedDay = String(date.getUTCDate()).padStart(2, '0')

                        // Format the updated date in Y-m-d format
                        const updatedFormattedDate = `${updatedYear}-${updatedMonth}-${updatedDay}`

                        setFormData({
                          date: updatedFormattedDate,
                          or_number: rowData.or_number,
                          owner_name: rowData.owner_name,
                          pet_name: rowData.pet_name,
                          color: rowData.color,
                          sex: rowData.sex,
                          size: rowData.size,
                          address: rowData.address,
                        })

                        setSelectedItemId(row.original.id) // Set the selected item ID
                        setNewDataFormModalVisible(true)
                        setEditMode(true)
                      } catch (error) {
                        console.error('Error fetching data:', error)
                      }
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
              <CCol md={6}>
                <CFormInput
                  type="text"
                  feedbackInvalid="OR # is required"
                  id="or-number"
                  label={
                    <>
                      OR #
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="or_number"
                  value={formData.or_number}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="date"
                  feedbackInvalid="Date is required"
                  id="date"
                  label={
                    <>
                      Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Name of the Owner is required"
                  id="owner-name"
                  label={
                    <>
                      Name of the Owner
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Address is required"
                  id="address"
                  label={
                    <>
                      Address
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  {barangayOptions.map((barangay) => (
                    <option key={barangay.id} value={barangay.id}>
                      {barangay.barangay}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Pet's Name is required"
                  id="pet-name"
                  label={
                    <>
                      Pet&apos;s Name
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="pet_name"
                  value={formData.pet_name}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Color is required"
                  id="color"
                  label={
                    <>
                      Color
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  feedbackInvalid="Sex is required"
                  id="sex"
                  label={
                    <>
                      Sex
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  feedbackInvalid="Size is required"
                  id="size"
                  label={
                    <>
                      Size
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
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

export default Dog_pound
