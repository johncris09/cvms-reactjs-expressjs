import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CAlertHeading,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import { faCancel } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Draggable from 'react-draggable'
import RequiredNote from 'src/helper/RequiredNote'
import ip from './../../constant/ip'
import axios from 'axios'

const Dashboard = () => {
  const antiRabiesDefaultId = 3
  const antiRabiesDefaultvalue = 'Dog'
  const dewormingDefaultId = 1
  const dewormingDefaultvalue = 'Carabao'
  const [status, setStatus] = useState(null)
  const [email, setEmail] = useState(null)
  const [dogPoundData, setDogPoundData] = useState([])
  const [dogPoundTotalData, setDogPoundTotalData] = useState([])
  const [antiRabiesSpeciesOptions, setAntiRabiesSpeciesOptions] = useState([])
  const [dewormingSpeciesOptions, setDewormingOptions] = useState([])
  const [medicationOptions, setMedicationOptions] = useState([])
  const [selectedSpeciesAntiRabies, setSelectedSpeciesAntiRabies] = useState(antiRabiesDefaultId)
  const [antiRabiesDefaultLabel, setAntiRabiesDefaultLabel] = useState(antiRabiesDefaultvalue)
  const [antiRabiesData, setAntiRabiesData] = useState([])
  const [antiRabiesTotalData, setAntiRabiesTotalData] = useState([])
  const [selectedSpeciesDeworming, setSelectedSpeciesDeworming] = useState(dewormingDefaultId)
  const [dewormingDefaultLabel, setDewormingDefaultLabel] = useState(dewormingDefaultvalue)
  const [dewormingData, setDewormingData] = useState([])
  const [dewormingTotalData, setDewormingTotalData] = useState([])
  const [dogPoundFormModalVisible, setDogPoundFormModalVisible] = useState(false)
  const [antiRabiesFormModalVisible, setAntiRabiesFormModalVisible] = useState(false)
  const [dewormingFormModalVisible, setDewormingFormModalVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const navigate = useNavigate()
  const [formDogPoundData, setFormDogPoundData] = useState({
    start_date: '',
    end_date: '',
  })
  const [formAntiRabiesData, setFormAntiRabiesData] = useState({
    species: selectedSpeciesAntiRabies,
    neutered: '',
    start_date: '',
    end_date: '',
  })
  const [formDewormingData, setFormDewormingData] = useState({
    species: selectedSpeciesDeworming,
    medication: '',
    start_date: '',
    end_date: '',
  })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Check if the token is set in local storage or cookies
    const token = localStorage.getItem('token') // Assuming the token is stored in local storage

    if (!token) {
      // If the token is set, navigate to the dashboard
      navigate('/login', { replace: true })
    }

    fetchDewormingSpecies()
    fetchDogPoundData()
    fetchMedication()
    fetchAntiRabiesData()
    fetchDewormingData()
    fetchAntiTabiesSpecies()
  }, [navigate]) //, dogPoundData, antiRabiesData, dewormingData])

  const fetchDogPoundData = async () => {
    try {
      const maleCounts = []
      const femaleCounts = []
      let totalMaleCount = 0
      let totalFemaleCount = 0

      const fetchBarangay = await axios.get(ip + 'barangay')
      const barangay = Object.values(fetchBarangay.data).map((barangay) => barangay.barangay)

      // dogPoundData
      const fetchDogPound = await axios.get(ip + 'dog_pound')
      const dogPounds = Object.values(fetchDogPound.data)
      for (const dogPound of dogPounds) {
        const { address, sex, date } = dogPound
        const dogPoundDate = new Date(date).getFullYear()
        const startDate = formDogPoundData.start_date ? new Date(formDogPoundData.start_date) : null
        const endDate = formDogPoundData.end_date ? new Date(formDogPoundData.end_date) : null

        if (
          selectedYear == dogPoundDate &&
          (startDate === null || endDate === null
            ? true
            : new Date(date) >= startDate && new Date(date) <= endDate)
        ) {
          // Find the corresponding barangay for the current dog pound
          const index = barangay.indexOf(address)
          if (index !== -1) {
            if (sex === 'Male') {
              totalMaleCount++
              maleCounts[index] = (maleCounts[index] || 0) + 1
            } else if (sex === 'Female') {
              totalFemaleCount++
              femaleCounts[index] = (femaleCounts[index] || 0) + 1
            }
          }
        }
      }

      const dogPoundData = {
        labels: barangay,
        datasets: [
          {
            label: 'Male',
            backgroundColor: '#799ff8',
            data: maleCounts,
          },
          {
            label: 'Female',
            backgroundColor: '#f87979',
            data: femaleCounts,
          },
        ],
      }
      setDogPoundData(dogPoundData)
      setDogPoundTotalData({
        male: totalMaleCount.toLocaleString(),
        female: totalFemaleCount.toLocaleString(),
      })
    } catch (error) {
      console.info(error)
    }
  }

  const fetchAntiRabiesData = async () => {
    try {
      const maleCounts = []
      const femaleCounts = []
      let totalMaleCount = 0
      let totalFemaleCount = 0

      const fetchBarangay = await axios.get(ip + 'barangay')
      const barangay = Object.values(fetchBarangay.data).map((barangay) => barangay.barangay)

      // fetch anti rabies data
      const fetchAntiRabiesVaccination = await axios.get(ip + 'anti_rabies_vaccination')
      const antiRabies = Object.values(fetchAntiRabiesVaccination.data)

      for (const anti_rabies of antiRabies) {
        // const { address, sex, speciesId } = anti_rabies

        const { address, sex, timestamp, species, date_vaccinated, neutered, speciesId } =
          anti_rabies
        const startDate = formAntiRabiesData.start_date
          ? new Date(formAntiRabiesData.start_date)
          : null
        const endDate = formAntiRabiesData.end_date ? new Date(formAntiRabiesData.end_date) : null
        const antiRabiesSpecies = formAntiRabiesData.species ? formAntiRabiesData.species : null
        const speciesNeutered = formAntiRabiesData.neutered ? formAntiRabiesData.neutered : null
        if (
          selectedYear == new Date(date_vaccinated).getFullYear() &&
          (startDate === null || endDate === null
            ? true
            : new Date(date_vaccinated) >= startDate && new Date(date_vaccinated) < endDate) &&
          (speciesNeutered === null ? true : speciesNeutered === neutered)
        ) {
          if (speciesId == antiRabiesSpecies) {
            // Find the corresponding barangay for the current anti rabies
            const index = barangay.indexOf(address)
            if (index !== -1) {
              if (sex === 'Male') {
                totalMaleCount++
                maleCounts[index] = (maleCounts[index] || 0) + 1
              } else if (sex === 'Female') {
                totalFemaleCount++
                femaleCounts[index] = (femaleCounts[index] || 0) + 1
              }
            }
          }
        }
      }
      // console.info(maleCounts)
      const _antiRabiesData = {
        labels: barangay,
        datasets: [
          {
            label: 'Male',
            backgroundColor: '#799ff8',
            data: maleCounts,
          },
          {
            label: 'Female',
            backgroundColor: '#f87979',
            data: femaleCounts,
          },
        ],
      }

      setAntiRabiesData(_antiRabiesData)
      setAntiRabiesTotalData({
        male: totalMaleCount.toLocaleString(),
        female: totalFemaleCount.toLocaleString(),
      })
    } catch (error) {
      console.info(error)
    }
  }

  const fetchDewormingData = async () => {
    try {
      const maleCounts = []
      const femaleCounts = []
      let totalMaleCount = 0
      let totalFemaleCount = 0

      const fetchBarangay = await axios.get(ip + 'barangay')
      const barangay = Object.values(fetchBarangay.data).map((barangay) => barangay.barangay)

      // fetch deworming data
      const fetchDeworming = await axios.get(ip + 'deworming')
      const deworming = Object.values(fetchDeworming.data)

      // Loop through each deworming
      for (const deworm of deworming) {
        const { address, female, male, speciesId } = deworm
        if (speciesId === formDewormingData.species) {
          // console.info(formDewormingData.species)
          // Find the corresponding barangay for the current deworming
          const index = barangay.indexOf(address)
          const femaleCount = parseInt(female) || 0
          const maleCount = parseInt(male) || 0
          femaleCounts[index] = (femaleCounts[index] || 0) + femaleCount
          maleCounts[index] = (maleCounts[index] || 0) + maleCount
          totalFemaleCount += femaleCount
          totalMaleCount += maleCount
        }
      }

      const _dewormingData = {
        labels: barangay,
        datasets: [
          {
            label: 'Male',
            backgroundColor: '#799ff8',
            data: maleCounts,
          },
          {
            label: 'Female',
            backgroundColor: '#f87979',
            data: femaleCounts,
          },
        ],
      }

      setDewormingData(_dewormingData)
      setDewormingTotalData({
        male: totalMaleCount.toLocaleString(),
        female: totalFemaleCount.toLocaleString(),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAntiTabiesSpecies = async () => {
    try {
      const fetchAntiRabiesSpecies = await axios.get(ip + 'anti_rabies_species')
      const species = Object.values(fetchAntiRabiesSpecies.data).sort((a, b) =>
        a.name.localeCompare(b.name),
      )
      setAntiRabiesSpeciesOptions(species)
    } catch (error) {
      console.error('Error fetching species data:', error)
    }
  }

  const fetchDewormingSpecies = async () => {
    try {
      const fetchDewormSpecies = await axios.get(ip + 'deworm_species')
      const species = Object.values(fetchDewormSpecies.data).sort((a, b) =>
        a.name.localeCompare(b.name),
      )
      setDewormingOptions(species)
    } catch (error) {
      console.error('Error fetching species data:', error)
    }
  }

  const fetchMedication = async () => {
    try {
      const medicationSpecies = await axios.get(ip + 'medication')
      const medication = Object.values(medicationSpecies.data).sort((a, b) =>
        a.medication.localeCompare(b.medication),
      )
      setMedicationOptions(medication)
    } catch (error) {
      console.error('Error fetching medication data:', error)
    }
  }

  const handleDogPoundResetFilter = () => {
    setFormDogPoundData({ ...formDogPoundData, start_date: '', end_date: '' })
  }
  const handleDisplayAntiRabiesModal = () => {
    setAntiRabiesFormModalVisible(true)
  }
  const handleDisplayDogPoundModal = () => {
    setDogPoundFormModalVisible(true)
  }

  const handleAntiRabiesChange = (e) => {
    const { name, value } = e.target
    if (name === 'species') {
      const species = e.target.options[e.target.selectedIndex].text
      setAntiRabiesDefaultLabel(species)
    }

    setFormAntiRabiesData({ ...formAntiRabiesData, [name]: value })
  }
  const handleAntiRabiesResetFilter = () => {
    setFormAntiRabiesData({
      ...formAntiRabiesData,
      species: antiRabiesDefaultId,
      neutered: '',
      start_date: '',
      end_date: '',
    })
    const selectElement = document.getElementById('antiRabiesSelect')
    if (selectElement) {
      selectElement.value = antiRabiesDefaultId
    }
    // console.info(selectElement)
    // console.info(antiRabiesDefaultId)
    setAntiRabiesDefaultLabel(antiRabiesDefaultvalue)
  }

  const handleDisplayDewormingModal = () => {
    setDewormingFormModalVisible(true)
  }

  const handleDewormingChange = (e) => {
    const { name, value } = e.target
    if (name === 'species') {
      const species = e.target.options[e.target.selectedIndex].text
      setDewormingDefaultLabel(species)
    }
    setFormDewormingData({ ...formDewormingData, [name]: value })
  }
  const handleDewormingResetFilter = () => {
    setFormDewormingData({
      ...formDewormingData,
      species: dewormingDefaultId,
      start_date: '',
      end_date: '',
    })

    setDewormingDefaultLabel(dewormingDefaultvalue)
  }

  const handleDogPoundChange = (e) => {
    const { name, value } = e.target
    setFormDogPoundData({ ...formDogPoundData, [name]: value })
  }
  return (
    <CRow>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 id="dog-pound" className="card-title mb-0">
                  Dog Pound
                </h4>
                <div className="small text-medium-emphasis">
                  <strong>Male:</strong> {dogPoundTotalData.male} <br />
                  <strong>Female:</strong> {dogPoundTotalData.female}
                </div>
              </CCol>
              <CCol sm={7} className="d-md-block">
                <CButton
                  color="primary"
                  variant="outline"
                  className="float-end"
                  onClick={handleDisplayDogPoundModal}
                >
                  <CIcon icon={cilFilter} />
                </CButton>
              </CCol>
            </CRow>
            <CChartBar height={150} data={dogPoundData} labels="dog-pound" />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 id="anti-rabies" className="card-title mb-0">
                  Anti-Rabies ({antiRabiesDefaultLabel})
                </h4>
                <div className="small text-medium-emphasis">
                  <strong>Male:</strong> {antiRabiesTotalData.male} <br />
                  <strong>Female:</strong> {antiRabiesTotalData.female}
                </div>
              </CCol>
              <CCol sm={7} className="d-md-block">
                <CButton
                  color="primary"
                  variant="outline"
                  className="float-end"
                  onClick={handleDisplayAntiRabiesModal}
                >
                  <CIcon icon={cilFilter} />
                </CButton>
              </CCol>
            </CRow>
            <CChartBar data={antiRabiesData} height={150} labels="anti_tabies" />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 id="deworming" className="card-title mb-0">
                  Deworming({dewormingDefaultLabel})
                </h4>
                <div className="small text-medium-emphasis">
                  <strong>Male:</strong> {dewormingTotalData.male} <br />
                  <strong>Female:</strong> {dewormingTotalData.female}
                </div>
              </CCol>
              <CCol sm={7} className="d-md-block">
                <CButton
                  color="primary"
                  variant="outline"
                  className="float-end"
                  onClick={handleDisplayDewormingModal}
                >
                  <CIcon icon={cilFilter} />
                </CButton>
              </CCol>
            </CRow>
            <CChartBar data={dewormingData} height={150} labels="anti_tabies" />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Dog Pound Date Range */}
      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onStop={(e, data) => {
          setModalPosition({ x: data.x, y: data.y })
        }}
      >
        <CModal
          alignment="center"
          visible={dogPoundFormModalVisible}
          onClose={() => setDogPoundFormModalVisible(false)}
          backdrop="static"
          keyboard={false}
          size="md"
        >
          <CModalHeader>
            <CModalTitle>Filter</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <RequiredNote />
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                className="btn-sm"
                color="danger"
                variant="outline"
                onClick={handleDogPoundResetFilter}
              >
                <FontAwesomeIcon icon={faCancel} /> Reset Filter
              </CButton>
            </div>
            <CForm className="row g-3 needs-validation" noValidate validated={validated}>
              <CCol md={6}>
                <label htmlFor="startDate">
                  {
                    <>
                      Start Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                </label>
                <DatePicker
                  selected={formDogPoundData.start_date}
                  className="form-control"
                  onChange={(date) =>
                    handleDogPoundChange({ target: { name: 'start_date', value: date } })
                  }
                  selectsStart
                  startDate={formDogPoundData.start_date}
                  endDate={formDogPoundData.end_date}
                  name="start_date"
                  required
                />
              </CCol>
              <CCol md={6}>
                <label htmlFor="endDate">
                  {
                    <>
                      End Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                </label>
                <DatePicker
                  className="form-control"
                  selected={formDogPoundData.end_date}
                  onChange={(date) =>
                    handleDogPoundChange({ target: { name: 'end_date', value: date } })
                  }
                  selectsEnd
                  startDate={formDogPoundData.start_date}
                  endDate={formDogPoundData.end_date}
                  minDate={formDogPoundData.start_date}
                  name="end_date"
                  required
                />
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>
      </Draggable>

      {/* Anti-Rabies Date Range */}
      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onStop={(e, data) => {
          setModalPosition({ x: data.x, y: data.y })
        }}
      >
        <CModal
          alignment="center"
          visible={antiRabiesFormModalVisible}
          onClose={() => setAntiRabiesFormModalVisible(false)}
          backdrop="static"
          keyboard={false}
          size="md"
        >
          <CModalHeader>
            <CModalTitle>Filter</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <RequiredNote />
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                className="btn-sm"
                color="danger"
                variant="outline"
                onClick={handleAntiRabiesResetFilter}
              >
                <FontAwesomeIcon icon={faCancel} /> Reset Filter
              </CButton>
            </div>
            <CForm className="row g-3 needs-validation" noValidate validated={validated}>
              <CCol md={12}>
                <CFormSelect
                  size="xs"
                  label="Species"
                  name="species"
                  onChange={handleAntiRabiesChange}
                  id="antiRabiesSelect"
                >
                  <option disabled>Choose...</option>
                  {antiRabiesSpeciesOptions.map((species) => (
                    <option
                      selected={species.id == antiRabiesDefaultId && true}
                      key={species.id}
                      value={species.id}
                    >
                      {species.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={12}>
                <CFormSelect
                  size="xs"
                  label="Neutered"
                  name="neutered"
                  onChange={handleAntiRabiesChange}
                >
                  <option value="">Choose...</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <label htmlFor="startDate">
                  {
                    <>
                      Start Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                </label>
                <DatePicker
                  selected={formAntiRabiesData.start_date}
                  className="form-control"
                  onChange={(date) =>
                    handleAntiRabiesChange({ target: { name: 'start_date', value: date } })
                  }
                  selectsStart
                  startDate={formAntiRabiesData.start_date}
                  endDate={formAntiRabiesData.end_date}
                  name="start_date"
                  required
                />
              </CCol>
              <CCol md={6}>
                <label htmlFor="endDate">
                  {
                    <>
                      End Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                </label>
                <DatePicker
                  className="form-control"
                  selected={formAntiRabiesData.end_date}
                  onChange={(date) =>
                    handleAntiRabiesChange({ target: { name: 'end_date', value: date } })
                  }
                  selectsEnd
                  startDate={formAntiRabiesData.start_date}
                  endDate={formAntiRabiesData.end_date}
                  minDate={formAntiRabiesData.start_date}
                  name="end_date"
                  required
                />
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>
      </Draggable>

      {/* Deworming Date Range */}
      <Draggable
        handle=".modal-header"
        position={modalPosition}
        onStop={(e, data) => {
          setModalPosition({ x: data.x, y: data.y })
        }}
      >
        <CModal
          alignment="center"
          visible={dewormingFormModalVisible}
          onClose={() => setDewormingFormModalVisible(false)}
          backdrop="static"
          keyboard={false}
          size="md"
        >
          <CModalHeader>
            <CModalTitle>Filter</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <RequiredNote />
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                className="btn-sm"
                color="danger"
                variant="outline"
                onClick={handleDewormingResetFilter}
              >
                <FontAwesomeIcon icon={faCancel} /> Reset Filter
              </CButton>
            </div>
            <CForm className="row g-3 needs-validation" noValidate validated={validated}>
              <CCol md={12}>
                <CFormSelect
                  size="xs"
                  label="Species"
                  name="species"
                  onChange={handleDewormingChange}
                >
                  <option disabled>Choose...</option>
                  {dewormingSpeciesOptions.map((species) => (
                    <option key={species.id} value={species.id}>
                      {species.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={12}>
                <CFormSelect
                  size="xs"
                  label="Medication"
                  name="medication"
                  onChange={handleDewormingChange}
                >
                  <option value="">Choose...</option>
                  {medicationOptions.map((medicaton) => (
                    <option key={medicaton.id} value={medicaton.id}>
                      {medicaton.medication}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <label htmlFor="startDate">
                  {
                    <>
                      Start Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                </label>
                <DatePicker
                  selected={formDewormingData.start_date}
                  className="form-control"
                  onChange={(date) =>
                    handleDewormingChange({ target: { name: 'start_date', value: date } })
                  }
                  selectsStart
                  startDate={formDewormingData.start_date}
                  endDate={formDewormingData.end_date}
                  name="start_date"
                  required
                />
              </CCol>
              <CCol md={6}>
                <label htmlFor="endDate">
                  {
                    <>
                      End Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                </label>
                <DatePicker
                  className="form-control"
                  selected={formDewormingData.end_date}
                  onChange={(date) =>
                    handleDewormingChange({ target: { name: 'end_date', value: date } })
                  }
                  selectsEnd
                  startDate={formDewormingData.start_date}
                  endDate={formDewormingData.end_date}
                  minDate={formDewormingData.start_date}
                  name="end_date"
                  required
                />
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>
      </Draggable>
    </CRow>
  )
}

export default Dashboard
