import html2pdf from 'html2pdf.js';
import { pdfStyles } from './pdfStyle';

export const exportToPDF = (genratedReconciliation,attorneyFormData, bankFormData, attorneySignePrivew, bankSignePrivew, reportName = "Reconciliation_Certificate") => {
  
  const reconciliationHtml = `
  <head>
<style>${pdfStyles}</style>
</head>
<body>
<div style="padding: 10px; background-color: #fff; font-family: Arial, color: #ccc sans-serif; font-size: 14px; width: 100%;">
  <h1 style="text-align: center; margin-bottom: 30px;">FIRM RECORDS - ACCOUNT BALANCES</h1>
  <!-- Section 1 -->
  <div style="margin-bottom: 20px; color: #333;">
  <h3 style="margin-bottom: 5px;">1. TRUST ACCOUNT JOURNAL BALANCE</h3>
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
    <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;">
      Does each entry contain the information required by Standard (1)(b), adopted pursuant to rule 1.15(e)? 
      (client name, date, amount, payor/payee, current balance)
    </p>
    <strong style="min-width: 120px; text-align: center; padding: 6px 12px; border: 1px solid black; border-radius: 4px; color: #333;">
      $${genratedReconciliation?.journal_balance}
    </strong>
  </div>
</div>


  <!-- Section 2 -->
  <div style="margin-bottom: 10px; color: #333;">
    <h3 style="margin-bottom: 5px;">2 TOTAL OF ALL INDIVIDUAL LEDGER BALANCES</h3>

   <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;" >A. Do all of the client ledgers have a positive or zero balance? If no, attach an explanation, including any corrective action taken.</p>
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
    <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;" >Does each entry contain the information required by Standard (1)(b), adopted pursuant to rule
      1.15(e)? (date, amount, payor/payee, purpose, current balance)
     If no, attach an explanation, including any corrective action taken.</p>
     <strong style="min-width: 120px; text-align: center; padding: 6px 12px; border: 1px solid black; border-radius: 4px; color: #333;">
     $${genratedReconciliation?.total_individual_ledger_balance}
    </strong>
    </div>
  </div>

  <div style="margin-bottom: 10px; color: #333;">
    <h3 style="margin-bottom: 5px;">B. Total Bank Charges Balance in Trust Account</h3>
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
    <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;" >In compliance with rule 1.15(c)(1), are the firm funds in the account no more than reasonably
      sufficient to pay bank charges?
      If no, attach an explanation, including any corrective action taken.</p>
    <strong style="min-width: 120px; text-align: center; padding: 6px 12px; border: 1px solid black; border-radius: 4px; color: #333;">
      $${genratedReconciliation?.bank_charges_ledger_balance}
    </strong>
    </div>
  </div>

  <div style="margin-bottom: 10px; color: #333;">
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
  <h3>TOTAL 2. INDIVIDUAL LEDGERS (A+B) (automatically calculated)</h3>
    <strong style="min-width: 120px; text-align: center; padding: 6px 12px; border: 1px solid black; border-radius: 4px; color: #333;">
      ${genratedReconciliation?.total_ledger_balance}
    </strong>

    </div>
  </div>

  <h1 style="text-align: center; margin-bottom: 30px;">BANK RECORDS - ACCOUNT BALANCES</h1>
  <div style="margin-bottom: 5px; color: #333;">
    <h3>3. ADJUSTED BANK STATEMENT BALANCE</h3>
     <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;"> 
     <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;" >A. Bank Statement Ending Balance: </p>
      <strong style="min-width: 120px; text-align: center; padding: 6px 12px; border: 1px solid black; border-radius: 4px; color: #333;">
      $${genratedReconciliation?.bank_statement_ending_balance}
    </strong>

     </div>
     <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
     <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;" >B. Add Outstanding Deposits (total deposits made to the account through the end of bank statement period, but not reflected on bank statement) </p>
      <strong style="min-width: 120px; text-align: center; padding: 6px 12px; border: 1px solid black; border-radius: 4px; color: #333;">
      $${genratedReconciliation?.total_outstanding_deposits}
    </strong>
     
     </div>
     <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;"> 
     <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;" >C. Less Outstanding Disbursements (checks and other disbursements made through the end of the bank statement period, but not reflected in bank statement) </p>

     <strong style="min-width: 120px; text-align: center; padding: 6px 12px; border: 1px solid black; border-radius: 4px; color: #333;">
     -$${genratedReconciliation?.total_outstanding_disbursment}
    </strong>
     </div>
      <div style=" color: #333;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; color: #333;"> 
      <h3>TOTAL 3. (A+B-C) ADJUSTED BANK STATEMENT BALANCE (automatically calculated) </h3>
       <strong style="min-width: 120px; text-align: center; padding: 6px 12px; border: 1px solid black; border-radius: 4px; color: #333;">
       $${genratedReconciliation?.adjusted_bank_statement_balance}
       </strong>
       </div>
       <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;">If no, your account is not reconciled. Identify the error(s) and re-reconcile the account.</p>
     </div>
  </div>

  <!-- Preparer Information -->

 <div style="margin-top: 20px; color:#333">
  <h1 style="text-align: center; margin-bottom: 10px;">BANK RECORDS - ACCOUNT BALANCES</h1>
  <div style="display: flex; gap: 40px; justify-content: space-between; align-items: flex-start; font-size: 14px;">
    <div style="text-align: center; color: #333; font-size: 14px;">
      <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;">${bankFormData.preparerName}</p>
      <strong style="color:#333; font-size: 14px; ">Preparer Name:</strong>
    </div>
    <div style="text-align: center; color: #333; font-size: 14px;">
      <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;">${bankFormData.position}</p>
      <strong style="color:#333; font-size: 14px;">Position:</strong>
    </div>
    <div>
      <p>${bankSignePrivew ? `<img src="${bankSignePrivew}" style="height: 35px; width: 80PX" />` : ""}</p>
       <strong style="color:#333; font-size: 14px; ">Signature</strong>
    </div>
    <div style="text-align: center; color: #333; font-size: 14px;">
      <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;">${bankFormData.date}</p>
      <strong style="color:#333; font-size: 14px; ">Date:</strong>
    </div>
   </div>
 </div>

    <!-- Attorney Certification -->
    <div style="margin-top: 10px; color: #333; ">
  <h1 style="text-align: center; margin-bottom: 5px; font-size: 14px;">Attorney Certification</h1>
  <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;">
    I certify that I personally reviewed the above trust account reconciliation report and all supporting documents listed above, and understand this reconciliation is not deemed complete until all discrepancies are resolved and balances agree. I acknowledge that I have a nondelegable duty and bear responsibility to ensure all funds are properly held, regardless of who prepared the reconciliation.
  </p>

  <div style="display: flex; gap: 40px; justify-content: space-between; align-items: flex-start; font-size: 14px; margin-top: 15px;">
    <div style="text-align: center; color: #333; font-size: 14px;">
      <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;">${attorneyFormData.attorneyName}</p>
      <strong style="color:#333; font-size: 14px; ">Attorney Name:</strong>
    </div>
    <div style="text-align: center; color: #333; font-size: 14px;">
      <p style="margin: 0; flex: 1; font-weight: 500;
  line-height: 1.6;
  color: #222;">${attorneyFormData.barNumber}</p>
      <strong style="color:#333; font-size: 14px; ">Bar Number:</strong>
    </div>
    <div style="text-align: center; color: #333; font-size: 14px;">
    <P> ${attorneySignePrivew ? `<img src="${attorneySignePrivew}" style="height: 35px; width: 80PX" />` : ""}</P>
      <strong style="color:#333; font-size: 14px; ">Signature</strong>
    </div>
    <div style="text-align: center; color: #333; font-size: 14px;">
      <p style="margin: 0; flex: 1; font-weight: 500;
      line-height: 1.6;
      color: #222;">${attorneyFormData.date}</p>
      <strong style="color:#333; font-size: 14px; ">Date:</strong>
    </div>
  </div>
 </div>

</div>
</body>
    
    `;


  const container = document.createElement('div');
  // container.style.position = 'absolute';
  // container.style.left = '-9999px'; // hide offscreen
  container.innerHTML = reconciliationHtml;
  document.body.appendChild(container);

  setTimeout(() => {
    html2pdf()
      .from(container)
      .set({
        margin: 10,
        filename: `${reportName}.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true
        },
        jsPDF: {
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        }
      })
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  }, 100);
};