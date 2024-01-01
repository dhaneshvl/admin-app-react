import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Drawer, Form, Input, Row, Col, message, Modal ,Select} from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const ProductManagement = () => {
  const [open, setOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch('http://localhost:9090/api/v1/product');
  //     const result = await response.json();

  //     if (result.success) {
  //       setProductData(result.data);
  //     } else {
  //       setError(result.message);
  //     }
  //   } catch (error) {
  //     setError('Error fetching data. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/product');
      const result = await response.json();

      if (result.success) {
        // Extract categoryName from the nested category object
        const processedData = result.data.map((product) => ({
          ...product,
          categoryName: product.category.categoryName,
        }));

        setProductData(processedData);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

   // Fetch categories from the API
   const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/category');
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error fetching categories. Please try again later.');
    }
  };

  const showDrawer = () => {
    setOpen(true);
    form.resetFields(); // Clear the form fields
  };

  const onClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          let response;

          if (selectedProduct === null) {
            // If selectedProduct is null, it's a create operation (POST request)
            response = await axios.post('http://localhost:9090/api/v1/product/create', values);
          } else {
            // If selectedProduct is not null, it's an edit operation (PUT request)
            response = await axios.put(`http://localhost:9090/api/v1/product/${selectedProduct.id}`, values);
          }

          const responseData = response.data;

          if (responseData.success) {
            toast.success(responseData.message, { position: 'bottom-left' });
            fetchData();
            onClose();
          } else {
            toast.error(responseData.message, { position: 'bottom-left' });
          }
        } catch (error) {
          if (error.response) {
            // Server responded with an error status (4xx or 5xx)
            console.error('Server error:', error.response.status, error.response.data);
            toast.error(error.response.data.message, { position: 'bottom-left' });
          } else {
            // Request was made but no response received
            console.error('Request error:', error.request);
            toast.error('No response received from the server.', { position: 'bottom-left' });
          }
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle validation errors or other form errors here
        console.error('Form validation errors:', error.errors);
        toast.error('Error submitting data. Please fix the validation errors and try again.', { position: 'bottom-left' });
        setLoading(false);
      });
  };

  const handleEdit = async (record) => {
    // Set the selected product for editing and show the Drawer
    setSelectedProduct(record);
    showDrawer();

    // Fetch the details of the selected product and update the form fields
    const productId = record.id; // Assuming the id property exists in the productData object
    try {
      console.log('Fetching product details for productId:', productId);
      await fetchProductDetails(productId);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Error fetching product details. Please try again later.', { position: 'bottom-left' });
    } finally {
      // setLoading(false); // Uncomment this line if you need to set loading to false here
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:9090/api/v1/product/${productId}`);
      const productDetails = response.data.data; // Access the 'data' property

      console.log('product-details:', productDetails);

      // Update the form fields with the details of the selected product
      form.setFieldsValue({
        productName: productDetails.productName,
        // categoryId: productDetails.categoryId,
        categoryId: productDetails.category.id,
        price: productDetails.price,
        discount: productDetails.discount,
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Error fetching product details. Please try again later.', { position: 'bottom-left' });
    }
  };

  const handleDelete = (record) => {
    if ('id' in record && record.id !== null) {
      setDeleteProductId(record.id);
      showDeleteConfirm(record.productName, record.id); // Pass the record.id to showDeleteConfirm
    } else {
      console.error('Invalid record object or missing id property:', record);
    }
  };

  const showDeleteConfirm = (productName, productId) => { // Receive productId as a parameter
    Modal.confirm({
      title: `Confirm Delete`,
      content: `Are you sure you want to delete ${productName}?`,
      onOk: () => handleConfirmDelete(productId), // Pass productId to handleConfirmDelete
      onCancel: () => setDeleteProductId(null),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const handleConfirmDelete = async (productId) => { // Receive productId as a parameter
    try {
      const response = await axios.delete(`http://localhost:9090/api/v1/product/${productId}`);
      if (response.data.success) {
        toast.success(response.data.message, { position: 'bottom-left' });
        fetchData();
      } else {
        toast.error(response.data.message, { position: 'bottom-left' });
      }
    } catch (error) {
      toast.error('Error deleting product. Please try again later.', { position: 'bottom-left' });
    } finally {
      setDeleteProductId(null);
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName', 
      key: 'categoryName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Added Date',
      dataIndex: 'addedDate',
      key: 'addedDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined /> </a>
          <a onClick={() => handleDelete(record)}><DeleteOutlined /></a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1>Product Management</h1>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{ marginBottom: 16, float: 'right', marginRight: 30 }}
        onClick={showDrawer}
      >
        Add New
      </Button>

      <Drawer
        title={selectedProduct != null ? 'Edit Product' : 'Create a new product'}
        width={720}
        onClose={onClose}
        visible={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button key="submit" type="primary" loading={loading} onClick={handleFormSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="Product Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the product name',
                  },
                ]}
              >
                <Input placeholder="Please enter product name" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              {/* Use the Select component for category selection */}
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: 'Please select the category',
                  },
                ]}
              >
                {/* <Select placeholder="Please select category">
                  {/* Map over categories and create Select options */}
                  {/* {categories.map((category) => (
                    <Option key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>  */}

                <Select placeholder="Please select category">
                  {/* Map over categories and create Select options */}
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the price',
                  },
                ]}
              >
                <Input placeholder="Please enter price" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discount"
                label="Discount"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the discount',
                  },
                ]}
              >
                <Input placeholder="Please enter discount" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Table columns={columns} dataSource={productData} />
      <ToastContainer />
    </>
  );
};

export default ProductManagement;
