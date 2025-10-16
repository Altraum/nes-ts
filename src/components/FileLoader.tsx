import {type ChangeEvent, useState} from "react";
import { Rom } from "../hardware/Rom.ts"
import {Cpu} from "../hardware/Cpu.ts";
import CopyToClipboardButton from "./CopyToClipboardButton.tsx";

let cpu : Cpu
let log : string

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null)

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if(e.target.files) {
            setFile(e.target.files[0]);
            if(file){
                loadReader(file);
            }
        }
    }

    function loadReader(file: File) {
        const reader = new FileReader();

        reader.onload = () => {
            const rom = new Rom(reader.result);
            // let i = 0;
            // while (i <= 20){
            //     console.log(i + ": " + typedArray[i].toString(16));
            //     i += 1;
            // }
            console.log(rom);

            cpu = new Cpu(rom);
            log = cpu.get_log()
        }

        reader.readAsArrayBuffer(file);
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
            <CopyToClipboardButton log = {log}/>
        </div>
    )
}