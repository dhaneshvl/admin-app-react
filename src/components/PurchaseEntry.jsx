import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  List,
  Modal,
  Drawer,
  Form,
  Space,
  Input,
  Row,
  Col,
  Tooltip,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const { Option } = Select;

const PurchaseEntry = () => {
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9090/api/v1/category"
        );
        setSuppliers(response.data.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedSupplier) {
        try {
          const response = await axios.get(
            `http://localhost:9090/api/v1/product/supplier/${selectedSupplier}`
          );
          setProducts(response.data.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [selectedSupplier]);

  useEffect(() => {
    if (selectedSupplier !== null) {
      setProducts([{ quantity: "", basePrice: "", discount: "", product: "" }]);
      form.setFieldsValue({
        products: [{ quantity: "", basePrice: "", discount: "" }],
      });
    }
  }, [selectedSupplier, form]);

  const handleSupplierChange = async (value) => {
    setSelectedSupplier(value);
    setProducts([]); // Clear the products when the supplier changes
    form.setFieldsValue({ products: [] }); // Clear product values without closing the form
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    form.resetFields(); // Reset the entire form
    setIsDrawerVisible(false);
  };

  const onFinish = async (values) => {
    try {
      // Extract values from the form
      const { supplier, purchaseNote, products } = values;
  
      // Map the products array to the desired format
      const formattedProducts = products.map((product) => {
        return {
          productId: product.product,
          quantity: product.quantity,
          basePrice: product.basePrice,
          discount: product.discount,
        };
      });
  
      // Create the final submission object
      const submissionData = {
        supplierId: supplier,
        purchaseNote: purchaseNote, // Use the purchaseNote from the form
        purchaseEntryProductFieldsList: formattedProducts,
      };
  
      console.log("Received values:", JSON.stringify(submissionData));
  
      const response = await axios.post(
        "http://localhost:9090/api/v1/purchase-entries",
        submissionData
      );
  
      const responseData = response.data;
  
      if (responseData.success) {
        // Display success message using react-toastify
        toast.success(responseData.message, { position: "bottom-left" });
  
        // Additional logic or state updates if needed
  
        // Close the drawer or perform other actions
        closeDrawer();
      } else {
        // Display error message using react-toastify
        toast.error(responseData.message, { position: "bottom-left" });
      }
    } catch (error) {
      // Handle request or server errors
      console.error("Error submitting data:", error);
  
      // Display error message using react-toastify
      toast.error("Error submitting data. Please try again.", {
        position: "bottom-left",
      });
    }
  };
  

  return (
    <>
      <Button onClick={() => setIsDrawerVisible(true)}>Add New</Button>

      <Drawer
        title={"Add New Purchase Entry"}
        width={720}
        onClose={closeDrawer}
        open={isDrawerVisible}
        destroyOnClose={true} // Add this line to prevent destroying the drawer on close
      >
        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Select Supplier"
                name="supplier"
                rules={[
                  {
                    required: true,
                    message: "Please select a supplier",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a supplier"
                  optionFilterProp="children"
                  onChange={handleSupplierChange}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {suppliers.map((supplier) => (
                    <Option key={supplier.id} value={supplier.id}>
                      {supplier.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="purchaseNote"
                rules={[
                  {
                    required: true,
                    message: "Purchase note required",
                  },
                ]}
              >
                <Input
                  placeholder="Purchase Note"
                  onChange={(e) => setPurchaseNote(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "product"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing product",
                        },
                      ]}
                    >
                      {/* <Tooltip title="Product" key="product-tooltip"> */}
                        <Select
                          showSearch
                          placeholder="Select a product"
                          optionFilterProp="children"
                        >
                          {products.map((product) => (
                            <Option key={product.id} value={product.id}>
                              {product.productName}
                            </Option>
                          ))}
                        </Select>
                      {/* </Tooltip> */}
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing quantity",
                        },
                      ]}
                    >
                      {/* <Tooltip title="Quantity" key="quantity-tooltip"> */}
                        <Input placeholder="Quantity" />
                      {/* </Tooltip> */}
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "basePrice"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing base price",
                        },
                      ]}
                    >
                      {/* <Tooltip title="Base Price" key="base-price-tooltip"> */}
                        <Input placeholder="Base Price" />
                      {/* </Tooltip> */}
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "discount"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing discount",
                        },
                      ]}
                    >
                      {/* <Tooltip title="Discount" key="discount-tooltip"> */}
                        <Input placeholder="Discount (%)" />
                      {/* </Tooltip> */}
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add more products
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              //   loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

 <ToastContainer />
      
    </>
  );
};

export default PurchaseEntry;
