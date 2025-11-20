// import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from "./components/Sidebar.tsx";
import Title from "./components/Title.tsx";
import {BrowserRouter} from "react-router-dom";
import Main from "./components/Main.tsx";

function App() {
    // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <Title/>
        <Main/>
        <Sidebar/>
    </BrowserRouter>
  )
}

export default App
