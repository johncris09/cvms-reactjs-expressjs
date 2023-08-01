import React, { useEffect, useState } from 'react'
import MaterialReactTable from 'material-react-table'
import { ExportToCsv } from 'export-to-csv'
import { OroquietaCityLogo, cityVetLogo } from './../../../helper/LogoReport'
import { DeleteOutline, EditSharp, Handshake, MedicationLiquid } from '@mui/icons-material'
import { MenuItem, ListItemIcon, Box, darken } from '@mui/material'
import CalculateAge from './../../../helper/CalculateAge'
import RequiredNote from './../../../helper/RequiredNote'
import ConvertToTitleCase from './../../../helper/ConvertToTitleCase'
import FormatDateTime from './../../../helper/FormatDateTime'
import FormatDate from './../../../helper/FormatDate'
import GetErrorMessage from './../../../helper/GetErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ip from './../../../constant/ip'
import Draggable from 'react-draggable'
import Swal from 'sweetalert2'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import withReactContent from 'sweetalert2-react-content'
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

const MySwal = withReactContent(Swal)
pdfMake.vfs = pdfFonts.pdfMake.vfs
const Dog_pound = ({ userInfo }) => {
  const table = 'dog_pound'
  const [data, setData] = useState([])
  const [barangayOptions, setBarangayOptions] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [validated, setValidated] = useState(false)
  const [newDataFormModalVisible, setNewDataFormModalVisible] = useState(false)
  const [reportFormModalVisible, setReportFormModalVisible] = useState(false)
  const [adoptFormModalVisible, setAdoptFormModalVisible] = useState(false)
  const [disposedFormModalVisible, setDisposedFormModalVisible] = useState(false)
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
  const [formReportData, setFormReportData] = useState({
    start_date: '',
    end_date: '',
    address: '',
  })
  const [formAdoptData, setFormAdoptData] = useState({
    dogPoundId: '',
    date: '',
    owner_name: '',
    address: '',
    status: '',
  })
  const [formDisposedData, setFormDisposedData] = useState({
    dogPoundId: '',
    date: '',
    medicine: '',
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
  const handleReport = () => {
    setReportFormModalVisible(true)
  }

  const handleReportSubmit = async (event) => {
    const form = event.currentTarget
    try {
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        event.preventDefault()
        const formData = new FormData(form)
        const start_date = formData.get('start_date')
        const end_date = formData.get('end_date')
        const address = formData.get('address')
        generateReport({ start_date, end_date, address })
        setValidated(false)
      }
      setValidated(true)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const generateReport = async (data) => {
    const response = await axios.get(ip + table + '/report', {
      params: {
        ...data,
      },
    })

    // get Barangay
    let barangayName = 'All'

    // Assuming barangayOptions is an array of objects with properties 'id' and 'barangay'
    barangayOptions.forEach((option) => {
      if (option.id == formReportData.address) {
        barangayName = option.barangay
        return false // This will break out of the forEach loop
      }
    })

    // generate Report
    if (response.data.length > 0) {
      const content = []
      // Add table header
      const tableHeader = [
        { text: 'Date', style: 'tableHeader', bold: true },
        { text: 'OR Number', style: 'tableHeader', bold: true },
        { text: 'Owner Name', style: 'tableHeader', bold: true },
        { text: 'Pet Name', style: 'tableHeader', bold: true },
        { text: 'Color', style: 'tableHeader', bold: true },
        { text: 'Sex', style: 'tableHeader', bold: true },
        { text: 'Size', style: 'tableHeader', bold: true },
        { text: 'Address', style: 'tableHeader', bold: true },
      ]

      content.push(tableHeader)
      // Add table rows
      for (const item of response.data) {
        const formattedDate = FormatDate(item.date)
        const tableRow = [
          formattedDate,
          item.or_number,
          item.owner_name,
          item.pet_name,
          item.color,
          item.sex,
          item.size,
          item.address,
        ]
        content.push(tableRow)
      }
      const currentDateTime = new Date().toLocaleString('en-US')
      const documentDefinition = {
        footer: function (currentPage, pageCount) {
          return {
            columns: [
              {
                text: `Date Printed: ${currentDateTime}`,
                alignment: 'left',
                fontSize: 8,
                margin: [20, 0],
              },
              {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: 'right',
                fontSize: 8,
                margin: [0, 0, 20, 0],
              },
            ],
            margin: [20, 10],
          }
        },
        content: [
          {
            columns: [
              {
                width: 'auto',
                image: cityVetLogo,
                fit: [50, 50],
              },
              {
                text: [
                  'Republic of the Philippines\n',
                  'OFFICE OF THE VETERINARIAN\n',
                  'Oroquieta City\n\n',
                  {
                    text: 'City of Good Life',
                    style: 'subheaderText',
                    alignment: 'center',
                    italics: true,
                    bold: true,
                  },
                ],
                style: 'headerText',
                bold: false,
                alignment: 'center',
              },
              {
                width: 'auto',
                image: OroquietaCityLogo,
                fit: [50, 50],
                alignment: 'right',
              },
            ],
          },
          {
            text: '\n\n', // Add some spacing between the header and the table
          },
          {
            columns: [
              {
                width: 'auto',
                text: 'Barangay: ' + barangayName,
                text: [
                  'Barangay: ',
                  {
                    text: barangayName,
                    bold: true,
                    decoration: 'underline',
                  },
                ],
                fit: [200, 200],
              },
              {
                text: [' '],
                style: 'headerText',
                bold: false,
                alignment: 'center',
              },
              {
                text: [
                  'Date: ',
                  {
                    text:
                      FormatDate(formReportData.start_date) +
                      ' - ' +
                      FormatDate(formReportData.end_date),
                    bold: true,
                    decoration: 'underline',
                  },
                ],
                fit: [200, 200],
                alignment: 'right',
              },
            ],
          },
          {
            style: 'tableDesign',
            table: {
              body: content,
            },
            alignment: 'center',
          },
        ],
        styles: {
          tableDesign: {
            margin: [0, 5, 0, 15],
            fontSize: 10,
          },
          footer: {
            fontSize: 8,
          },
        },
      }
      const pdfDoc = pdfMake.createPdf(documentDefinition)
      pdfDoc.open()
    } else {
      // Show error message
      MySwal.fire({
        title: <strong>No record found</strong>,
        html: <i>There are no records matching your search criteria.</i>,
        icon: 'info',
      })
    }
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

  const handleReportChange = (e) => {
    const { name, value } = e.target
    setFormReportData({ ...formReportData, [name]: value })
  }

  const handleAdoptClaimSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      const _formData = new FormData(form)

      try {
        let id = formAdoptData.dogPoundId
        const response = await axios.get(ip + table + '/' + id)
        var rowData = response.data

        // Convert the date string to a Date object
        const date = new Date(response.data.date)
        // Add one day to the Date object
        date.setUTCDate(date.getUTCDate() + 1)

        // Extract the updated year, month, and day parts after adding one day
        const updatedYear = date.getUTCFullYear()
        const updatedMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
        const updatedDay = String(date.getUTCDate()).padStart(2, '0')

        // Format the updated date in Y-m-d format
        const updatedFormattedDate = `${updatedYear}-${updatedMonth}-${updatedDay}`

        // Remove the 'reference' and 'timestamp' keys
        const { reference: removedReference, timestamp: removedTimestamp, ...newObj } = rowData

        const adoptData = {
          ...newObj,
          date: updatedFormattedDate,
          adopt_date: _formData.get('date'),
          adopt_owner_name: _formData.get('owner_name'),
          adopt_address: _formData.get('address'),
          status: _formData.get('status'),
        }

        // insert to adopt
        await axios.post(ip + 'adopt_claim', adoptData)
        // delete data from dop pound
        await axios.delete(ip + table, { data: { id: id } })

        setFormAdoptData({
          ...formAdoptData,
          date: '',
          owner_name: '',
          address: '',
          status: '',
        })
        setValidated(false)

        MySwal.fire({
          title: <strong>Success!</strong>,
          html: <i>New Record Successfully Added!</i>,
          icon: 'success',
        })
        setAdoptFormModalVisible(false)
      } catch (error) {
        console.error('Error moving data:', error)
      }
    }
    setValidated(true)
  }

  const handleDisposedSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      const _formData = new FormData(form)
      // const timestamp = serverTimestamp()

      try {
        let id = formDisposedData.dogPoundId
        const dogPoundData = await axios.get(ip + table + '/' + id)
        var rowData = dogPoundData.data

        // Convert the date string to a Date object
        const date = new Date(rowData.date)
        // Add one day to the Date object
        date.setUTCDate(date.getUTCDate() + 1)

        // Extract the updated year, month, and day parts after adding one day
        const updatedYear = date.getUTCFullYear()
        const updatedMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
        const updatedDay = String(date.getUTCDate()).padStart(2, '0')

        // Format the updated date in Y-m-d format
        const updatedFormattedDate = `${updatedYear}-${updatedMonth}-${updatedDay}`

        // Remove the 'reference' and 'timestamp' keys
        const { reference: removedReference, timestamp: removedTimestamp, ...newObj } = rowData

        const disposedDogData = {
          ...newObj,
          date: updatedFormattedDate,
          disposed_date: _formData.get('date'),
          medicine: _formData.get('medicine'),
        }

        // insert to adopt
        await axios.post(ip + 'disposed_dog', disposedDogData)
        // delete data from dop pound
        await axios.delete(ip + table, { data: { id: id } })

        setFormDisposedData({
          ...formDisposedData,
          date: '',
          medicine: '',
        })
        setValidated(false)

        MySwal.fire({
          title: <strong>Success!</strong>,
          html: <i>New Record Successfully Added!</i>,
          icon: 'success',
        })

        setDisposedFormModalVisible(false)
      } catch (error) {
        console.error('Error moving data:', error)
      }
    }
    setValidated(true)
  }

  const handleAdoptChange = (e) => {
    const { name, value, type } = e.target
    let updatedValue = value

    // Convert text inputs to title case
    if (type === 'text') {
      updatedValue = ConvertToTitleCase(value)
    }
    setFormAdoptData({ ...formAdoptData, [name]: updatedValue })
  }

  const handleDisposedChange = (e) => {
    const { name, value, type } = e.target
    let updatedValue = value

    // Convert text inputs to title case
    if (type === 'text') {
      updatedValue = ConvertToTitleCase(value)
    }
    setFormDisposedData({ ...formDisposedData, [name]: updatedValue })
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

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)

  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          date: item.date,
          or_number: item.or_number,
          owner_name: item.owner_name,
          pet_name: item.pet_name,
          color: item.color,
          sex: item.sex,
          size: item.size,
          address: item.address,
          created_at: item.timestamp,
        }
      })
    csvExporter.generateCsv(exportedData)
  }
  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        date: item.date,
        or_number: item.or_number,
        owner_name: item.owner_name,
        pet_name: item.pet_name,
        color: item.color,
        sex: item.sex,
        size: item.size,
        address: item.address,
        created_at: item.timestamp,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Dog Pound</strong>
            {userInfo.role_type !== 'User' && (
              <>
                <CButton
                  color="success"
                  variant="outline"
                  className="float-end"
                  onClick={handleReport}
                >
                  <FontAwesomeIcon icon={faFilePdf} /> Generate Report
                </CButton>
                <CButton
                  color="primary"
                  variant="outline"
                  className="float-end mx-1"
                  onClick={handleAdd}
                >
                  <FontAwesomeIcon icon={faPlusCircle} /> Add New Data
                </CButton>
              </>
            )}
          </CCardHeader>
          <CCardBody>
            <>
              {userInfo.role_type !== 'User' && (
                <MaterialReactTable
                  columns={columns}
                  data={data}
                  muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                      borderRadius: '0',
                      border: '1px dashed #e0e0e0',
                    },
                  }}
                  muiTableBodyProps={{
                    sx: (theme) => ({
                      '& tr:nth-of-type(odd)': {
                        backgroundColor: darken(theme.palette.background.default, 0.05),
                      },
                    }),
                  }}
                  enableColumnFilterModes
                  enableColumnOrdering
                  enableGrouping
                  enablePinning
                  enableRowActions
                  enableColumnResizing
                  initialState={{ density: 'compact' }}
                  positionToolbarAlertBanner="bottom"
                  enableRowSelection
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
                    <MenuItem
                      key={2}
                      onClick={async () => {
                        closeMenu()
                        let id = row.original.id
                        setFormAdoptData({
                          ...formAdoptData,
                          dogPoundId: id,
                          date: '',
                          owner_name: '',
                          address: '',
                          status: '',
                        })
                        setAdoptFormModalVisible(true)
                      }}
                      sx={{ m: 0 }}
                    >
                      <ListItemIcon>
                        <Handshake />
                      </ListItemIcon>
                      Adopt/Claim
                    </MenuItem>,
                    <MenuItem
                      key={3}
                      onClick={() => {
                        closeMenu()
                        let id = row.original.id
                        setFormDisposedData({
                          ...formDisposedData,
                          dogPoundId: id,
                          date: '',
                          medicine: '',
                        })
                        setDisposedFormModalVisible(true)
                      }}
                      sx={{ m: 0 }}
                    >
                      <ListItemIcon>
                        <MedicationLiquid />
                      </ListItemIcon>
                      Disposed
                    </MenuItem>,
                  ]}
                  renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                      <CButton size="md" className="btn-info text-white" onClick={handleExportData}>
                        <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                      </CButton>
                      <CButton
                        size="md"
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                        variant="outline"
                      >
                        <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                      </CButton>
                    </Box>
                  )}
                />
              )}
              {userInfo.role_type === 'User' && (
                <MaterialReactTable
                  columns={columns}
                  data={data}
                  muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                      borderRadius: '0',
                      border: '1px dashed #e0e0e0',
                    },
                  }}
                  muiTableBodyProps={{
                    sx: (theme) => ({
                      '& tr:nth-of-type(odd)': {
                        backgroundColor: darken(theme.palette.background.default, 0.05),
                      },
                    }),
                  }}
                  enableColumnFilterModes
                  enableColumnOrdering
                  enableGrouping
                  enablePinning
                  enableColumnResizing
                  initialState={{ density: 'compact' }}
                  positionToolbarAlertBanner="bottom"
                />
              )}
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

      {/* Report */}
      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onStop={(e, data) => {
          setModalPosition({ x: data.x, y: data.y })
        }}
      >
        <CModal
          alignment="center"
          visible={reportFormModalVisible}
          onClose={() => setReportFormModalVisible(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>Generate Report</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <RequiredNote />
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleReportSubmit}
            >
              <CCol md={6}>
                <CFormInput
                  type="date"
                  feedbackInvalid="Start Date is required"
                  id="start-date"
                  label={
                    <>
                      Start Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="start_date"
                  value={formReportData.start_date}
                  onChange={handleReportChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="date"
                  feedbackInvalid="End Date is required"
                  id="end-date"
                  label={
                    <>
                      End Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="end_date"
                  value={formReportData.end_date}
                  onChange={handleReportChange}
                  required
                />
              </CCol>

              <CCol md={12}>
                <CFormSelect
                  id="address"
                  label="Address"
                  name="address"
                  value={formReportData.address}
                  onChange={handleReportChange}
                >
                  <option value="">Choose...</option>
                  {barangayOptions.map((barangay) => (
                    <option key={barangay.id} value={barangay.id}>
                      {barangay.barangay}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <hr />
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  Generate
                </CButton>
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>
      </Draggable>

      {/* Adopt Form */}

      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onStop={(e, data) => {
          setModalPosition({ x: data.x, y: data.y })
        }}
      >
        <CModal
          alignment="center"
          visible={adoptFormModalVisible}
          onClose={() => setAdoptFormModalVisible(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>Adopt/Claim</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <RequiredNote />
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleAdoptClaimSubmit}
            >
              <CCol md={12}>
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
                  value={formAdoptData.date}
                  onChange={handleAdoptChange}
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
                  value={formAdoptData.owner_name}
                  onChange={handleAdoptChange}
                  required
                />
              </CCol>

              <CCol md={12}>
                <CFormSelect
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
                  value={formAdoptData.address}
                  onChange={handleAdoptChange}
                  required
                  feedbackInvalid="Address is required"
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
                <CFormSelect
                  feedbackInvalid="Sex is required"
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
                  <option value="Adopt">Adopt</option>
                  <option value="Claim">Claim</option>
                </CFormSelect>
              </CCol>
              <hr />
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  Generate
                </CButton>
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>
      </Draggable>

      {/* Disposed */}

      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onStop={(e, data) => {
          setModalPosition({ x: data.x, y: data.y })
        }}
      >
        <CModal
          alignment="center"
          visible={disposedFormModalVisible}
          onClose={() => setDisposedFormModalVisible(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>Disposed Dog</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <RequiredNote />
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleDisposedSubmit}
            >
              <CCol md={12}>
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
                  value={formDisposedData.date}
                  onChange={handleDisposedChange}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Name of the Medicine is required"
                  id="medicine-name"
                  label={
                    <>
                      Name of the Medicine
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="medicine"
                  value={formDisposedData.medicine}
                  onChange={handleDisposedChange}
                  required
                />
              </CCol>
              <hr />
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  Generate
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
