import React, { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';

const ProductDonutChart = ({ productList }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Cleanup previous chart instance before rendering a new one
    if (chartRef.current && chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }
  }, [productList]);

  const productNames = productList.map(product => product.name);
  const contributions = productList.map(product => product.contribution);

  const data = {
    labels: productNames,
    datasets: [
      {
        data: contributions,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          // Add more colors if needed
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          // Add more colors if needed
        ],
      },
    ],
  };

  return (
    <Doughnut
      ref={chartRef}
      data={data}
      options={{
        title: {
          display: true,
          text: 'Product Contribution Percentage',
          fontSize: 16,
        },
        legend: {
          display: true,
          position: 'right',
        },
      }}
    />
  );
};

export default ProductDonutChart;
