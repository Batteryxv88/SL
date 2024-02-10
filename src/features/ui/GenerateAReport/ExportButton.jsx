import { ExcelFile, ExcelSheet, ExcelColumnGroup, ExcelColumn } from 'react-data-export';

const ExportButton = (data) => {
    return (
      <ExcelFile element={<button>Export to Excel</button>}>
        <ExcelSheet data={[data]} name="Sheet 1">
          <ExcelColumn label="Machine" value="machine" />
          <ExcelColumn label="Period" value="period" />
          <ExcelColumn label="Toner Y" value="tonerY" />
          <ExcelColumn label="Toner M" value="tonerM" />
          <ExcelColumn label="Toner C" value="tonerC" />
          <ExcelColumn label="Toner K" value="tonerK" />
          <ExcelColumnGroup label="Parts">
            <ExcelColumn label="Part N" value="parts.partN" />
            <ExcelColumn label="Part Name" value="parts.partName" />
            <ExcelColumn label="Quantity" value="parts.quantity" />
          </ExcelColumnGroup>
        </ExcelSheet>
      </ExcelFile>
    );
  };

  export default ExportButton;