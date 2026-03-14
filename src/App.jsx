  import { useState,useEffect } from "react";
  import "./App.css";

  import tablet1img from "./assets/tablet1.png";
  import tablet2img from "./assets/tablet2.png";
  import tablet3img from "./assets/tablet3.png";
  import tablet4img from "./assets/tablet4.png";

  export default function App(){

    const [page,setPage]=useState("welcome");
    const [code,setCode]=useState("");
    const [medicines,setMedicines]=useState([]);
    const [apiUrl,setApiUrl] = useState("");
    useEffect(()=>{

    fetch("/config.json")
    .then(res=>res.json())
    .then(data=>{
      console.log("API URL:", data.api_url)
      window.API_URL = data.api_url;

      setApiUrl(data.api_url);
      
    });

  },[]);

  const verifyCode = async () => {

    if (!window.API_URL) {
      alert("API not loaded yet. Please wait and try again.");
      return;
    }

    if (!code) {
      alert("Enter Prescription Code");
      return;
    }

    try {

      const formattedCode = code.toUpperCase();
      const url = `${window.API_URL}/verify-code/${formattedCode}`;

      console.log("Calling:", url);

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        }
      });

      const data = await res.json();

      console.log("API response:", data);
  console.log("Medicines array full:", data.medicines);

  const apiMeds = Array.isArray(data.medicines) ? data.medicines : [];

  apiMeds.forEach((m, i) => {
    console.log(`Medicine ${i}:`, m);
  });

      if (data.valid === true) {

        const machineStock = [
    {id:1,name:"Paracetamol",price:20,stock:50,image:tablet1img},
    {id:2,name:"Ibuprofen",price:25,stock:50,image:tablet2img},
    {id:3,name:"Amoxicillin",price:30,stock:50,image:tablet3img},
    {id:4,name:"Cough Syrup",price:35,stock:50,image:tablet4img},
    {id:5,name:"Vitamin C",price:40,stock:50,image:tablet1img},
    {id:6,name:"Tablet 6",price:22,stock:50,image:tablet2img},
    {id:7,name:"Tablet 7",price:26,stock:50,image:tablet3img},
    {id:8,name:"Tablet 8",price:28,stock:50,image:tablet4img},
    {id:9,name:"Tablet 9",price:32,stock:50,image:tablet1img},
    {id:10,name:"Tablet 10",price:34,stock:50,image:tablet2img},
    {id:11,name:"Tablet 11",price:15,stock:50,image:tablet3img},
    {id:12,name:"Tablet 12",price:18,stock:50,image:tablet4img},
    {id:13,name:"Tablet 13",price:21,stock:50,image:tablet1img},
    {id:14,name:"Tablet 14",price:24,stock:50,image:tablet2img},
    {id:15,name:"Tablet 15",price:27,stock:50,image:tablet3img}
  ];

  const prescription = {};

  apiMeds.forEach(m => {
    const medId = m.id || m.medicine_id || m.med_id || m.name;
    const qty = m.qty || m.quantity || 0;

    if (medId !== undefined && medId !== null) {
      prescription[Number(medId)] = qty;
    }
  });

  console.log("Prescription lookup:", prescription);

        console.log("Prescription lookup:", prescription);

        const meds = machineStock.map(m => {
          const qty = prescription[m.id] || 0;

          return {
            ...m,
            qty,
            prescribed: qty > 0
          };
        });

        console.log("Final medicines:", meds);

        setMedicines(meds);
        setPage("medicines");

      } else {
        alert("Invalid Prescription Code");
      }

    } catch (err) {
      console.error(err);
      alert("Machine connection failed");
    }

  };
  const updateQty = (id, change) => {

    setMedicines(prev =>
      prev.map(m => {

        if(m.id !== id) return m;

        const newQty = (m.qty || 0) + change;

        return {
          ...m,
          qty: Math.max(0, Math.min(3, newQty))   // 0 to 3 limit
        };

      })
    );

  };

  const total = medicines.reduce((s,m)=>s + ((m.qty || 0) * (m.price || 0)),0);

    /* -------- WELCOME -------- */

    if(page==="welcome"){
      return(
        <div className="center">
          <h1 className="machineBrand">MEDI-O-TRON</h1>
          <h3 style={{opacity:.8}}>Smart Medicine Dispensing System</h3>
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
            <input
  value={code}
  onChange={e=>setCode(e.target.value)}
  autoComplete="off"
/>
            <br/><br/>
            <button onClick={verifyCode}>Verify</button>
          </div>
        </div>
      )
    }

    /* -------- MEDICINES -------- */


  /* -------- MEDICINES -------- */

  if(page==="medicines"){

    const prescribed = medicines.filter(m=>m.prescribed);
    const others = medicines.filter(m=>!m.prescribed);

    const total = medicines.reduce((s,m)=>s + ((m.qty || 0)*(m.price || 0)),0);

    return(
      <div className="container">

        {/* PRESCRIBED */}

        {prescribed.length > 0 && (
        <>
        <h2 className="sectionHeader title-prescribed">
          Prescribed Medicines
        </h2>

        <div className="medicineGrid">

          {prescribed.map((m,i)=>(
            <div className="medicineCard" key={m.id || i}>

              <img src={m.image}/>

              <h3>{m.name}</h3>

              <p>₹{m.price}</p>

              <div className="qty">

                <button onClick={()=>updateQty(m.id,-1)}>-</button>

                <span>{m.qty}</span>

                <button onClick={()=>updateQty(m.id,1)}>+</button>

              </div>

            </div>
          ))}

        </div>
        </>
        )}


        {/* OTHER */}

        <h2 className="sectionHeader title-other">
          Other Medicines
        </h2>

        <div className="medicineGrid">

          {others.map((m,i) =>(
            <div className="medicineCard" key={m.id}>

              <img src={m.image}/>

              <h3>{m.name}</h3>

              <p>₹{m.price}</p>

              <div className="qty">

                <button onClick={()=>updateQty(m.id,-1)}>-</button>

                <span>{m.qty}</span>

                <button onClick={()=>updateQty(m.id,1)}>+</button>

              </div>

            </div>
          ))}

        </div>

        <button
          className="checkoutBtn"
          onClick={()=>setPage("summary")}
        >
          Checkout ₹{total}
        </button>

      </div>
    )
  }/* -------- SUMMARY -------- */

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
            <button
    onClick={async () => {

      try {
        setPage("dispensing");

        const res = await fetch(`${window.API_URL}/pick`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "ngrok-skip-browser-warning":"true"
          
          },
            body: JSON.stringify({
      code: code.toUpperCase()
    })
        });

        const data = await res.json();
        console.log(data);
      
      setPage("complete");
            // wait 5 seconds then go to home
      setTimeout(() => {
        setCode("");          // clear previous code
        setMedicines([]);     // clear selected medicines
        setPage("welcome");
      }, 3000);

        

      } catch (err) {
        console.error(err);
        alert("Machine connection failed");
      }

    }}
  >
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
        
          </div>
        </div>
      )
    }
    if (page === "complete") {
    return (
      <div className="center">
        <div className="glass">
          <h1 style={{color:"#4CAF50"}}>
            Medicines Successfully Dispensed
          </h1>
          <h3>Please collect from the tray</h3>
          <h3>Returning to home...</h3>
        </div>
      </div>
    )
  }

  } 
