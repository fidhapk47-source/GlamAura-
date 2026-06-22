import React from 'react'
import AdminSidebar from './AdminSidebar'

function Adminlayout({children}) {
    const handleLogout = () =>{
        localStorage.removeItem("isAdmin")
        window.location.href="/admin/login"
    }
  return (
    <div style={{
        display:"flex"
    }}>
      <AdminSidebar onLogout={handleLogout} />

      <div style={{ marginLeft:"260px",padding:"20px",width:"100%"}}>
        {children}
      </div>
    </div>
  )
}

export default Adminlayout
