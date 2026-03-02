import { useState } from "react";
import "./App.css";

import tablet1img from "./assets/tablet1.png";
import tablet2img from "./assets/tablet2.png";
import tablet3img from "./assets/tablet3.png";
import tablet4img from "./assets/tablet4.png";

export default function App(){

  const [page,setPage]=useState("welcome");
  const [code,setCode]=useState("");
  const [medicines,setMedicines]=useState([]);

  const verifyCode=()=>{
    if(!code) return alert("Enter code");

    const data=[
      {id:1,name:"Paracetamol 500mg",price:2,stock:120,qty:10,prescribed:true,image:tablet1img},
      {id:2,name:"Amoxicillin 500mg",price:12,stock:60,qty:5,prescribed:true,image:tablet2img},
      {id:3,name:"Vitamin C",price:5,stock:200,qty:0,prescribed:false,image:tablet3img},
      {id:4,name:"Cough Syrup",price:85,stock:30,qty:0,prescribed:false,image:tablet4img},
    ];

    setMedicines(data);
    setPage("medicines");
  };

  const updateQty=(id,c)=>{
    setMedicines(prev=>prev.map(m=>m.id===id?{...m,qty:Math.max(0,m.qty+c)}:m));
  };

  const total=medicines.reduce((s,m)=>s+m.qty*m.price,0);

  /* -------- WELCOME -------- */

  if(page==="welcome"){
    return(
      <div className="center">
        <h1 className="machineBrand">MEDI-O-TRON</h1>
        <p style={{opacity:.8}}>Smart Medicine Dispensing System</p>
        <button onClick={()=>setPage("prescription")}>Start</button>
      </div>
    )
  }

  /* -------- CODE -------- */

  if(page==="prescription"){
    return(
      <div className="center">
        <div className="glass">
          <h2 className="title-code">Enter Prescription Code</h2>
          <input value={code} onChange={e=>setCode(e.target.value)} />
          <br/><br/>
          <button onClick={verifyCode}>Verify</button>
        </div>
      </div>
    )
  }

  /* -------- MEDICINES -------- */

  if(page==="medicines"){
    return(
      <div className="container">

        <h2 className="sectionHeader title-prescribed">Prescribed Medicines</h2>

        {medicines.filter(m=>m.prescribed).map(m=>(
          <div className="card" key={m.id}>
            <img src={m.image}/>
            <div className="info">
              <b>{m.name}</b>
              <p>₹{m.price} • Stock {m.stock}</p>
              <div className="qty">
                <button onClick={()=>updateQty(m.id,-1)}>-</button>
                <span>{m.qty}</span>
                <button onClick={()=>updateQty(m.id,1)}>+</button>
              </div>
            </div>
          </div>
        ))}

        <h2 className="sectionHeader title-other">Other Medicines</h2>

        {medicines.filter(m=>!m.prescribed).map(m=>(
          <div className="card" key={m.id}>
            <img src={m.image}/>
            <div className="info">
              <b>{m.name}</b>
              <p>₹{m.price} • Stock {m.stock}</p>
              <div className="qty">
                <button onClick={()=>updateQty(m.id,-1)}>-</button>
                <span>{m.qty}</span>
                <button onClick={()=>updateQty(m.id,1)}>+</button>
              </div>
            </div>
          </div>
        ))}

        <button className="checkoutBtn" onClick={()=>setPage("summary")}>
          Checkout ₹{total}
        </button>

      </div>
    )
  }

  /* -------- SUMMARY -------- */

  if(page==="summary"){
    return(
      <div className="center">
        <div className="glass summaryCard">
          <h2 className="title-summary">Order Summary</h2>

          {medicines.filter(m=>m.qty>0).map(m=>(
            <div className="summaryRow" key={m.id}>
              <span>{m.name} × {m.qty}</span>
              <span>₹{m.qty*m.price}</span>
            </div>
          ))}

          <div className="summaryTotal">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <br/>
          <button onClick={()=>setPage("payment")}>
            Proceed to Payment
          </button>
        </div>
      </div>
    )
  }

  /* -------- PAYMENT -------- */

  if(page==="payment"){
    return(
      <div className="center">
        <div className="glass">
          <h2 className="title-pay">Scan & Pay</h2>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?am=${total}`} />
          <br/><br/>
          <button onClick={()=>setPage("dispensing")}>
            Payment Done
          </button>
        </div>
      </div>
    )
  }

  /* -------- DISPENSING -------- */

  if(page==="dispensing"){
    return(
      <div className="center">
        <div className="glass">
          <h2 className="title-dispense">Dispensing Medicines…</h2>
          <p>Please collect from tray</p>
        </div>
      </div>
    )
  }
}