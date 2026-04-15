import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import CsvDownloader from 'react-csv-downloader';
import { toSentenceCase } from '../../utils/helper';
import { downloadAsPdf } from '../popup/DownloadInPdf';

const ReportDownloadDropdown = ({ name, data, csvData, csvRequiredKeys, reportName = 'report' }) => {
    const [show, setShow] = useState(false);

    const updatedCsvData = csvData?.length && csvData.map((row, index) => ({
        serial_no: index + 1,
        ...row,
    }));

    const updatedCsvRequiredKeys = ['serial_no', ...csvRequiredKeys];

    // 🔸 Generate QIF
    const generateQIF = (transactions) => {
        let qif = '!Type:Bank\n';
        transactions.forEach((row) => {
            const date = row.date || row.transaction_date || '';
            const amount = row.amount || row.total || 0;
            const payee = row.payee || row.description || '';
            const category = row.category || 'Uncategorized';

            qif += `D${date}\n`;
            qif += `T${amount}\n`;
            qif += `P${payee}\n`;
            qif += `L${category}\n`;
            qif += '^\n';
        });
        return qif;
    };

    // 🔸 Generate QFX (XML-like)
    const generateQFX = (transactions) => {
        const header = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <STMTRS>
        <BANKTRANLIST>
`;

        const transactionsXml = transactions.map((row, index) => {
            const date = (row.date || row.transaction_date || '').replace(/[-/]/g, '');
            const amount = row.amount || row.total || 0;
            const payee = row.payee || row.description || 'Unknown';
            const category = row.category || 'Uncategorized';
            const type = amount >= 0 ? 'CREDIT' : 'DEBIT';
            const id = row.serial_no || index + 1;

            return `
          <STMTTRN>
            <TRNTYPE>${type}</TRNTYPE>
            <DTPOSTED>${date}</DTPOSTED>
            <TRNAMT>${amount}</TRNAMT>
            <FITID>${id}</FITID>
            <NAME>${payee}</NAME>
            <MEMO>${category}</MEMO>
          </STMTTRN>`;
        }).join('\n');

        const footer = `
        </BANKTRANLIST>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>`;

        return header + transactionsXml + footer;
    };

    const handleDownloadReport = (type) => {
        setShow(!show);
        if (!csvData || csvData?.length === 0) return;
        console.log("Data from report download dropdown", csvData);

        if (type === 'pdf') {
            downloadAsPdf(updatedCsvRequiredKeys, updatedCsvData, reportName);
        } else if (type === 'excel') {
            const content =
                updatedCsvRequiredKeys.join(',') + '\n' +
                updatedCsvData
                    .map(row =>
                        updatedCsvRequiredKeys.map(key => {
                            const cell = row[key] ?? '';
                            return `"${String(cell).replace(/"/g, '""')}"`;
                        }).join(',')
                    ).join('\n');

            const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${reportName}.xls`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (type === 'qif') {
            const qifData = generateQIF(updatedCsvData);
            const blob = new Blob([qifData], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${reportName}.qif`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (type === 'qfx') {
            const qfxData = generateQFX(updatedCsvData);
            const blob = new Blob([qfxData], { type: 'text/xml' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${reportName}.qfx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const columns =
        updatedCsvData?.length > 0
            ? updatedCsvRequiredKeys.map((key) => ({
                id: key,
                displayName: toSentenceCase(key),
            }))
            : [];

    return (
        <Dropdown style={{ display: 'inline-block', marginLeft: '10px' }}>
            <Dropdown.Toggle
                variant=""
                id="dropdown-basic"
                className="no-caret"
                style={{
                    border: "none",
                    boxShadow: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#fff",
                    padding: "8px 16px",
                    height: "52px",
                    backgroundColor: "#3182CE",
                    minWidth: "160px",
                }}
            >
                <img
                    src="./images/download-icon.svg"
                    alt=""
                    style={{ width: "16px", height: "16px" }}
                />
                {name}
            </Dropdown.Toggle>

            <Dropdown.Menu
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '8px 0',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
                    minWidth: '200px'
                }}
            >
                {/* PDF */}
                <Dropdown.Item
                    onClick={() => handleDownloadReport('pdf')}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#969595'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Download in PDF
                </Dropdown.Item>

                {/* CSV/Excel */}
                <Dropdown.Item as="div" style={{ padding: 0 }}>
                    <CsvDownloader
                        filename={reportName}
                        extension=".csv"
                        columns={columns}
                        datas={updatedCsvData}
                    >
                        <span
                            style={dropdownItemStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#969595'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Download in Excel
                        </span>
                    </CsvDownloader>
                </Dropdown.Item>

                {/* QIF */}
                <Dropdown.Item
                    onClick={() => handleDownloadReport('qif')}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#969595'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Download in QIF
                </Dropdown.Item>

                {/* 🔹 QFX */}
                <Dropdown.Item
                    onClick={() => handleDownloadReport('qfx')}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#969595'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Download in QFX
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

// 🔹 Shared Style
const dropdownItemStyle = {
    padding: '10px 16px',
    fontSize: '14px',
    color: '#0B0C2A',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
};

export default ReportDownloadDropdown;
