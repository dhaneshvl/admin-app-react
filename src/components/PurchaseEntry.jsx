import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Drawer,
  Form,
  Space,
  Input,
  Row,
  Col,
  Table,
  Card,
  Tooltip,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { grey, red } from "@mui/material/colors";

const { Option } = Select;

const PurchaseEntry = () => {
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [purchaseEntries, setPurchaseEntries] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isViewMode, setViewMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const HOSTNAME = "http://localhost:9090/api/v1";

  useEffect(() => {
    const handleResize = () => {
      // Update the isMobile state based on the window width
      setIsMobile(window.innerWidth < 768); // You can adjust the breakpoint as needed
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the initial state
    handleResize();

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(HOSTNAME + "/supplier");
        setSuppliers(response.data.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchPurchaseEntries = async () => {
      try {
        const response = await axios.get(HOSTNAME + "/purchase-entries");
        setPurchaseEntries(response.data.data);
      } catch (error) {
        console.error("Error fetching purchase entries:", error);
      }
    };

    fetchPurchaseEntries();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedSupplier) {
        try {
          const response = await axios.get(
            HOSTNAME + `/product/supplier/${selectedSupplier}`
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
    if (selectedSupplier !== null && !isViewMode) {
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

  const handleView = async (record) => {
    try {
      setViewMode(true); // Show loader on form submit
      const response = await axios.get(
        HOSTNAME + `/purchase-entries/${record.purchaseEntryId}`
      );

      const responseData = response.data;

      if (responseData.success) {
        const purchaseData = responseData.data;

        // Prepare the data to be displayed in the drawer
        const viewData = {
          supplier: purchaseData.supplierId,
          purchaseNote: purchaseData.purchaseNote,
          products: purchaseData.products.map((product) => ({
            product: product.productId,
            quantity: product.quantity,
            basePrice: product.basePrice,
            discount: product.discount,
            totalAmount: product.totalAmount,
          })),
        };

        form.setFieldsValue({
          supplier: viewData.supplier,
          purchaseNote: viewData.purchaseNote,
          products: viewData.products.map((product, index) => ({
            ...product,
            key: index, // Add a key to each product to uniquely identify it in the Form.List
          })),
        });

        setSelectedSupplier(viewData.supplier); // Set the selected supplier
        setIsDrawerVisible(true);
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

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    form.resetFields(); // Reset the entire form
    setSelectedSupplier(null);
    setProducts(null);
    setIsDrawerVisible(false);
    setViewMode(false);
  };

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true); // Show loader on form submit

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
        HOSTNAME + "/purchase-entries",
        submissionData
      );

      const responseData = response.data;

      if (responseData.success) {
        // Display success message using react-toastify
        toast.success(responseData.message, { position: "bottom-left" });

        // Additional logic or state updates if needed

        // Close the drawer or perform other actions
        closeDrawer();

        // Fetch updated purchase entries
        const updatedResponse = await axios.get(HOSTNAME + "/purchase-entries");
        setPurchaseEntries(updatedResponse.data.data);
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
    } finally {
      setSubmitLoading(false); // Hide loader after form submission
    }
  };

  const columns = [
    // {
    //   title: "Purchase ID",
    //   dataIndex: "purchaseEntryId",
    //   key: "purchaseEntryId",
    // },
    {
      title: "Purchase Note",
      dataIndex: "purchaseNote",
      key: "purchaseNote",
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName", // Adjust this based on your actual data structure
      key: "supplierName",
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate", // Adjust this based on your actual data structure
      key: "purchaseDate",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>
            <EyeOutlined />{" "}
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 style={{ marginBlockStart: -20 }}>Purchase Entry Management</h1>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{
          marginBottom: 16,
          float: isMobile ? "none" : "right",
          marginRight: isMobile ? 0 : 30,
        }}
        onClick={() => setIsDrawerVisible(true)}
      >
        Add New
      </Button>

      <Drawer
        title={isViewMode ? "View Purchase Entry" : "Add New Purchase Entry"}
        width={isMobile ? "100%" : 900}
        onClose={closeDrawer}
        open={isDrawerVisible}
        destroyOnClose={true} // Add this line to prevent destroying the drawer on close
      >
        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          style={{
            maxWidth: isMobile ? "100%" : 820,
          }}
          autoComplete="off"
        >
          <Row gutter={isMobile ? 8 : 16}>
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
                  allowClear
                  optionFilterProp="children"
                  onChange={handleSupplierChange}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  disabled={isViewMode}
                >
                  {suppliers.map((supplier) => (
                    <Option key={supplier.id} value={supplier.id}>
                      {supplier.supplierName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Purchase Note"
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
                  allowClear
                  onChange={(e) => setPurchaseNote(e.target.value)}
                  readOnly={isViewMode}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    title="Purchase Item"
                    style={{
                      width: "100%",
                      background: "#fbb13c",
                    }}
                    key={key}
                  >
                    <Space
                      style={{
                        display: "flex",
                        marginBottom: isMobile ? 10 : 20,
                        flexDirection: "row",
                      }}
                      align={isMobile ? "start" : "baseline"}
                    >
                      <Row gutter={isMobile ? 8 : 16}>
                        <Form.Item
                          {...restField}
                          name={[name, "product"]}
                          label="Select Product"
                          rules={[
                            {
                              required: true,
                              message: "Missing product",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Please select a product"
                            allowClear
                            optionFilterProp="children"
                            disabled={isViewMode}
                          >
                            {products?.length > 0 &&
                              products.map((product) => (
                                <Option key={product.id} value={product.id}>
                                  {product.productName}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Product Quantity"
                          rules={[
                            {
                              required: true,
                              message: "Missing quantity",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Quantity"
                            allowClear
                            readOnly={isViewMode}
                          />
                        </Form.Item>

                        {isViewMode ? (
                          // <Row gutter={isMobile ? 8 : 16}>
                          <Form.Item
                            {...restField}
                            name={[name, "totalAmount"]}
                            label="Total"
                          >
                            <Input
                              placeholder="Total of base price"
                              allowClear
                              readOnly={isViewMode}
                            />
                          </Form.Item>
                        ) : // </Row>
                        null}
                      </Row>
                      <Row gutter={isMobile ? 8 : 16}>
                        <Form.Item
                          {...restField}
                          name={[name, "basePrice"]}
                          label="Base Price"
                          rules={[
                            {
                              required: true,
                              message: "Missing base price",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Base Price"
                            allowClear
                            readOnly={isViewMode}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "discount"]}
                          label="Discount"
                        >
                          <Input
                            placeholder="Discount (%)"
                            allowClear
                            readOnly={isViewMode}
                          />
                        </Form.Item>
                      </Row>

                      {isViewMode ? null : (
                        <Tooltip title="remove item" key={name}>
                          <MinusCircleOutlined
                            color="red"
                            onClick={() => remove(name)}
                          />
                        </Tooltip>
                      )}
                    </Space>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    disabled={isViewMode}
                    // readOnly={isViewMode}
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
              loading={submitLoading} // Show loader conditionally
              disabled={isViewMode}
              // readOnly={isViewMode}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Table columns={columns} dataSource={purchaseEntries} />

      <ToastContainer />
    </>
  );
};

export default PurchaseEntry;
