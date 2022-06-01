import './App.css';
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const socket = io("ws://localhost:4020")

function App() {

  const [emitCount, setemitCount] = useState(0)
  const [chartData, setchartData] = useState([
    {
      name : '0',
      value: 0
    }
  ])

  useEffect(() => {
    socket.on('connect',() => {
      console.log("Created Socket ID is ",socket.id);

      socket.emit('initialize-data',true)

      socket.on('receive-data',(arg) => {
        setchartData((state) => [...state, {name: (parseFloat(state[state.length - 1].name,10) + 0.1 ).toFixed(2), value: arg} ]);
        //setemitCount((state) => state + 1) 
      })

    })
  },[])

  const add_to_chart = () => {
    socket.emit('stop-interval',true)
  }



  

  return (
    <div className="App">
        <h1 style={{textAlign:'center'}}> Chart </h1>

      <div style={{width:'100%',height:300}}>  
        <ResponsiveContainer>
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            
          </LineChart>
        </ResponsiveContainer>
      </div> 

      {chartData.length > 1 ? <button onClick={add_to_chart}>Stop</button> : null } 
    </div>
  );
}

export default App;
