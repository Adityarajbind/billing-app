import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
function App() {
  const values = import.meta.env.VITE_VALUES.split(',');
  const address = values[0] + ","  +values[1] +","+values[2];
  const [gst, setgst] = useState(values[4]);
  const [email, setEmail] = useState(values[3])
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
      const response = await fetch("/billing-app/invoice-template.docx");
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
        gst_no:gst, 
        email:email,
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
    <>
      <h1 className="heading">Invoice Generator</h1>
      <div className="info">

      <h2>To :</h2>
      <textarea
        placeholder="To"
        value={to}
        onChange={(e) => setto(e.target.value)}
        style={{ width: "100%", height: "5rem" }}
      />
      
      <h2>Invoice no :</h2>
      <input
        placeholder="Invoice No"
        value={invoice_no}
        onChange={(e) => setinvoice_no(e.target.value)}
      />
     
     <h2>CH no:</h2>
      <input
        placeholder="CH No"
        value={ch_no}
        onChange={(e) => setch_no(e.target.value)}
      />
     
     <h2>Our CH no:</h2>
      <input
        placeholder="Our CH No"
        value={our_ch_no}
        onChange={(e) => setour_ch_no(e.target.value)}
      />
     
     <h2>Po NO :</h2>
      <input
        placeholder="PO No"
        value={po_no}
        onChange={(e) => setpo_no(e.target.value)}
      />

      <h2>Date:</h2>
      <input
        placeholder="Date"
        value={date}
        onChange={(e) => setdate(e.target.value)}
      />
       
      <h2>CUS GSTIN No:</h2>
      <input
        placeholder="Customer GST No"
        value={cus_gst_no}
        onChange={(e) => setcus_gst_no(e.target.value)}
      />
     
      </div>

      <br />
      <h3>ITEMS</h3>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: 10 }} className="item">
          <h3 style={{alignSelf:"start"}}>Particular : </h3>
          <textarea
            placeholder="Particular"
            value={item.particular}
            onChange={(e) =>
              handleItemChange(index, "particular", e.target.value)
            }
            style={{ width: "100%", height: "5rem" }}
          />
          <div className="part1">
          <h3>HSN :</h3>
          <h3>Qty :</h3>
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
          </div>
          <div className="part2">
          <h3>Rate :</h3>
          <h3>Amount :</h3>
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
          </div>
          <button
            onClick={() => removeItem(index)}
            disabled={items.length <= 1}
          >
            <img src="trash.svg" alt="Delete entry" />
          </button>
        </div>
      ))}
      <button onClick={addItem} className="add_btn">Add&#43;</button>

      <br />
      <br />
      <div className="info">

      <h2>SUB TOTAL : </h2>
       <input
         placeholder="Sub Total"
         value={sub_total}
         onChange={(e) => setsub_total(e.target.value)}
       />
      
      <h2>CGST : </h2>
       <input
         placeholder="CGST"
         value={cgst}
         onChange={(e) => setcgst(e.target.value)}
       />
      
      <h2>SGST : </h2>
       <input
         placeholder="SGST"
         value={sgst}
         onChange={(e) => setsgst(e.target.value)}
       />
      
      <h2>G. TOTAL</h2>
       <input
         placeholder="Total"
         value={total}
         onChange={(e) => settotal(e.target.value)}
       />
      
      
     
      </div>
     

      <button onClick={generateDoc} className="add_btn" style={{margin:"1rem"}}>Download DOCX</button>
    </>
  );
}

export default App;
