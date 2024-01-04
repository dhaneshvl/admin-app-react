import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const { CanvasJSChart } = CanvasJSReact;

const PieChart = ({ data }) => {
  const options = {
    exportEnabled: true,
    animationEnabled: true,
    printEnabled: false, 
    title: {
      text: "Monthly sales category wise",
      fontSize: 20, // Adjust the font size as needed
    },
    data: [{
      type: "pie",
      startAngle: 75,
      toolTipContent: "<b>{label}</b>: {y}%",
      showInLegend: "true",
      legendText: "{label}",
      indexLabelFontSize: 16,
      indexLabel: "{label} - {y}%",
      dataPoints: data,
    }],
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default PieChart;