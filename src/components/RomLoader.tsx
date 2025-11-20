import {type ChangeEvent, useState} from "react";

export default function RomLoader({setRom} : {setRom : (romData : ArrayBuffer) => void}) {
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
            setRom(reader.result);
        }

        reader.readAsArrayBuffer(file);
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
        </div>
    )
}