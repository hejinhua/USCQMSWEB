import React from 'react'

const QcCostStatistics = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        src='http://localhost:8080/webroot/decision/view/report?viewlet=质量成本统计.frm'
        width='100%'
        height='100%'
        title='report'
      />
    </div>
  )
}

export default QcCostStatistics
