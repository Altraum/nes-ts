import About from "./About.tsx";
import CpuReader from "./CpuReader.tsx";
import {Route, Routes} from "react-router-dom";

export default function Main() {
    return (
        <main>
            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/cpu" element={<CpuReader />} />
            </Routes>
        </main>
    )
}