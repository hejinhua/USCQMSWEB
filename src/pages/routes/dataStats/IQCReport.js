import React from 'react'

const IQCReport = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        src='http://localhost:8080/webroot/decision/view/report?viewlet=IQC检验报表.frm'
        width='100%'
        height='100%'
        title='report'
      />
    </div>
  )
}

export default IQCReport
