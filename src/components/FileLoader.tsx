import {type ChangeEvent, useState} from "react";

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
            const typedArray = new Uint8Array(reader.result);
            // let i = 0;
            // while (i <= 20){
            //     console.log(i + ": " + typedArray[i].toString(16));
            //     i += 1;
            // }
            let flag7 = Array.from(typedArray[7].toString(2), Number);
            if (flag7.length < 8) {
                const leadingZeroes = new Array(8 - flag7.length)
                leadingZeroes.fill(0);
                leadingZeroes.push(flag7);
                flag7 = leadingZeroes;
            }
            console.log("Flag 6: " + typedArray[6].toString(2));
            console.log("Flag 7: " + flag7);

        }

        reader.readAsArrayBuffer(file);
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
        </div>
    )
}