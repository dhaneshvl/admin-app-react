import React from "react";
import {ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import CountUp from "react-countup";
import PieChart from "./PieChart";

const formatter = (value) => <CountUp end={value} separator="," />;

const Dashboard = () => {
  const pieChartData = [
    { y: 18, label: "Masala" },
    { y: 49, label: "Rice Products" },
    { y: 9, label: "Cooking Oil" },
    { y: 5, label: "Dal Items" },
    { y: 19, label: "Milk Products" },
  ];

  return (
    <>
    <h1 style={{marginBlockStart:-20}}>Dashboard</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Last six months sales"
              value={11.28}
              precision={2}
              valueStyle={{
                color: "#228B22",
              }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Last one year sales"
              value={9.3}
              precision={2}
              valueStyle={{
                color: "#228B22",
              }}
              // prefix={<ArrowDownOutlined />}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Last Month Sales (INR)"
              value={67850}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Sales (INR)"
              value={112893}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic title="Suppliers" value={140} formatter={formatter} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Products"
              value={2450}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic title="Vendors" value={77} formatter={formatter} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Stores"
              value={124}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
      <PieChart data={pieChartData} />
    </>
  );
};

export default Dashboard;
