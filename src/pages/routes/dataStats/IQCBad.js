import React from 'react'

const IQCBad = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        src='http://localhost:8080/webroot/decision/view/report?viewlet=IQC不良分布.frm'
        width='100%'
        height='100%'
        title='report'
      />
    </div>
  )
}

export default IQCBad
