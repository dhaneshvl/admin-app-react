import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Row,
  Col,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const SupplierManagement = () => {
  const [open, setOpen] = useState(false);
  const [supplierData, setSupplierData] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [deleteSupplierId, setDeleteSupplierId] = useState(null);

  const HOSTNAME = 'http://localhost:9090/api/v1';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(HOSTNAME+"/supplier");
      const result = await response.json();

      if (result.success) {
        setSupplierData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const showDrawer = () => {
    setOpen(true);
    form.resetFields(); // Clear the form fields
  };

  const onClose = () => {
    setOpen(false);
    setSelectedSupplier(null);
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          let response;

          if (selectedSupplier === null) {
            // If selectedSupplier is null, it's a create operation (POST request)
            response = await axios.post(
              HOSTNAME+"/supplier/create",
              values
            );
          } else {
            // If selectedSupplier is not null, it's an edit operation (PUT request)
            response = await axios.put(
              HOSTNAME+`/supplier/${selectedSupplier.id}`,
              values
            );
          }

          const responseData = response.data;

          if (responseData.success) {
            toast.success(responseData.message, { position: "bottom-left" });
            fetchData();
            onClose();
          } else {
            toast.error(responseData.message, { position: "bottom-left" });
          }
        } catch (error) {
          if (error.response) {
            // Server responded with an error status (4xx or 5xx)
            console.error(
              "Server error:",
              error.response.status,
              error.response.data
            );
            toast.error(error.response.data.message, {
              position: "bottom-left",
            });
          } else {
            // Request was made but no response received
            console.error("Request error:", error.request);
            toast.error("No response received from the server.", {
              position: "bottom-left",
            });
          }
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle validation errors or other form errors here
        console.error("Form validation errors:", error.errors);
        toast.error(
          "Error submitting data. Please fix the validation errors and try again.",
          { position: "bottom-left" }
        );
        setLoading(false);
      });
  };

  const handleEdit = async (record) => {
    // Set the selected supplier for editing and show the Drawer
    setSelectedSupplier(record);
    showDrawer();

    // Fetch the details of the selected supplier and update the form fields
    const supplierId = record.id; // Assuming the id property exists in the supplierData object
    try {
      await fetchSupplierDetails(supplierId);
    } catch (error) {
      // Handle errors
    }
  };

  const fetchSupplierDetails = async (supplierId) => {
    try {
      const response = await axios.get(
        HOSTNAME+`/supplier/${supplierId}`
      );
      const supplierDetails = response.data.data;

      // Update the form fields with the details of the selected supplier
      form.setFieldsValue({
        supplierName: supplierDetails.supplierName,
        address: supplierDetails.address,
        gstNo: supplierDetails.gstNo,
        phone: supplierDetails.phone,
      });
    } catch (error) {
      // Handle errors
    }
  };

  const handleDelete = (record) => {
    if ("id" in record && record.id !== null) {
      setDeleteSupplierId(record.id);
      showDeleteConfirm(record.supplierName, record.id);
    } else {
      console.error("Invalid record object or missing id property:", record);
    }
  };

  const showDeleteConfirm = (supplierName, supplierId) => {
    Modal.confirm({
      title: `Confirm Delete`,
      content: `Are you sure you want to delete ${supplierName}?`,
      onOk: () => handleConfirmDelete(supplierId),
      onCancel: () => setDeleteSupplierId(null),
      okText: "Yes",
      cancelText: "No",
    });
  };

  const handleConfirmDelete = async (supplierId) => {
    try {
      const response = await axios.delete(
        HOSTNAME+`/supplier/${supplierId}`
      );
      if (response.data.success) {
        toast.success(response.data.message, { position: "bottom-left" });
        fetchData();
      } else {
        toast.error(response.data.message, { position: "bottom-left" });
      }
    } catch (error) {
      // Handle errors
    } finally {
      setDeleteSupplierId(null);
    }
  };

  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "GST Number",
      dataIndex: "gstNo",
      key: "gstNo",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Added Date",
      dataIndex: "addedDate",
      key: "addedDate",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>
            <EditOutlined />{" "}
          </a>
          <a onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 style={{ marginBlockStart: -20 }}>Supplier Management</h1>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{ marginBottom: 16, float: "right", marginRight: 30 }}
        onClick={showDrawer}
      >
        Add New
      </Button>

      <Drawer
        title={
          selectedSupplier !== null ? "Edit Supplier" : "Create a new Supplier"
        }
        width={720}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplierName"
                label="Supplier Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the supplier name",
                  },
                ]}
              >
                <Input placeholder="Please enter supplier name" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Please enter the address",
                  },
                ]}
              >
                <Input.TextArea placeholder="Please enter address" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gstNo"
                label="GST Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter the GST Number",
                  },
                ]}
              >
                <Input placeholder="Please enter GST Number" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter the phone number",
                  },
                ]}
              >
                <Input placeholder="Please enter phone number" allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      {/* <Table columns={columns} dataSource={supplierData} /> */}
      <Table
        columns={columns}
        dataSource={Array.isArray(supplierData) ? supplierData : []}
      />

      <ToastContainer />
    </>
  );
};

export default SupplierManagement;
