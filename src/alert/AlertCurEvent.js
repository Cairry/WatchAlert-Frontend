import { Select, Input, Table, Button, Popconfirm, message, Tag } from 'antd'
import axios from 'axios'
import React from 'react'
import SilenceRuleCreateModal from '../silence/SilenceRuleCreateModal'
import backendIP from '../utils/config'
import { CopyOutlined } from '@ant-design/icons'
const { Search } = Input

class AlertCurEvent extends React.Component {

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
        width: 'auto',
      },
      {
        title: '指纹',
        dataIndex: 'fingerprint',
        key: 'fingerprint',
        width: 'auto',
      },
      {
        title: '数据源',
        dataIndex: 'datasourceId',
        key: 'datasourceId',
        width: 'auto',
        render: (text, record) => (
          <span>
            <div>{record.datasource_id}</div>
          </span>
        ),
      },
      {
        title: '告警等级',
        dataIndex: 'severity',
        key: 'severity',
        width: 100,
        render: (text) => (
          <span>
            {text}
          </span>
        ),
      },
      {
        title: '事件标签',
        dataIndex: 'metric',
        key: 'metric',
        width: 300,
        render: (text, record) => (
          <span>
            {record && record.metric && Object.entries(record.metric).map(([key, value]) => (
              <Tag color="processing" key={key}>{`${key}: ${value}`}</Tag>
            ))}
          </span>
        ),
      },
      {
        title: '事件详情',
        dataIndex: 'annotations',
        key: 'annotations',
        width: 300,
        render: (text, record) => (
          <span>
            {/* {record.annotations && record.annotations.substring(0, 100)}...... */}
            <span>
              {record.annotations && (
                <span>
                  {record.annotations.substring(0, 100)}......
                  <CopyOutlined
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      navigator.clipboard.writeText(record.annotations);
                      message.success('已复制到剪贴板');
                    }}
                  />
                </span>
              )}
            </span>
          </span>
        )
      },
      {
        title: '触发时间',
        dataIndex: 'first_trigger_time',
        key: 'first_trigger_time',
        width: 180,
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
        render: (_, record) =>
          this.state.list.length >= 1 ? (
            <div>
              <Button type="link" onClick={() => this.handleSilenceModalOpen(record)}>静默</Button>
            </div>
          ) : null,
      },
    ]
  }

  async componentDidMount() {
    this.handleList()
  }

  handleList = async () => {
    const res = await axios.get(`http://${backendIP}/api/w8t/event/curEvent`)
    this.setState({
      list: res.data.data,
    })
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


  render() {

    const onSearch = (value, _e, info) => console.log(info?.source, value)

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          width: '500px'
        }}>
          <Select
            placeholder="数据源类型"
            style={{
              flex: 1,
              width: 200
            }}
            allowClear
            options={[
              {
                value: 'Prometheus',
                label: 'Prometheus',
              },
              {
                value: 'AliCloudSLS',
                label: 'AliCloudSLS',
              },
              {
                value: 'Loki',
                label: 'Loki',
              }
            ]}
          />

          <Select
            placeholder="告警等级"
            style={{
              flex: 1,
              width: 150
            }}
            allowClear
            options={[
              {
                value: '0',
                label: 'P0级告警',
              },
              {
                value: '1',
                label: 'P1级告警',
              },
              {
                value: '2',
                label: 'P2级告警',
              },
            ]}
          />

          <Search
            allowClear
            placeholder="输入搜索关键字"
            onSearch={onSearch}
            enterButton
            style={{ width: 300 }} />

        </div>

        <SilenceRuleCreateModal visible={this.state.silenceVisible} onClose={this.handleSilenceModalClose} selectedRow={this.state.selectedRow} />

        <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
          <Table
            columns={this.state.columns}
            dataSource={this.state.list}
            scroll={{
              x: 1500,
              y: 'calc(65vh - 65px - 40px)'
            }}
          />
        </div>
      </div>
    )

  }

}

export default AlertCurEvent