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
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
} from '@coreui/react'

const DewormSpecies = () => {
  const table = 'deworm_species'
  const [data, setData] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [validated, setValidated] = useState(false)
  const [newDataFormModalVisible, setNewDataFormModalVisible] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
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
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const _formData = new FormData(form)
    const name = _formData.get('name')

    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        if (selectedItemId) {
          // Update operation
          await updateData(name, selectedItemId)
        } else {
          // Add operation
          await addData(name)
          setFormData({
            ...formData,
            name: '',
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

  const updateData = async (name, id) => {
    const response = await axios.put(ip + table, {
      name: name,
      id: id,
    })

    // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const addData = async (name) => {
    const response = await axios.post(ip + table, { name: name })

    // Show success message
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
      accessorKey: 'name',
      header: 'Species',
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
            <strong>Deworm Species</strong>
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
                      })

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
                  feedbackInvalid="Date is required"
                  id="date"
                  label={
                    <>
                      Name of Species
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

export default DewormSpecies
