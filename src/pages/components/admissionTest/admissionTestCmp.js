import React from 'react'
import 'ant-design-pro/dist/ant-design-pro.css' // 统一pro引入样式
import AdmissionTestForm from './admissionTestForm';

const AdmissionTestCmp = ({ toDoList }) => {

  return (
    <div
      style={{
        display: 'inline',
        color: '#000000'
      }}
    >
      <AdmissionTestForm/>
    </div>
  )
}

export default AdmissionTestCmp
