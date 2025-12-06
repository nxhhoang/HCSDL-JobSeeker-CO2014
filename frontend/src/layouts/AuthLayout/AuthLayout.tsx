import { Outlet } from 'react-router-dom'
import RegisterHeader from 'src/components/RegisterHeader'
import Footer from 'src/components/Footer'

export default function AuthLayout() {
  return (
    <div>
      <RegisterHeader />
      <Outlet />
      <Footer />
    </div>
  )
}