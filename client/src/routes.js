import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Pending = React.lazy(() => import('./views/pending/Pending'))
const Dog_pound = React.lazy(() => import('./views/manage_dog/dog_pound/Dog_pound'))
const AdoptClaim = React.lazy(() => import('./views/manage_dog/adoptclaim/AdoptClaim'))
const Disposed = React.lazy(() => import('./views/manage_dog/disposed/Disposed'))
const Anti_rabies_vaccination = React.lazy(() =>
  import('./views/anti_rabies_vaccination/Anti_rabies_vaccination'),
)
const Deworming = React.lazy(() => import('./views/deworming/Deworming'))
const Barangay = React.lazy(() => import('./views/barangay/Barangay'))
const User = React.lazy(() => import('./views/user/User'))
const DatabaseBackup = React.lazy(() => import('./views/database_backup/DatabaseBackup'))
const AntiRabiesSpecies = React.lazy(() => import('./views/species/AntiRabiesSpecies'))
const DewormSpecies = React.lazy(() => import('./views/species/DewormSpecies'))
const Medication = React.lazy(() => import('./views/medication/Medication'))
const ActivityLog = React.lazy(() => import('./views/activity_log/ActivityLog'))
const Config = React.lazy(() => import('./views/config/Config'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/pending', name: 'Pending', element: Pending },
  { path: '/manage_dog', name: 'Manage Dog', element: Dog_pound, exact: true },
  { path: '/manage_dog/dog_pound', name: 'Dog Pound', element: Dog_pound },
  { path: '/manage_dog/adopt_claim', name: 'Adopt/Claim', element: AdoptClaim },
  { path: '/manage_dog/disposed', name: 'Disposed Dogs', element: Disposed },
  {
    path: '/anti_rabies_vaccination',
    name: 'Anti Rabies Vaccination',
    element: Anti_rabies_vaccination,
  },
  { path: '/deworming', name: 'Deworming', element: Deworming },
  { path: '/user', name: 'User', element: User },
  { path: '/database_backup', name: 'Database Backup', element: DatabaseBackup },
  { path: '/activity_log', name: 'Activity Log', element: ActivityLog },
  { path: '/species', name: 'Sepcies', element: AntiRabiesSpecies, exact: true },
  { path: '/species/anti_rabies', name: 'Anti Rabies Species', element: AntiRabiesSpecies },
  { path: '/species/deworming', name: 'Deworm Species', element: DewormSpecies },
  { path: '/medication', name: 'Medication', element: Medication },
  { path: '/config', name: 'Config', element: Config },
  { path: '/barangay', name: 'Barangay', element: Barangay },
]

export default routes
