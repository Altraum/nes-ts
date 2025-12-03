import {Cpu} from "./Cpu.ts";
import {Rom} from "./Rom.ts";
import {Ppu} from "./Ppu.ts";

let rom : Rom
let cpu : Cpu
let ppu : Ppu

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

    runPpu() {
        ppu = new Ppu(rom);
    }

    getCpuLog() {
        return cpu.get_log();
    }

    getPpuTiles() {
        return ppu.tiles;
    }
}