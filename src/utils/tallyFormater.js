const formatDate = (datetimeString) => {
    const dateObj = new Date(datetimeString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
}

const processInvoiceData = (data) => {
    const processedData = [];

    data.forEach((invoice, index) => {
        let serial = 1;
        const invoiceDate = formatDate(invoice.invoice_date);

        const firstRow = {
            "Voucher Date": invoiceDate,
            "Voucher Type Name": "Purchase",
            "Voucher Number": index + 1,
            "Reference No.": invoice.invoice_number,
            "Reference Date": invoiceDate,
            "Ledger Name": invoice.expense_allocation ? invoice.expense_allocation : "None",
            "Ledger Amount": parseFloat(invoice.net_amount),
            "Ledger Amount Dr/Cr": "Dr",
            "Change Mode": "As Voucher",
            "Voucher Narration": invoice.service_description,
            "Serial": serial
        }
        processedData.push(JSON.parse(JSON.stringify(firstRow)))
        serial++;


        if ((invoice.cgst_amount !== "Not Available" && invoice.cgst_amount !== null && invoice.cgst_amount !== 0) && (invoice.sgst_amount !== "Not Available" && invoice.sgst_amount !== null && invoice.sgst_amount !== 0)) {
            const cgstRow = {
                "Voucher Date": invoiceDate,
                "Voucher Type Name": "Purchase",
                "Voucher Number": index + 1,
                "Reference No.": invoice.invoice_number,
                "Reference Date": invoiceDate,
                "Ledger Name": "CGST Output",
                "Ledger Amount": parseFloat(invoice.cgst_amount),
                "Ledger Amount Dr/Cr": "Dr",
                "Change Mode": "As Voucher",
                "Voucher Narration": invoice.service_description,
                "Serial": serial
            }
            processedData.push(JSON.parse(JSON.stringify(cgstRow)));
            serial++;

            const sgstRow = {
                "Voucher Date": invoiceDate,
                "Voucher Type Name": "Purchase",
                "Voucher Number": index + 1,
                "Reference No.": invoice.invoice_number,
                "Reference Date": invoiceDate,
                "Ledger Name": "SGST Output",
                "Ledger Amount": parseFloat(invoice.sgst_amount),
                "Ledger Amount Dr/Cr": "Dr",
                "Change Mode": "As Voucher",
                "Voucher Narration": invoice.service_description,
                "Serial": serial
            }
            processedData.push(JSON.parse(JSON.stringify(sgstRow)));
            serial++;
        }

        if (invoice.igst_amount !== null && invoice.igst_amount !== "Not Available" && invoice.igst_amount !== 0) {
            const igstRow = {
                "Voucher Date": invoiceDate,
                "Voucher Type Name": "Purchase",
                "Voucher Number": index + 1,
                "Reference No.": invoice.invoice_number,
                "Reference Date": invoiceDate,
                "Ledger Name": "IGST Output",
                "Ledger Amount": parseFloat(invoice.igst_amount),
                "Ledger Amount Dr/Cr": "Dr",
                "Change Mode": "As Voucher",
                "Voucher Narration": invoice.service_description,
                "Serial": serial
            }
            processedData.push(JSON.parse(JSON.stringify(igstRow)));
            serial++;
        }

        if (invoice.tds !== "Not Available" && invoice.tds !== null) {
            const tdsRow = {
                "Voucher Date": invoiceDate,
                "Voucher Type Name": "Purchase",
                "Voucher Number": index + 1,
                "Reference No.": invoice.invoice_number,
                "Reference Date": invoiceDate,
                "Ledger Name": "TDS Payable",
                "Ledger Amount": parseFloat(invoice.tds),
                "Ledger Amount Dr/Cr": "Cr",
                "Change Mode": "As Voucher",
                "Voucher Narration": invoice.service_description,
                "Serial": serial
            }
            processedData.push(JSON.parse(JSON.stringify(tdsRow)));
            serial++;
        }

        const finalRow = {
            "Voucher Date": invoiceDate,
            "Voucher Type Name": "Purchase",
            "Voucher Number": index + 1,
            "Reference No.": invoice.invoice_number,
            "Reference Date": invoiceDate,
            "Ledger Name": invoice.issued_by,
            "Ledger Amount": parseFloat(invoice.total_price),
            "Ledger Amount Dr/Cr": "Cr",
            "Change Mode": "As Voucher",
            "Voucher Narration": invoice.service_description,
            "Serial": serial
        }
        processedData.push(JSON.parse(JSON.stringify(finalRow)));
        const blankRow = {
            "Voucher Date": '',
            "Voucher Type Name": '',
            "Voucher Number": '',
            "Reference No.": '',
            "Reference Date": '',
            "Ledger Name": '',
            "Ledger Amount": '',
            "Ledger Amount Dr/Cr": '',
            "Change Mode": '',
            "Voucher Narration": '',
            "Serial": ''
        }
        processedData.push(JSON.parse(JSON.stringify(blankRow)));
    });

    return processedData;
}

export default processInvoiceData;