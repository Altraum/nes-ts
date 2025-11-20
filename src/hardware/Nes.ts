import {Cpu} from "./Cpu.ts";
import {Rom} from "./Rom.ts";

let rom : Rom
let cpu : Cpu

export class Nes {
    getRom() {
        return rom;
    }

    setRom( romBinary : ArrayBuffer){
        rom = new Rom(romBinary);
    }

    runCpu(){
        cpu = new Cpu(rom);
    }

    getCpuLog() {
        return cpu.get_log();
    }
}