import html2pdf from 'html2pdf.js';
import { toSentenceCase } from '../../utils/helper';



const chunkArray = (array, chunkSize) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
};


export const downloadAsPdf = (csvRequiredKeys, csvData, reportName = 'report') => {
  if (!csvData || csvData.length === 0) return;
  // Build the HTML table string
  const rowsPerPage = 12;
  const chunkedData = chunkArray(csvData, rowsPerPage);



//   const tableHtml = chunkedData.map((chunk, pageIndex) => `
//   <div style="
//     width: 100%;
//     height: 90%;
//     box-sizing: border-box;
//     page-break-after: always;
//     padding: 10px;
//     background-color: #fff;
//     position: relative;
//   ">
//     <h2 style="text-align: center; margin-bottom: 15px; font-size: 18px;">
//       ${reportName}
//     </h2>
//     <table style="
//       width: 100%;
//       border-collapse: collapse;
//       table-layout: fixed;
//       word-wrap: break-word;
//       font-size: 10px;
//     ">
//       <thead>
//         <tr>
//           ${csvRequiredKeys.map(key => `
//             <th style="
//               padding: 6px;
//               border: 1px solid #aaa;
//               background-color: #030F23;
//               color: #fff;
//               font-weight: 800;
//               max-width: 150px;
//               overflow-wrap: break-word;
//             ">
//               ${toSentenceCase(key)}
//             </th>
//           `).join('')}
//         </tr>
//       </thead>
//       <tbody>
//         ${chunk.map(row => `
//           <tr>
//             ${csvRequiredKeys.map(key => {
//               const cellText = row[key] ?? '';
//               const estimatedLength = String(cellText).length;

//               let fontSize = '9px';
//               if (estimatedLength > 100) fontSize = '7px';
//               else if (estimatedLength > 60) fontSize = '8px';

//               return `
//                 <td style="
//                   border: 1px solid #aaa;
//                   padding: 6px;
//                   color: rgb(7, 7, 7);
//                   font-weight: 400;
//                   overflow-wrap: break-word;
//                   word-break: break-word;
//                   font-size: ${fontSize};
//                 ">
//                   ${cellText}
//                 </td>
//               `;
//             }).join('')}
//           </tr>
//         `).join('')}
//       </tbody>
//     </table>

//     <div style="
//       position: absolute;
//       bottom: -10px;
//       right: 20px;
//       font-size: 12px;
//       color: #444;
//     ">
//       Page ${pageIndex + 1}
//     </div>
//   </div>
// `).join('');
const tableHtml = chunkedData.map((chunk, pageIndex) => `
  <div style="
    width: 100%;
    height: 90%;
    box-sizing: border-box;
    page-break-after: always;
    padding: 10px;
    background-color: #fff;
    position: relative;
  ">

    <div style="
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 12px;
      color: #444;
    ">
      Page ${pageIndex + 1}
    </div>

    <h2 style="text-align: center; margin-top: 30px; margin-bottom: 15px; font-size: 18px;">
      ${reportName}
    </h2>

    <table style="
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      word-wrap: break-word;
      font-size: 10px;
    ">
      <thead>
        <tr>
          ${csvRequiredKeys.map(key => `
            <th style="
              padding: 6px;
              border: 1px solid #aaa;
              background-color: #030F23;
              color: #fff;
              font-weight: 800;
              max-width: 150px;
              overflow-wrap: break-word;
            ">
              ${toSentenceCase(key)}
            </th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
        ${chunk.map(row => `
          <tr>
            ${csvRequiredKeys.map(key => {
              const cellText = row[key] ?? '';
              const estimatedLength = String(cellText).length;

              let fontSize = '9px';
              if (estimatedLength > 100) fontSize = '7px';
              else if (estimatedLength > 60) fontSize = '8px';

              return `
                <td style="
                  border: 1px solid #aaa;
                  padding: 6px;
                  color: rgb(7, 7, 7);
                  font-weight: 400;
                  overflow-wrap: break-word;
                  word-break: break-word;
                  font-size: ${fontSize};
                ">
                  ${cellText}
                </td>
              `;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
`).join('');


  const container = document.createElement('div');
  container.innerHTML = tableHtml;
  document.body.appendChild(container);

  setTimeout(() => {
    html2pdf()
      .from(container)
      .set({
        margin: [10, 10, 10, 10],
        filename: `${reportName}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
      })
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  }, 100);
};

