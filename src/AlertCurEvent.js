import { Select, Input, Table, Button, Popconfirm, Dropdown, Tag } from 'antd'
import axios from 'axios'
import React from 'react'
import SilenceRuleCreateModal from './SilenceRuleCreateModal'
const { Search } = Input

class AlertHisEvent extends React.Component {

  state = {
    selectedRow: null,
    silenceVisible: false,
    visible: false,
    list: [],
    columns: [
      {
        title: '规则名称',
        dataIndex: 'rule_name',
        key: 'rule_name',
        width: 100,
      },
      {
        title: '指纹',
        dataIndex: 'fingerprint',
        key: 'fingerprint',
        width: 150,
      },
      {
        title: '数据源',
        dataIndex: 'datasourceId',
        key: 'datasourceId',
        width: 250,
        render: (text, record) => (
          <span>
            <div>{record.datasource_id[0]}</div>
          </span>
        ),
      },
      {
        title: '告警等级',
        dataIndex: 'severity',
        key: 'severity',
        width: 100,
      },
      {
        title: '事件标签',
        dataIndex: 'metric',
        key: 'metric',
        width: 150,
        render: (text, record) => (
          <span>
            {Object.entries(record.metric).map(([key, value]) => (
              <Tag color="processing" key={key}>{`${key}: ${value}`}</Tag>
            ))}
          </span>
        ),
      },
      {
        title: '事件详情',
        dataIndex: 'annotations',
        key: 'annotations',
        width: 200,
      },
      {
        title: '触发时间',
        dataIndex: 'first_trigger_time',
        key: 'first_trigger_time',
        width: 200,
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 150,
        render: (_, record) =>
          this.state.list.length >= 1 ? (
            <div>
              <Button type="link" onClick={() => this.handleSilenceModalOpen(record)}>静默</Button>
            </div>
          ) : null,
      },
    ]
  }

  async componentDidMount () {
    this.handleList()
  }

  handleList = async () => {
    const res = await axios.get("http://localhost:9001/api/v1/alert/curEvent")
    this.setState({
      list: res.data.data,
    })
    console.log(this.state.list)
  };

  handleModalClose = () => {
    this.setState({ visible: false })
  };

  handleSilenceModalClose = () => {
    this.setState({ silenceVisible: false })
  }

  handleSilenceModalOpen = (record) => {
    this.setState({
      selectedRow: record,
      silenceVisible: true,
    })
  };


  render () {

    const onSearch = (value, _e, info) => console.log(info?.source, value)

    return (
      <div>
        <div style={{ display: 'flex' }}>

          <Select
            placeholder="数据源类型"
            style={{
              flex: 1,
            }}
            allowClear
            options={[
              {
                value: 'Prometheus',
                label: 'Prometheus',
              },
              {
                value: 'Ali-SLS',
                label: 'Ali-SLS',
              },
            ]}
          />

          <Select
            placeholder="告警等级"
            style={{
              flex: 1,
            }}
            allowClear
            options={[
              {
                value: '1',
                label: '一级告警',
              },
              {
                value: '2',
                label: '二级告警',
              },
              {
                value: '3',
                label: '三级告警',
              },
            ]}
          />

          <Search
            allowClear
            placeholder="input search text"
            onSearch={onSearch}
            enterButton />

        </div>

        <SilenceRuleCreateModal visible={this.state.silenceVisible} onClose={this.handleSilenceModalClose} selectedRow={this.state.selectedRow} />

        <div style={{ overflowX: 'auto', marginTop: 10 }}>
          <Table
            columns={this.state.columns}
            dataSource={this.state.list}
            scroll={{
              x: 1500,
              y: 300,
            }}
          />
        </div>
      </div>
    )

  }

}

export default AlertHisEvent