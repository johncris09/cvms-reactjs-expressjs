import React, { useEffect, useState } from 'react'
import MaterialReactTable from 'material-react-table'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { MenuItem, ListItemIcon } from '@mui/material'
import CalculateAge from '../../helper/CalculateAge'
import RequiredNote from 'src/helper/RequiredNote'
import ConvertToTitleCase from '../../helper/ConvertToTitleCase'
import FormatDateTime from 'src/helper/FormatDateTime'
import FormatDate from 'src/helper/FormatDate'
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
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'

const Anti_rabies_vaccination = () => {
  const table = 'anti_rabies_vaccination'
  const [data, setData] = useState([])
  const [speciesOptions, setSpeciesOptions] = useState([])
  const [barangayOptions, setBarangayOptions] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [validated, setValidated] = useState(false)
  const [newDataFormModalVisible, setNewDataFormModalVisible] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchData()
    fetchBarangay()
    fetchSpecies()
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
        date_vaccinated: FormatDate(item.date_vaccinated),
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

  const fetchSpecies = async () => {
    try {
      const response = await axios.get(ip + 'anti_rabies_species')
      setSpeciesOptions(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      const _formData = new FormData(form)
      const date_vaccinated = _formData.get('date_vaccinated')
      const vaccine_type = _formData.get('vaccine_type')
      const address = _formData.get('address')
      const owner_name = _formData.get('owner_name')
      const pet_name = _formData.get('pet_name')
      const pet_birthdate = _formData.get('pet_birthdate')
      const color = _formData.get('color')
      const sex = _formData.get('sex')
      const species = _formData.get('species')
      const neutered = _formData.get('neutered')
      if (selectedItemId) {
        // Update operation
        console.info('Update operation')
      } else {
        // Add operation
        console.info('Add operation')
      }
      setValidated(false)
      // setNewDataFormModalVisible(false)
    }
    // form.reset()
    setValidated(true)
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
      accessorKey: 'date_vaccinated',
      header: 'Vaccination Date',
    },
    {
      accessorKey: 'address',
      header: 'Address',
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
      accessorKey: 'age',
      header: 'Age (Years)',
    },
    {
      accessorKey: 'sex',
      header: 'Sex',
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    {
      accessorKey: 'species',
      header: 'Species',
    },
    {
      accessorKey: 'neutered',
      header: 'Neutered',
    },
    {
      accessorKey: 'vaccine_type',
      header: 'Vaccine Type',
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

                      // setFormData({
                      //   medication: row.original.medication,
                      // })

                      // setSelectedItemId(row.original.id) // Set the selected item ID
                      // setNewDataFormModalVisible(true)
                      // setEditMode(true)
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
                      // Swal.fire({
                      //   title: 'Are you sure?',
                      //   text: "You won't be able to revert this!",
                      //   icon: 'warning',
                      //   showCancelButton: true,
                      //   confirmButtonColor: '#3085d6',
                      //   cancelButtonColor: '#d33',
                      //   confirmButtonText: 'Yes, delete it!',
                      // }).then(async (result) => {
                      //   if (result.isConfirmed) {
                      //     let itemId = row.original.id
                      //     await deleteData(itemId)
                      //     fetchData()
                      //   }
                      // })
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

      {/* Add new Data */}

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
                  type="date"
                  feedbackInvalid="Date of Vaccination is required"
                  id="owner-number"
                  label={
                    <>
                      Date of Vaccination
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="date_vaccinated"
                  value={formData.date_vaccinated}
                  onChange={handleChange}
                  required
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Vaccine Type is required"
                  id="pet-name"
                  label={
                    <>
                      Vaccine Type
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="vaccine_type"
                  value={formData.vaccine_type}
                  onChange={handleChange}
                  required
                />
              </CCol>

              <CCol md={6}>
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
              <CCol md={6}>
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
                    <option key={barangay.barangay} value={barangay.barangay}>
                      {barangay.barangay}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="date"
                  feedbackInvalid="Pet's Birthdate is required"
                  id="pet-birthdate"
                  label={
                    <>
                      Pet&apos;s Birthdate
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="pet_birthdate"
                  value={formData.pet_birthdate}
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
              <CCol md={6}>
                <CFormSelect
                  feedbackInvalid="Species is required"
                  id="species"
                  label={
                    <>
                      Species
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  {speciesOptions.map((species) => (
                    <option key={species.id} value={species.id}>
                      {species.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  feedbackInvalid="Neutered is required"
                  id="neutered"
                  label={
                    <>
                      Neutered
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="neutered"
                  value={formData.neutered}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
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

export default Anti_rabies_vaccination
