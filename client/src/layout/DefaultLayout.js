import React, { useState, useEffect, Component } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import ip from './../constant/ip'
import axios from 'axios'
import { Login } from '@mui/icons-material'
import Pending from 'src/views/pending/Pending'
const DefaultLayout = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      axios
        .get(ip + 'users/authinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }, [])
  return (
    <div>
      {!user ? (
        <Login />
      ) : user.status === 'Pending' ? (
        <>
          <AppSidebar userInfo={user} />
          <div className="wrapper d-flex flex-column min-vh-100 bg-light">
            <AppHeader userInfo={user} />
            <div className="body flex-grow-1 px-3">
              <Pending userInfo={user} />
            </div>
            <AppFooter />
          </div>
        </>
      ) : (
        <>
          <AppSidebar userInfo={user} />
          <div className="wrapper d-flex flex-column min-vh-100 bg-light">
            <AppHeader userInfo={user} />
            <div className="body flex-grow-1 px-3">
              <AppContent userInfo={user} />
            </div>
            <AppFooter />
          </div>
        </>
      )}
    </div>
  )
}

export default DefaultLayout
