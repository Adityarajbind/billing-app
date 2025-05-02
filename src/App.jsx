import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

function App() {
  const address = import.meta.env.ADDRESS;
  const gst = import.meta.env.GST_NO;
  const email = import.meta.env.EMAIL;

  const [to, setto] = useState("");
  const [invoice_no, setinvoice_no] = useState("");
  const [date, setdate] = useState("");
  const [ch_no, setch_no] = useState("");
  const [our_ch_no, setour_ch_no] = useState("");
  const [po_no, setpo_no] = useState("");
  const [cus_gst_no, setcus_gst_no] = useState("");
  const [sub_total, setsub_total] = useState("");
  const [cgst, setcgst] = useState("");
  const [sgst, setsgst] = useState("");
  const [total, settotal] = useState("");

  const [items, setItems] = useState([
    { sr_no: 1, particular: "", hsn: "", qty: "", rate: "", amount: "" },
  ]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        sr_no: items.length + 1,
        particular: "",
        hsn: "",
        qty: "",
        rate: "",
        amount: "",
      },
    ]);
  };

  const removeItem = (index) => {
    const updated = items
      .filter((_, i) => i !== index)
      .map((item, i) => ({
        ...item,
        sr_no: i + 1,
      }));
    setItems(updated);
  };

  function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year}-${hours}:${minutes}`;
  }

  const generateDoc = async () => {
    console.log("generating doc")
    try {
      const response = await fetch("/invoice-template.docx");
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.setData({
        to,
        invoice_no,
        date,
        ch_no,
        our_ch_no,
        po_no,
        cus_gst_no,
        sub_total,
        cgst,
        sgst,
        total,
        address:address,
        gst:gst_no, 
        eamil:email,
        items: items.filter((item) => item.particular.trim() !== ""), // remove empty rows
      });

      doc.render();
      const out = doc.getZip().generate({ type: "blob" });
      saveAs(out, `INVOICE-${getCurrentDateTime()}.docx`);
    } catch (error) {
      console.error("Failed to generate document", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Invoice Generator</h2>
      <input
        placeholder="To"
        value={to}
        onChange={(e) => setto(e.target.value)}
      />
      <br />
      <input
        placeholder="Invoice No"
        value={invoice_no}
        onChange={(e) => setinvoice_no(e.target.value)}
      />
      <br />
      <input
        placeholder="Date"
        value={date}
        onChange={(e) => setdate(e.target.value)}
      />
      <br />
      <input
        placeholder="CH No"
        value={ch_no}
        onChange={(e) => setch_no(e.target.value)}
      />
      <br />
      <input
        placeholder="Our CH No"
        value={our_ch_no}
        onChange={(e) => setour_ch_no(e.target.value)}
      />
      <br />
      <input
        placeholder="PO No"
        value={po_no}
        onChange={(e) => setpo_no(e.target.value)}
      />
      <br />
      <input
        placeholder="Customer GST No"
        value={cus_gst_no}
        onChange={(e) => setcus_gst_no(e.target.value)}
      />
      <br />
      <input
        placeholder="Sub Total"
        value={sub_total}
        onChange={(e) => setsub_total(e.target.value)}
      />
      <br />
      <input
        placeholder="CGST"
        value={cgst}
        onChange={(e) => setcgst(e.target.value)}
      />
      <br />
      <input
        placeholder="SGST"
        value={sgst}
        onChange={(e) => setsgst(e.target.value)}
      />
      <br />
      <input
        placeholder="Total"
        value={total}
        onChange={(e) => settotal(e.target.value)}
      />
      <br />
      <br />

      <h3>Items</h3>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <input
            placeholder="Particular"
            value={item.particular}
            onChange={(e) =>
              handleItemChange(index, "particular", e.target.value)
            }
          />
          <input
            placeholder="HSN"
            value={item.hsn}
            onChange={(e) => handleItemChange(index, "hsn", e.target.value)}
          />
          <input
            placeholder="Qty"
            value={item.qty}
            onChange={(e) => handleItemChange(index, "qty", e.target.value)}
          />
          <input
            placeholder="Rate"
            value={item.rate}
            onChange={(e) => handleItemChange(index, "rate", e.target.value)}
          />
          <input
            placeholder="Amount"
            value={item.amount}
            onChange={(e) => handleItemChange(index, "amount", e.target.value)}
          />
          <button
            onClick={() => removeItem(index)}
            disabled={items.length <= 1}
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={addItem}>Add Item</button>
      <br />
      <br />

      <button onClick={generateDoc}>Generate DOCX</button>
      <h1>ehllo</h1>
    </div>
  );
}

export default App;
