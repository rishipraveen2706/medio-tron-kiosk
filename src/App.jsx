import { useState } from "react";
import "./App.css";
import tablet1img from "./assets/tablet1.png"
import tablet2img from "./assets/tablet2.png"
import tablet3img from "./assets/tablet3.png"
import tablet4img from "./assets/tablet4.png"

const proverbs = [
  "Health is wealth.",
  "An ounce of prevention is worth a pound of cure.",
  "A healthy outside starts from the inside.",
  "Prevention is better than cure.",
  "Take care of your body. It's the only place you have to live.",
  "The groundwork for all happiness is good health.",
  "He who has health has hope, and he who has hope has everything."
];

export default function App(){

  const [page,setPage] = useState("welcome");
  const [code,setCode] = useState("");
  const [medicines,setMedicines] = useState([]);

  // Pick a random proverb for each render of welcome page
  const proverb = proverbs[Math.floor(Math.random() * proverbs.length)];

  // -------- VERIFY PRESCRIPTION --------
  const verifyCode = ()=>{

    if(!code){
  alert("Please enter prescription code");
  return;
}

    // 🔹 Replace later with DB fetch
    const data=[
      {id:1,name:"Paracetamol (500mg)",price:2,stock:120,qty:10,prescribed:true,image: tablet1img},
      {id:2,name:"Amoxicillin (500 mg)",price:12,stock:60,qty:5,prescribed:true,image:tablet2img},
      {id:3,name:"Vitamin C",price:5,stock:200,qty:0,prescribed:false,image:tablet3img},
      {id:4,name:"Cough Syrup",price:85,stock:30,qty:0,prescribed:false,image:tablet4img},
    ];

    setMedicines(data);
    setPage("medicines");
  };

  // -------- QTY UPDATE --------
  const updateQty=(id,change)=>{
    setMedicines(prev=>prev.map(m=>
      m.id===id ? {...m,qty:Math.max(0,m.qty+change)} : m
    ));
  };

  const total = medicines.reduce((s,m)=>s+m.qty*m.price,0);

  // -------- DISPENSING API --------
  const startDispensing = async () => {

    setPage("dispensing");

    try{
      const response = await fetch("http://YOUR_PI_IP:5000/dispense",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          medicines: medicines.filter(m=>m.qty>0)
        })
      });

      const data = await response.json();

      if(data.status==="dispensed"){
        setTimeout(()=>{
          setMedicines([]);
          setCode("");
          setPage("welcome");
        },2000);
      }

    }catch(err){
      console.log(err);
      setTimeout(()=>{
        setPage("welcome");
      },2000);
    }
  };

  // ================= SCREENS m qty
  // =================

  if(page==="welcome"){
    return(
      <div className="center">
<h1 className="machineBrand">MEDI-O-TRON</h1>
        <div className="proverb">{proverb}</div>
        <p style={{fontSize:"2.1rem", color:"#232946", fontWeight:600, margin:"10px 0 20px 0"}}>Automated Medicines Dispensing System</p>
        <button onClick={()=>setPage("prescription")}>Start</button>
      </div>
    )
  }

  if(page==="prescription"){
    return(
      <div className="center">
        <h2>Enter Prescription Code</h2>
        <input value={code} onChange={e=>setCode(e.target.value)} />
        <button onClick={verifyCode}>Verify</button>
      </div>
    )
  }

  if(page==="medicines"){
  return(
    <div className="container">

      <h2 className="sectionHeader prescribedHeader">
  <span>Prescribed Medicines</span>
</h2>


      <div className="grid list">
        {medicines.filter(m=>m.prescribed).map(m=>(
          <div className="card" key={m.id}>
            <img src={m.image}/>
            <div className="info">
              <b>{m.name}</b>
              <p>₹{m.price}/tab • Stock {m.stock}</p>

              <div className="qty">
                <button onClick={()=>updateQty(m.id,-1)}>-</button>
                <span>{m.qty}</span>
                <button onClick={()=>updateQty(m.id,1)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <h2 className="sectionHeader otherHeader">
        <span>Other Medicines</span>
      </h2> 

      <div className="grid list">
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
      </div>

      {/* Floating checkout button at bottom right */}
      <div className="floatingBar" style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        left: "unset",
        width: "auto",
        padding: 0,
        background: "none",
        boxShadow: "none",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 10
      }}>
        <button className="checkoutBtn" style={{
          width: 160,
          maxWidth: 180,
          padding: "14px 0",
          borderRadius: 14,
          fontSize: 18
        }} onClick={()=>setPage("summary")}>
          Checkout ₹{total}
        </button>
      </div>

    </div>
  )
}

  if(page==="summary"){
  return(
    <div className="summaryPage">

      <h2 className="summaryTitle">Order Summary</h2>

      <div className="summaryCard">

        {medicines.filter(m=>m.qty>0).map(m=>(
          <div className="summaryRow" key={m.id}>
            <span className="medName">{m.name} × {m.qty}</span>
            <span className="medPrice">₹{m.qty*m.price}</span>
          </div>
        ))}

        <div className="summaryDivider"></div>

        <div className="summaryTotal">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

      </div>

      <button className="payBtn" onClick={()=>setPage("payment")}>
        Proceed to Payment
      </button>

    </div>
  )
}

  if(page==="payment"){
    return(
      <div className="center">
        <h2>Scan & Pay</h2>

        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?am=${total}`}
          className="qr"
        />

        <p>After payment press confirm</p>

        <button onClick={startDispensing}>
          Payment Done
        </button>
      </div>
    )
  }

  if(page==="dispensing"){
    return(
      <div className="center">
        <div className="dispenseBox">
          <h2>Your medicines are dispensing</h2>
          <div className="spinner"></div>
          <p>Please collect medicines from tray</p>
        </div>
      </div>
    )
  }

}