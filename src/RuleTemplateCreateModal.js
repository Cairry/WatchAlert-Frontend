import { Modal, Form, Input, Button, Radio, Select, InputNumber, message } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import backendIP from './config'
const MyFormItemContext = React.createContext([])

function toArr(str) {
  return Array.isArray(str) ? str : [str]
}

// 表单组
const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix])
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>
}

// 表单
const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
  return <Form.Item name={concatName} {...props} />
}

const RuleTemplateCreateModal = ({ visible, onClose, selectedRow, type, handleList, ruleGroupName }) => {
  const [form] = Form.useForm()

  // 告警等级
  const [severityValue, setSeverityValue] = useState(1)
  const onChange = (e) => {
    setSeverityValue(e.target.value)
  }

  // 禁止输入空格
  const [spaceValue, setSpaceValue] = useState('')

  const handleInputChange = (e) => {
    // 移除输入值中的空格
    const newValue = e.target.value.replace(/\s/g, '')
    setSpaceValue(newValue)
  }

  const handleKeyPress = (e) => {
    // 阻止空格键的默认行为
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        ruleName: selectedRow.ruleName,
        datasourceType: selectedRow.datasourceType,
        alicloudSLSConfig: selectedRow.alicloudSLSConfig,
        lokiConfig: selectedRow.lokiConfig,
        prometheusConfig: selectedRow.prometheusConfig,
        severity: selectedRow.severity,
        evalInterval: selectedRow.evalInterval,
        forDuration: selectedRow.forDuration,
        annotations: selectedRow.annotations,
      })
    }
  }, [selectedRow, form])

  // 创建
  const handleFormSubmit = async (values) => {
    if (type === 'create') {
      const newValues = {
        ...values,
        ruleGroupName: ruleGroupName,
      }
      axios.post(`http://${backendIP}/api/w8t/ruleTmpl/ruleTmplCreate`, newValues)
        .then((res) => {
          if (res.status === 200) {
            message.success("创建成功")
            handleList(ruleGroupName)
          }
        })
        .catch(() => {
          message.error("创建失败")
        })
    }
    if (type === 'view') {

    }

    // 关闭弹窗
    onClose()
  }

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      bodyStyle={{ overflowY: 'auto', maxHeight: '600px' }} // 设置最大高度并支持滚动
      width={800} // 设置Modal窗口宽度
    >
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>
        <div>
          <div style={{ display: 'flex' }}>
            <MyFormItem
              name="ruleName"
              label="规则名称"
              style={{
                marginRight: '10px',
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                value={spaceValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress} />
            </MyFormItem>

            <MyFormItem
              name="datasourceType"
              label="数据源类型"
              style={{
                marginRight: '10px',
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="选择数据源类型"
                style={{
                  flex: 1,
                }}
                options={[
                  {
                    value: 'Prometheus',
                    label: 'Prometheus',
                  },
                ]}
              />
            </MyFormItem>

          </div>

          <MyFormItemGroup prefix={['prometheusConfig']}>
            <MyFormItem name="promQL" label="PromQL">
              <Input />
            </MyFormItem>
          </MyFormItemGroup>

          <MyFormItem name="severity" label="告警等级"
            rules={[
              {
                required: true,
              },
            ]}>
            <Radio.Group onChange={onChange} value={severityValue}>
              <Radio value={0}>P0级告警</Radio>
              <Radio value={1}>P1级告警</Radio>
              <Radio value={2}>P2级告警</Radio>
            </Radio.Group>
          </MyFormItem>

          <div style={{ display: 'flex' }}>
            <MyFormItem
              name="evalInterval"
              label="执行频率"
              style={{
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                style={{ width: '97%' }}
                addonAfter={<span>秒</span>}
                placeholder="10"
                min={1}
              />
            </MyFormItem>

            <MyFormItem
              name="forDuration"
              label="持续时间"
              style={{
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter={<span>秒</span>}
                placeholder="60"
                min={1}
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
            </MyFormItem>
          </div>

          <MyFormItem name="annotations" label="告警详情">
            <Input />
          </MyFormItem>
        </div>

        {type === 'create' &&
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        }
        {type === 'view' && ' 注意: 模版不支持修改! 只能应用到创建告警规则中。'}
      </Form>
    </Modal>
  )
}

export default RuleTemplateCreateModal