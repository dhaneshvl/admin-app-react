import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';

const formatter = (value) => <CountUp end={value} separator="," />;
const Dashboard = () => (
  <div>
    <Row gutter={16}>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="Active"
            value={11.28}
            precision={2}
            valueStyle={{
              color: '#3f8600',
            }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="Idle"
            value={9.3}
            precision={2}
            valueStyle={{
              color: '#cf1322',
            }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        </Card>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Card>
          <Statistic title="Last Month Sales (INR)" value={67850} formatter={formatter} />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <Statistic title="Total Sales (INR)" value={112893} precision={2} formatter={formatter} />
        </Card>
      </Col>
    </Row>
  </div>
);

export default Dashboard;
