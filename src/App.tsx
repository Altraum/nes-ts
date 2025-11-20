// import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from "./components/Sidebar.tsx";
import Title from "./components/Title.tsx";
import CpuReader from "./components/CpuReader.tsx";

function App() {
    // const [count, setCount] = useState(0)

  return (
    <>
        <Title/>
        <CpuReader/>
        <Sidebar/>
    </>
  )
}

export default App
