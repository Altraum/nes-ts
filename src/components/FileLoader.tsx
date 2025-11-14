import {type ChangeEvent, useState} from "react";
import {Nes} from "../hardware/Nes.ts";
const nes : Nes = new Nes();

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
            nes.setRom(reader.result);

            console.log(nes.getRom());

            nes.runCpu();
        }

        reader.readAsArrayBuffer(file);
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
        </div>
    )
}