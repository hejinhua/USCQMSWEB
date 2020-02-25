import React from 'react'

const DataStats = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        src='http://192.168.2.93:8080/webroot/decision/view/report?viewlet=Form3.frm'
        width='100%'
        height='100%'
        title='report'
      />
    </div>
  )
}

export default DataStats
