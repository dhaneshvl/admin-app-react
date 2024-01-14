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
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const VehicleManagement = () => {
  const [open, setOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [error, setError] = useState(null);
  const [isViewMode, setViewMode] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const HOSTNAME = "http://localhost:9090/api/v1";

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${HOSTNAME}/vehicles`, {
        params: {
          page: pagination.current - 1,
          size: pagination.pageSize,
        },
      });

      const result = response.data;

      if (result.success) {
        setVehicleData(result.data.content);
        setPagination({
          ...pagination,
          total: result.data.totalElements,
        });
      } else {
        setError(result.message || "Unknown error occurred");
      }
    } catch (error) {
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const pageSizeOptions = ["10", "20", "30", "50", "100"]; // Customize the page size options

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pagination?.pageSize) {
      fetchData();
    }
  };

  // const handleTableChange = (pagination, filters, sorter) => {
  //   setPagination((prevPagination) => ({
  //     ...prevPagination,
  //     current: pagination.current,
  //     pageSize: pagination.pageSize,
  //   }));
  // };

  const showDrawer = () => {
    setOpen(true);
    form.resetFields();
  };

  const onClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
    setViewMode(false);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      const response = selectedVehicle
        ? await axios.put(`${HOSTNAME}/vehicles/${selectedVehicle.id}`, values)
        : await axios.post(`${HOSTNAME}/vehicles/create`, values);

      const responseData = response.data;

      if (responseData.success) {
        toast.success(responseData.message, { position: "bottom-left" });
        fetchData();
        onClose();
      } else {
        toast.error(responseData.message, { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Form validation errors:", error.errors);
      toast.error(
        "Error submitting data. Please fix the validation errors and try again.",
        { position: "bottom-left" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (record) => {
    setSelectedVehicle(record);
    showDrawer();

    try {
      const response = await axios.get(`${HOSTNAME}/vehicles/${record.id}`);
      const vehicleDetails = response.data.data;

      form.setFieldsValue({
        vehicleName: vehicleDetails.vehicleName,
        vehicleNumber: vehicleDetails.vehicleNumber,
        addedDate: vehicleDetails.addedDate,
      });
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  const handleDelete = (record) => {
    if ("id" in record && record.id !== null) {
      setDeleteVehicleId(record.id);
      showDeleteConfirm(record.vehicleName, record.id);
    } else {
      console.error("Invalid record object or missing id property:", record);
    }
  };

  const showDeleteConfirm = (vehicleName, vehicleId) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete ${vehicleName}?`,
      onOk: () => handleConfirmDelete(vehicleId),
      onCancel: () => setDeleteVehicleId(null),
      okText: "Yes",
      cancelText: "No",
    });
  };

  const handleConfirmDelete = async (vehicleId) => {
    try {
      const response = await axios.delete(`${HOSTNAME}/vehicles/${vehicleId}`);
      if (response.data.success) {
        toast.success(response.data.message, { position: "bottom-left" });
        fetchData();
      } else {
        toast.error(response.data.message, { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    } finally {
      setDeleteVehicleId(null);
    }
  };

  const handleView = async (record) => {
    try {
      setViewMode(true); // Show loader on form submit
      const response = await axios.get(HOSTNAME + `/vehicles/${record.id}`);

      const responseData = response.data;

      if (responseData.success) {
        const vehicleDetails = responseData.data;

        // Prepare the data to be displayed in the drawer
        const viewData = {
          vehicleName: vehicleDetails.vehicleName,
          vehicleNumber: vehicleDetails.vehicleNumber,
          addedDate: vehicleDetails.addedDate,
        };

        form.setFieldsValue(viewData);
        setSelectedVehicle(viewData); // Set the selected vehicle
        setOpen(true);
      } else {
        // Display error message using react-toastify
        toast.error(responseData.message, { position: "bottom-left" });
      }
    } catch (error) {
      setViewMode(false);
      // Handle request or server errors
      console.error("Error fetching view data:", error);

      // Display error message using react-toastify
      toast.error("Error fetching view data. Please try again.", {
        position: "bottom-left",
      });
    }
  };

  const columns = [
    // {
    //   title: "SI NO",
    //   dataIndex: "siNo",
    //   key: "siNo",
    //   render: (_, record, index) => index + 1,
    // },
    {
      title: "Vehicle Name",
      dataIndex: "vehicleName",
      key: "vehicleName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
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
          <a onClick={() => handleView(record)}>
            <EyeOutlined />{" "}
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 style={{ marginBlockStart: -20 }}>Vehicle Management</h1>

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
          selectedVehicle !== null ? "Edit Vehicle" : "Create a new Vehicle"
        }
        width={600}
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
              disabled = {isViewMode}
              
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vehicleName"
                label="Vehicle Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the vehicle name",
                  },
                ]}
              >
                <Input placeholder="Please enter vehicle name"  readOnly={isViewMode} allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="vehicleNumber"
                label="Vehicle Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter the vehicle number",
                  },
                ]}
              >
                <Input placeholder="Please enter vehicle number" readOnly={isViewMode} allowClear />
              </Form.Item>
            </Col>
          </Row>
          {!isViewMode ? null : (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="addedDate"
                  label="Added Date"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the added date",
                    },
                  ]}
                >
                  <Input
                    placeholder="Please enter added date"
                    readOnly={isViewMode}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Drawer>

      {/* <Table
        columns={columns}
        dataSource={vehicleData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      /> */}

      <Table
        columns={columns}
        dataSource={vehicleData}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: pageSizeOptions,
          responsive: ["vertical"], // Keep the page size selector in smaller screens
        }}
        loading={loading}
        onChange={handleTableChange}
      />

      <ToastContainer />
    </>
  );
};

export default VehicleManagement;
