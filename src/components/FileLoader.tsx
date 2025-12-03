import {type ChangeEvent, useState} from "react";
import {Nes} from "../hardware/Nes.ts";
const nes : Nes = new Nes();

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null)
    const PixelSize = 5;
    const TileSizeMulti = 8 * PixelSize;
    const PatternTableSizeMulti = 128 * PixelSize;



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

            nes.runPpu();
            const canvas : HTMLCanvasElement = document.getElementById("myCanvas");
            const ctx : CanvasRenderingContext2D = canvas.getContext("2d");
            // for(let x = 0; x < 16; x++) {
            //     for(let y = 0; y < 16; y++) {
            //         for(let i=0; i<8; i++) {
            //             for(let j=0; j<8; j++) {
            //                 // console.log("fillStyle | " + nes.getPpuTiles()[0][i][j].toString(16))
            //                 ctx.fillStyle = "#" + nes.getPpuTiles()[x*y][i][j].toString(16);
            //                 ctx.fillRect(j + (x * 8), i + (y*8), 1, 1);
            //             }
            //         }
            //     }
            // }

            for(let m = 0; m < 256; m++){
                for(let y=0; y<8; y++) {
                    for(let x=0; x<8; x++) {
                        ctx.fillStyle = "#" + nes.getPpuTiles()[m][y][x].toString(16).padStart(6, "0");
                        ctx.fillRect(PixelSize * x + TileSizeMulti * (m % 16), PixelSize * y + TileSizeMulti * (Math.floor(m/16)), PixelSize, PixelSize);
                    }
                }
                console.log("X Offset = " + (m % 16) + " | Y Offset = " + Math.floor(m/16));
            }
        }

        reader.readAsArrayBuffer(file);
    }

    return (
        <div>
            <canvas id="myCanvas" width={PatternTableSizeMulti} height={PatternTableSizeMulti}></canvas>
            <input type="file" onChange={handleFileChange}/>
        </div>
    )
}