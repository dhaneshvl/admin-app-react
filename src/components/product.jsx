import React from 'react';
import { Space, Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined ,PlusCircleOutlined} from '@ant-design/icons';
const columns = [
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
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
    title: 'Measured In',
    dataIndex: 'measuredIn',
    key: 'measuredIn',
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
        <a><EditOutlined/> </a>
        <a><DeleteOutlined/></a>
      </Space>
    ),
  },
];
const data = [
    {
      key: '1',
      productName: 'Fresh Apples',
      category: 'Fruits',
      price: 299,
      discount: 0,
      measuredIn: 'Kg',
      addedDate: '2023-01-05',
    },
    {
      key: '2',
      productName: 'Whole Wheat Bread',
      category: 'Bakery',
      price: 79,
      discount: 5,
      measuredIn: 'Pcs',
      addedDate: '2023-02-10',
    },
    {
      key: '3',
      productName: 'Milk',
      category: 'Dairy',
      price: 90,
      discount: 2,
      measuredIn: 'Ltr',
      addedDate: '2023-03-15',
    },
    {
      key: '4',
      productName: 'Ghee',
      category: 'Dairy',
      price: 1299,
      discount: 12,
      measuredIn: 'Kg',
      addedDate: '2023-04-20',
    },
    {
      key: '5',
      productName: 'Brown Rice',
      category: 'Grains',
      price: 149,
      discount: 2,
      measuredIn: 'Kg',
      addedDate: '2023-05-25',
    },
    {
      key: '6',
      productName: 'Green Beans',
      category: 'Vegetables',
      price: 59,
      discount: 0,
      measuredIn: 'Kg',
      addedDate: '2023-06-30',
    },
    {
      key: '7',
      productName: 'Peanut Butter',
      category: 'Pantry',
      price: 190,
      discount: 3,
      measuredIn: 'Pcs',
      addedDate: '2023-07-05',
    },
    {
      key: '8',
      productName: 'Bru Coffee',
      category: 'Beverages',
      price: 19,
      discount: 5,
      measuredIn: 'Pcs',
      addedDate: '2023-08-10',
    },
    {
      key: '9',
      productName: 'White Rice',
      category: 'Dairy',
      price: 89,
      discount: 2,
      measuredIn: 'Kg',
      addedDate: '2023-09-15',
    },
    {
      key: '10',
      productName: 'Tomato Sauce',
      category: 'Pantry',
      price: 140,
      discount: 0,
      measuredIn: 'Pcs',
      addedDate: '2023-10-20',
    },
  ];  
  const Product = () => (
    <>
{/* h1 at the very top of the page */}
<h1>Product Management</h1>

      {/* Add button */}
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{ marginBottom: 16, float: 'right', marginRight: 30 }}
        onClick={() => {
          // Handle the "Add" button click
          console.log('Add button clicked!');
        }}
      >
        Add New
      </Button>
  
      {/* Table component */}
      <Table columns={columns} dataSource={data} />
    </>
  );
export default Product;