import { useState } from "react";
import "./App.css";
import tablet1img from "./assets/tablet1.png"

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

    if(!code) return;

    // 🔹 Replace later with DB fetch
    const data=[
      {id:1,name:"Paracetamol",price:2,stock:120,qty:10,prescribed:true,image: tablet1img},
      {id:2,name:"Amoxicillin",price:12,stock:60,qty:5,prescribed:true,image:"https://via.placeholder.com/80"},
      {id:3,name:"Vitamin C",price:5,stock:200,qty:0,prescribed:false,image:"https://via.placeholder.com/80"},
      {id:4,name:"Cough Syrup",price:85,stock:30,qty:0,prescribed:false,image:"https://via.placeholder.com/80"},
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
        <h1 style={{
          color:"#8c3a19",
          letterSpacing:"0.12em",
          fontFamily:"'Orbitron', sans-serif",
          fontWeight:700
        }}>
          MEDI-O-TRON
        </h1>
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

        <div className="medicineLayout">

          {/* 🔹 TOP FIXED PRESCRIBED */}
          <div className="prescribedBox">
            <h3>Prescribed Medicines</h3>

            {medicines.filter(m=>m.prescribed).map(m=>(
              <div className="card" key={m.id}>
                <img src={m.image}/>
                <div className="info">
                  <b>{m.name}</b>
                  <p>₹{m.price}/tab • Stock {m.stock}</p>
                  <div className="qty">
                    <button onClick={()=>updateQty(m.id,-1)}>-</button>
                    {m.qty}
                    <button onClick={()=>updateQty(m.id,1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 SCROLLABLE OTHER MEDS */}
          <div className="otherBox">
            <h3>Other Medicines</h3>

            {medicines.filter(m=>!m.prescribed).map(m=>(
              <div className="card" key={m.id}>
                <img src={m.image}/>
                <div className="info">
                  <b>{m.name}</b>
                  <p>₹{m.price} • Stock {m.stock}</p>
                  <div className="qty">
                    <button onClick={()=>updateQty(m.id,-1)}>-</button>
                    {m.qty}
                    <button onClick={()=>updateQty(m.id,1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 🔹 CHECKOUT BAR */}
        <div className="floatingBar">
          <button className="checkoutBtn" onClick={()=>setPage("summary")}>
            Checkout ₹{total}
          </button>
        </div>

      </div>
    )
  }

  if(page==="summary"){
    return(
      <div className="center">

        <h2>Order Summary</h2>

        <div className="summaryBox">
          {medicines.filter(m=>m.qty>0).map(m=>(
            <p key={m.id}>{m.name} × {m.qty} = ₹{m.qty*m.price}</p>
          ))}
          <hr/>
          <h3>Total ₹{total}</h3>
        </div>

        <button onClick={()=>setPage("payment")}>Proceed to Payment</button>

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