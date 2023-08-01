import React from 'react'
import { CButton, CCard, CCardHeader, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ip from './../../constant/ip'

const DatabaseBackup = () => {
  const table = 'backup'
  const handleBackup = () => {
    axios
      .get(ip + table) // Replace this with the actual URL of your Express.js server
      .then((response) => {
        // Trigger the download of the backup file
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'backup.sql') // Change this to the desired backup file name
        document.body.appendChild(link)
        link.click()
      })
      .catch((error) => {
        console.error('Error backing up database:', error)
      })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Database Backup</strong>
            <CButton color="primary" className="float-end" onClick={handleBackup}>
              <FontAwesomeIcon icon={faDatabase} /> Backup
            </CButton>
          </CCardHeader>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DatabaseBackup
