import React, { useEffect, useState } from 'react'
import MaterialReactTable from 'material-react-table'
import { ExportToCsv } from 'export-to-csv'
import { OroquietaCityLogo, cityVetLogo } from './../../helper/LogoReport'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { MenuItem, ListItemIcon, Box, darken } from '@mui/material'
import RequiredNote from './../../helper/RequiredNote'
import ConvertToTitleCase from './../../helper/ConvertToTitleCase'
import FormatDateTime from './../../helper/FormatDateTime'
import FormatDate from './../../helper/FormatDate'
import GetErrorMessage from './../../helper/GetErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCirclePlus,
  faFileExcel,
  faFilePdf,
  faInfoCircle,
  faPlus,
  faPlusCircle,
  faQuestion,
  faQuestionCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ip from './../../constant/ip'
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
  CInputGroup,
  CFormLabel,
  CTooltip,
} from '@coreui/react'

const MySwal = withReactContent(Swal)
pdfMake.vfs = pdfFonts.pdfMake.vfs
const Deworming = () => {
  const table = 'deworming'
  const [data, setData] = useState([])
  const [newDataFormModalVisible, setNewDataFormModalVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [reportFormModalVisible, setReportFormModalVisible] = useState(false)
  const [barangayOptions, setBarangayOptions] = useState([])
  const [speciesOptions, setSpeciesOptions] = useState([])
  const [medicationOptions, setMedicationOptions] = useState([])
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({
    date_deworming: '',
    address: '',
    farmer_name: '',
    species: '',
    head_number: '',
    treatment: '',
    inputs: [{ id: 1, value: '' }],
    female: '',
    male: '',
  })
  const [formReportData, setFormReportData] = useState({
    start_date: '2022-12-12',
    end_date: '2023-12-12',
    address: '1',
    species: '2',
  })
  const [selectedItemId, setSelectedItemId] = useState(null)

  useEffect(() => {
    fetchData()
    fetchBarangay()
    fetchSpecies()
    fetchMedication()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(ip + table)
      const formattedData = response.data.map((item) => ({
        ...item,
        date_deworming: FormatDate(item.date_deworming),
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
      const response = await axios.get(ip + 'deworm_species')
      setSpeciesOptions(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchMedication = async () => {
    try {
      const response = await axios.get(ip + 'medication')
      setMedicationOptions(response.data)
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

  const handleReport = () => {
    setReportFormModalVisible(true)
  }

  const handleReportSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      const formData = new FormData(form)
      const start_date = formData.get('start_date')
      const end_date = formData.get('end_date')
      const address = formData.get('address')
      const species = formData.get('species')
      generateReport({ start_date, end_date, address, species })
      // generateReport(_table, 2023, start_date, end_date, address, species)
    }
    setValidated(true)
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
        { text: "Farmer's Name", style: 'tableHeader', bold: true },
        { text: 'Species', style: 'tableHeader', bold: true },
        { text: 'Head(s)', style: 'tableHeader', bold: true },
        { text: 'Treatment', style: 'tableHeader', bold: true },
        { text: 'Amount', style: 'tableHeader', bold: true },
      ]
      content.push(tableHeader)

      // Add table rows
      for (const item of response.data) {
        const tableRow = [
          item.farmer_name,
          item.species,
          item.head_number,
          item.treatment,
          item.amount,
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
            columns: [
              {
                text: 'ANTI-RABIES VACCINATION\n',
                style: 'headerText',
                bold: true,
                alignment: 'center',
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const _formData = new FormData(form)
    const date_deworming = _formData.get('date_deworming')
    const address = _formData.get('address')
    const farmer_name = _formData.get('farmer_name')
    const species = _formData.get('species')
    const head_number = _formData.get('head_number')
    const amount = formData.inputs
      .map((input) => input.value)
      .join(', ')
      .replace(/\s+/g, '')
    const treatment = _formData.get('treatment')
    const female = _formData.get('female')
    const male = _formData.get('male')

    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        if (selectedItemId) {
          // Update operation
          await updateData({
            date_deworming,
            address,
            farmer_name,
            species,
            head_number,
            amount,
            treatment,
            female,
            male,
            id: selectedItemId,
          })
        } else {
          // Add operation
          // Add operation
          await addData({
            date_deworming,
            address,
            farmer_name,
            species,
            head_number,
            amount,
            treatment,
            female,
            male,
          })
          // setFormData({
          //   ...formData,
          //   date_deworming: '',
          //   address: '',
          //   farmer_name: '',
          //   species: '',
          //   head_number: '',
          //   treatment: '',
          //   inputs: [{ id: 1, value: '' }],
          //   female: '',
          //   male: '',
          // })
          setValidated(false)
        }

        // Fetch updated data
        fetchData()

        setValidated(true)
        // setNewDataFormModalVisible(false)
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

  const handleInputChange = (e, index) => {
    const { value } = e.target
    const updatedInputs = [...formData.inputs]
    updatedInputs[index].value = value
    setFormData({ ...formData, inputs: updatedInputs })
  }

  const handleAddInput = () => {
    const newInput = { id: formData.inputs.length + 1, value: '' }
    setFormData({ ...formData, inputs: [...formData.inputs, newInput] })
  }
  const handleRemoveInput = (id) => {
    const updatedInputs = formData.inputs.filter((input) => input.id !== id)
    setFormData({ ...formData, inputs: updatedInputs })
  }

  const columns = [
    {
      accessorKey: 'date_deworming',
      header: 'Date of Deworming',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'farmer_name',
      header: 'Name of Farmer',
    },
    {
      accessorKey: 'species',
      header: 'Species',
    },
    {
      accessorKey: 'head_number',
      header: 'Head(s)',
    },
    {
      accessorKey: 'female',
      header: 'Female(s)',
    },
    {
      accessorKey: 'male',
      header: 'Male(s)',
    },
    {
      accessorKey: 'treatment',
      header: 'Treament and Amount',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
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
          date_deworming: item.date_deworming,
          address: item.address,
          farmer_name: item.farmer_name,
          species: item.species,
          head_number: item.head_number,
          treatment: item.treatment,
          amount: item.amount,
          sex: item.sex,
          created_at: item.created_at,
        }
      })

    csvExporter.generateCsv(exportedData)
  }
  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        date_deworming: item.date_deworming,
        address: item.address,
        farmer_name: item.farmer_name,
        species: item.species,
        head_number: item.head_number,
        treatment: item.treatment,
        amount: item.amount,
        sex: item.sex,
        created_at: item.created_at,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Deworming</strong>
            <CButton color="success" variant="outline" className="float-end" onClick={handleReport}>
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
          </CCardHeader>
          <CCardBody>
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
                      const dateString = rowData.date_deworming

                      // convert amount value to array
                      const inputs = rowData.amount.split(',').map((value, index) => ({
                        id: index + 1,
                        value,
                      }))

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
                        date_deworming: updatedFormattedDate,
                        address: rowData.address,
                        farmer_name: rowData.farmer_name,
                        species: rowData.species,
                        female: rowData.female,
                        male: rowData.male,
                        head_number: rowData.head_number,
                        treatment: rowData.treatment,
                        inputs: inputs,
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
              renderTopToolbarCustomActions={({ table }) => (
                <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                  <CButton size="md" className="btn-info text-white" onClick={handleExportData}>
                    <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                  </CButton>
                  <CButton
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
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Name of Farmer is required"
                  id="farmer-name"
                  label={
                    <>
                      Name of Farmer
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="farmer_name"
                  value={formData.farmer_name}
                  onChange={handleChange}
                  required
                />
              </CCol>

              <CCol md={7}>
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
              <CCol md={5}>
                <CFormInput
                  type="date"
                  feedbackInvalid="Date of Deworming is required"
                  id="date-deworming"
                  label={
                    <>
                      Date of Deworming
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="date_deworming"
                  value={formData.date_deworming}
                  onChange={handleChange}
                  required
                />
              </CCol>

              <CCol md={7}>
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
              <CCol md={5}>
                <CFormInput
                  type="number"
                  feedbackInvalid="Number of Heads is required"
                  id="head-number"
                  label={
                    <>
                      Number of Heads
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="head_number"
                  value={formData.head_number}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  min="1"
                  feedbackInvalid="Number of Female is required"
                  id="female-number"
                  label="Number of Female"
                  name="female"
                  value={formData.female}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  min="1"
                  feedbackInvalid="Number of Male is required"
                  id="male-number"
                  label="Number of Male"
                  name="male"
                  value={formData.male}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Treatment is required"
                  id="treatment"
                  label={
                    <>
                      Treatment
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  {medicationOptions.map((medication) => (
                    <option key={medication.id} value={medication.id}>
                      {medication.medication}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* Dynamic Inputs */}
              {formData.inputs.map((input) => {
                if (input.id === 1) {
                  return (
                    <CCol md={12} key={input.id}>
                      <CFormLabel htmlFor="basic-url">
                        Amount
                        <CTooltip
                          className="bg-info"
                          content="Reminder: Please remember to separate the numbers and units of measurement when entering the input values. 
                        For example, enter 1 mg or 10 sachet with a space between the number and the unit. This will help ensure accurate calculations and prevent any issues during data processing."
                          placement="right"
                        >
                          <sup>
                            <FontAwesomeIcon className="text-info" size="lg" icon={faInfoCircle} />
                          </sup>
                        </CTooltip>
                      </CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          type="text"
                          name="input"
                          value={input.value}
                          onChange={(e) => handleInputChange(e, input.id - 1)}
                        />
                        <CTooltip content="Add Input" placement="top">
                          <CButton
                            type="button"
                            color="primary"
                            variant="outline"
                            onClick={handleAddInput}
                          >
                            <FontAwesomeIcon size="lg" icon={faCirclePlus} />
                          </CButton>
                        </CTooltip>
                      </CInputGroup>
                    </CCol>
                  )
                } else {
                  return (
                    <CCol md={12} key={input.id}>
                      <CFormLabel htmlFor="basic-url">Amount</CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          type="text"
                          name="input"
                          value={input.value}
                          onChange={(e) => handleInputChange(e, input.id - 1)}
                        />
                        <CTooltip content="Remove Input" placement="top">
                          <CButton
                            type="button"
                            color="danger"
                            variant="outline"
                            onClick={() => handleRemoveInput(input.id)}
                          >
                            <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                          </CButton>
                        </CTooltip>
                      </CInputGroup>
                    </CCol>
                  )
                }
                return null
              })}

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
                  feedbackInvalid="OR # is required"
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
                  feedbackInvalid="OR # is required"
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
                  feedbackInvalid="Address is required"
                  label={
                    <>
                      Address
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="address"
                  value={formReportData.address}
                  onChange={handleReportChange}
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
                <CFormSelect
                  feedbackInvalid="Species is required"
                  id="species"
                  label="Species"
                  name="species"
                  value={formReportData.species}
                  onChange={handleReportChange}
                >
                  <option value="">Choose...</option>
                  {speciesOptions.map((species) => (
                    <option key={species.id} value={species.id}>
                      {species.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <hr />
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  <FontAwesomeIcon icon={faFilePdf} /> Generate Report
                </CButton>
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>
      </Draggable>
    </CRow>
  )
}

export default Deworming
