import React from 'react'

const SupplierRate = () => {
  let href = window.location.href
  let src = href.split('//')[1].split(':')[0]
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        src={`http://${src}:8080/webroot/decision/view/report?viewlet=供应商交货合格率.frm`}
        width='100%'
        height='100%'
        title='report'
      />
    </div>
  )
}

export default SupplierRate
