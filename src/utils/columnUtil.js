import { Checkbox, Rate, Tooltip, Input, Button, Icon } from 'antd'

export const setColumn = (columns = []) => {
  let newColumns = []
  columns.forEach(item => {
    const { id, name, no, align, editParams, editor, width } = item
    let column = {
      key: id,
      title: name,
      dataIndex: no,
      align,
      ellipsis: true,
      width: Number(`${width}`),
      render(text) {
        let cmp = <span>{text}</span>
        let style = null
        if (editParams && JSON.parse(editParams)) {
          const params = JSON.parse(editParams).values
          if (params && params[0] && params[0].color) {
            const num = params.findIndex(item => item.name === text)
            if (num !== -1) style = { background: params[num].color }
          }
        } else if (editor === 'CheckBox') {
          cmp = <Checkbox checked={text} />
        } else if (editor === 'Rate') {
          cmp = <Rate value={text} disabled />
        }
        return (
          <Tooltip title={cmp} style={style}>
            {cmp}
          </Tooltip>
        )
      }
    }
    newColumns.push(column)
  })
  return newColumns
}

// 表格列搜索
export const getColumnSearchProps = (dataIndex, title) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`搜索 ${title}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm)}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Button
        type='primary'
        onClick={() => handleSearch(selectedKeys, confirm)}
        icon='search'
        size='small'
        style={{ width: 90, marginRight: 8 }}
      >
        搜索
      </Button>
      <Button onClick={() => handleReset(clearFilters)} size='small' style={{ width: 90 }}>
        重置
      </Button>
    </div>
  ),
  filterIcon: filtered => <Icon type='search' style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) =>
    record[dataIndex] &&
    record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase())
})

const handleSearch = (selectedKeys, confirm) => {
  confirm()
}

const handleReset = clearFilters => {
  clearFilters()
}
