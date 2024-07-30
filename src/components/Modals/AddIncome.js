import React from 'react'
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
const AddIncome = ({
    isIncomeModalVisible,
    handleIncomeCancel,
    onFinish,
  }) => {
    const [form] = Form.useForm();
    
    
  
    return (
      <Modal
      className='font-medium'
        title="Add Income"
        open={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onFinish(values, "income");
            form.resetFields();
          }}
        >
          <Form.Item
            className='font-medium'
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name of the transaction!",
              },
            ]}
          >
            <Input type="text" className="custom-input font-normal" />
          </Form.Item>
          <Form.Item
            className='font-medium'
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Please input the income amount!" },
            ]}
          >
            <Input type="number" className="custom-input font-normal" />
          </Form.Item>
          <Form.Item
            className='font-medium'
            label="Date"
            name="date"
            rules={[
              { required: true, message: "Please select the income date!" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" className="custom-input font-normal" />
          </Form.Item>
          <Form.Item
            className=' font-medium text-black'
            label="Tag"
            name="tag"
            rules={[{ required: true, message: "Please select a tag!" }]}
          >
            <Select className="select-input-2" >
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="freelance">Freelance</Select.Option>
              <Select.Option value="investment">Investment</Select.Option>
              <Select.Option value="business">Business</Select.Option>
              <Select.Option value="farming">Farming</Select.Option>
              {/* Add more tags here */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button className="btn-blue" type="primary" htmlType="submit">
              Add Income
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

export default AddIncome