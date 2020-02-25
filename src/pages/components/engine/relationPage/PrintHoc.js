/*
 * @Author: hjh
 * @Date: 2019-07-24 15:58:23
 * @LastEditTime : 2019-12-25 21:21:07
 * @Descripttion: 打印页面高阶组件
 */
import React, { Component, Fragment } from 'react'

const PrintHoc = engine => WrappedComponent => {
  return class extends Component {
    render() {
      const { selectedRows = [], printData = [] } = this.props.model
      let { REPUNIT } = selectedRows[0] || {}
      const { clickButton = {} } = engine
      const { implclass } = clickButton || {}
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const employeeName = localStorage.getItem('employeeName')
      const cmp = printData.map((item, index) => {
        const {
          SCOPE,
          RECORDNO,
          LOSSWKHOURS,
          LABORCOST,
          MATECOST,
          FUELCOST,
          TESTCOST,
          TRANCOST,
          MANAGECOST,
          CONSCOST,
          APSCOST,
          TESTFEE,
          MEETCOST,
          RECIEWCOST,
          TRAVELCOST,
          SAMPLECOST,
          OTHERCOST,
          TOTALCOST,
          CARMODEL,
          PARTNAME,
          DIESELMODELS,
          CTCODE,
          NUM,
          PRODUCTNO,
          TYPECODE,
          RQCODE,
          SNUMBER,
          QPDESCRIPTION,
          RESPONSIBILITY_DEPT,
          REMARK
        } = item
        REPUNIT = item.REPUNIT
        return (
          <tr>
            <td>{index + 1}</td>
            <td>{REPUNIT}</td>
            <td>{SCOPE}</td>
            <td>{RECORDNO}</td>
            <td>{MATECOST}</td>
            <td>{CARMODEL}</td>
            <td>{PARTNAME}</td>
            <td>{NUM}</td>
            <td>{LOSSWKHOURS}</td>
            <td>{LABORCOST}</td>
            <td>{FUELCOST}</td>
            <td>{TESTCOST}</td>
            <td>{TRANCOST}</td>
            <td>{MANAGECOST}</td>
            <td>{CONSCOST}</td>
            <td>{APSCOST}</td>
            <td>{TESTFEE}</td>
            <td>{MEETCOST}</td>
            <td>{RECIEWCOST}</td>
            <td>{TRAVELCOST}</td>
            <td>{SAMPLECOST}</td>
            <td>{OTHERCOST}</td>
            <td>{TOTALCOST}</td>
            <td>{DIESELMODELS}</td>
            <td>{CTCODE}</td>
            <td>{PRODUCTNO}</td>
            <td></td>
            <td>{TYPECODE}</td>
            <td>{RQCODE}</td>
            <td>{2 + index}</td>
            <td>{index + 20}</td>
            <td>{QPDESCRIPTION}</td>
            <td></td>
            <td>{RESPONSIBILITY_DEPT}</td>
            <td>{REMARK}</td>
          </tr>
        )
      })
      return (
        <div id='print-content'>
          {implclass === 'com.usc.app.action.demo.zc.ZLSSINFOAction' ? (
            <Fragment>
              <div
                style={{
                  width: '100%',
                  height: '50px',
                  lineHeight: '50px',
                  fontSize: '26px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                厂内供方（外包方）产品质量损失信息反馈单
              </div>
              <div style={{ fontWeight: 'bold' }}>填报单位：{REPUNIT}</div>
              <table className='print_table' style={{ width: '100%', height: '500px', border: '1px solid #000' }}>
                <tr>
                  <td style={{ width: '300px' }}>供应商（外包商）名称</td>
                  <td></td>
                </tr>
                <tr>
                  <td>故障件名称</td>
                  <td></td>
                </tr>
                <tr>
                  <td>故障情况</td>
                  <td></td>
                </tr>
                <tr>
                  <td>原因分析</td>
                  <td>
                    <div style={{ height: '100px' }}></div>
                    <div style={{ textAlign: 'left' }}>
                      <span>填报人: {employeeName}</span>
                      <span style={{ marginLeft: '400px' }}>
                        {year} 年 {month} 月 {day} 日
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>经济损失（详细说明损失构成如：人工、材料、动能、运输等费用）</td>
                  <td>
                    <div style={{ height: '100px' }}></div>
                    <div style={{ textAlign: 'left' }}>
                      <span>经办人:</span>
                      <span style={{ marginLeft: '200px' }}>主管:</span>
                      <span style={{ marginLeft: '200px' }}>
                        {year} 年 {month} 月 {day} 日
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
              <div style={{ fontWeight: 'bold' }}>
                说明：该产品质量损失信息反馈单一式三份，自己保存一份，一份提供给采购中心（项目中心），一份提供给质量保证部
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div
                style={{
                  width: '100%',
                  height: '50px',
                  lineHeight: '50px',
                  fontSize: '26px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                质量损失统计表
              </div>
              <table className='print_table' style={{ width: '100%', height: '500px', border: '1px solid #000' }}>
                <tr>
                  <th colSpan='35'>
                    <span style={{ float: 'left' }}>填报单位：{REPUNIT} </span>
                    <span style={{ float: 'right' }}>月份</span>
                  </th>
                </tr>
                <tr>
                  <td rowSpan='2'>序号</td>
                  <td rowSpan='2'>填报单位</td>
                  <td rowSpan='2'>归集范围</td>
                  <td rowSpan='2'>废品（返修）记录编号</td>
                  <td rowSpan='2'>产品编号</td>
                  <td rowSpan='2'>产品名称</td>
                  <td colSpan='17'>分项损失构成（单位：元）</td>
                  <td rowSpan='2'>机车型号</td>
                  <td colSpan='5'>质量损失类别编号</td>
                  <td rowSpan='2'>年份号</td>
                  <td rowSpan='2'>流水号</td>
                  <td rowSpan='2'>质量问题简述</td>
                  <td rowSpan='2'>业务板块归类</td>
                  <td rowSpan='2'>责任单位</td>
                  <td rowSpan='2'>备注</td>
                </tr>
                <tr>
                  <td>数量</td>
                  <td>损失工时</td>
                  <td>人工费用</td>
                  <td>材料（配件）费用</td>
                  <td>动能（燃料）费</td>
                  <td>检验（试验）费</td>
                  <td>运输（仓储）费</td>
                  <td>管理费</td>
                  <td>咨询费</td>
                  <td>鉴定费</td>
                  <td>试验费</td>
                  <td>会务费</td>
                  <td>评审费</td>
                  <td>差旅费</td>
                  <td>样件（工装、工件）费</td>
                  <td>其它费用</td>
                  <td>损失费用合计</td>
                  <td>修造类型代码</td>
                  <td>产品图号</td>
                  <td>填报单位代码</td>
                  <td>类别代码</td>
                  <td>原因代码</td>
                </tr>
                {cmp}
                <tr>
                  <td colSpan='35'>
                    <span style={{ float: 'left' }}>填报人：{employeeName}</span>
                    <span style={{ float: 'left', marginLeft: '400px' }}>填报单位领导：</span>
                    <span style={{ float: 'right' }}>
                      日期：{year} 年 {month} 月 {day} 日
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colSpan='35' style={{ textAlign: 'left' }}>
                    <p>填写要求：1、“归集范围”栏根据实际情况属于内部质量损失的填写“内”、属于外部损失的填写“外”</p>
                    <p>
                      2、“类别代码”栏根据实际情况填写数字代码（1-报废、2-返工返修 3-内部质量收入 4-质量问题整治
                      5-用户索赔 6-外部质量收入）
                    </p>
                    <p>
                      3、“原因代码”栏根据问题发生的原因填写字母代码（A-设计差错、 B-工艺差错、 C-制造差错
                      D-代表中车内部供方原因（即供方为中车所属子公司的）
                      E-代表中车外部供方原因（即供方不是中车所属子公司的） F-代表其他原因（若涉及到多种原因，分别填写）
                    </p>
                    <p>
                      4、“业务板块归类”栏根据实际情况填写罗马数字代码（Ⅰ国内新造机车、Ⅱ国内检修机车、Ⅲ国内新造系统和配件、Ⅳ国内检修系统和配件、Ⅴ新产业、Ⅵ海外新造机车、Ⅶ海外检修机车、Ⅷ海外新造系统和配件、Ⅸ海外检修系统和配件）
                    </p>
                    <p>5、修造类型代码： 1-新造、2-大修、3-轻大修、4-中修、5-二年检或四年检</p>
                  </td>
                </tr>
              </table>
            </Fragment>
          )}

          <WrappedComponent />
          <iframe title='printf' id='printf' src='' width='0' height='0' frameborder='0'></iframe>
        </div>
      )
    }
  }
}
export default PrintHoc
