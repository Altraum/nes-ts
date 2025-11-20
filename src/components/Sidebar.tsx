import {Link} from "react-router-dom";

export default function Sidebar() {
    return (
        <nav>
            <div><Link to="/">Home</Link></div>
            <div><Link to="/cpu">CPU Reader</Link></div>
            <div><Link to="/ppu">PPU Viewer</Link></div>
        </nav>
    )
}