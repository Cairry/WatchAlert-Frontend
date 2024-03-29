import { Input, Table, Button, Popconfirm, message } from 'antd'
import React from 'react'
import axios from 'axios'
import UserRoleCreateModal from './UserRoleCreateModal'
import backendIP from '../utils/config'
import Base from '../utils/Base'
const { Search } = Input

class UserRole extends React.Component {

  state = {
    selectedRow: null,
    updateVisible: false,
    changeVisible: false,
    selectedUserId: null,
    visible: false,
    list: [],
    columns: [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        width: 'auto',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: 'auto',
        render: (text) => {
          if (!text) {
            return '-'
          }
          return text
        }
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
        key: 'create_at',
        width: 'auto',
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
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(_, record)}
                disabled={record.name === 'admin'}>
                <a style={{ cursor: record.name === 'admin' ? 'not-allowed' : 'pointer' }}>删除</a>
              </Popconfirm>
              <Button
                type="link" onClick={() => this.handleUpdateModalOpen(record)}>
                更新
              </Button>
            </div>
          ) : null,
      },
    ]
  }

  async componentDidMount() {
    this.handleList()
  }

  handleList = async () => {
    const res = await axios.get(`http://${backendIP}/api/w8t/role/roleList`)
    this.setState({
      list: res.data.data,
    })
  };

  handleDelete = async (_, record) => {
    axios.post(`http://${backendIP}/api/w8t/role/roleDelete?id=${record.id}`)
      .then((res) => {
        if (res.status === 200) {
          message.success("删除成功")
          this.handleList()
        }
      })
      .catch(() => {
        message.error("删除失败")
      })
  };

  handleModalClose = () => {
    this.setState({ visible: false })
  };

  handleChanagePassModalClose = () => {
    this.setState({ changeVisible: false })
  };

  handleUpdateModalClose = () => {
    this.setState({ updateVisible: false })
  }

  handleUpdateModalOpen = (record) => {
    this.setState({
      selectedRow: record,
      updateVisible: true,
    })
  };

  render() {

    return (
      <div>
        <div style={{ display: 'flex' }}>

          <Button type="primary" onClick={() => this.setState({ visible: true })}>
            创建
          </Button>

          <UserRoleCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.handleList} />

          <UserRoleCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' handleList={this.handleList} />

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: '1000px'
          }}>

          </div>

        </div>

        <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
          <Table
            columns={this.state.columns}
            dataSource={this.state.list}
            scroll={{
              x: 1000,
              y: 'calc(65vh - 65px - 40px)'
            }}
          />
        </div>
      </div>
    )

  }

}

export default UserRole