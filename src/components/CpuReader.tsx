import RomLoader from "./RomLoader.tsx";
import {Nes} from "../hardware/Nes.ts";
import {useEffect, useState} from "react";

const nes = new Nes()

export default function CpuReader() {
    const [romData, setRomData] = useState<ArrayBuffer | null>(null)
    const [log, setLog] = useState<string>("Load a ROM and see the instruction output here...")


    const loadRom = (romBinary: ArrayBuffer) => {
        setRomData(romBinary)
    }

    if(romData) {
        nes.setRom(romData)
        nes.runCpu()
    }

    useEffect(() => {
        let myInterval : number;
        if(romData) {
            myInterval = setInterval(() => {
                setLog(nes.getCpuLog());
            }, 1000)
        }
        return () => {
            clearInterval(myInterval);
        };
    }, [romData]);


    return (
        <main id="CpuReader">
            <span id="InputRom">
                <RomLoader setRom={loadRom}/>
            </span>
            <textarea id="OutputLog" value={log} cols={68} readOnly={true}/>
        </main>
    )
}