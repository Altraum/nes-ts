import { Rom } from "./Rom.ts"
import { Opcodes } from "./Opcodes.ts";

const address_mode = {
    acc: "ACCUMULATOR",
    abs: "ABSOLUTE",
    absx: "ABSOLUTE X",
    absy: "ABSOLUTE Y",
    imd: "IMMEDIATE",
    imp: "IMPLIED",
    ind: "INDIRECT",
    indx: "INDIRECT X",
    indy: "INDIRECT Y",
    rel: "RELATIVE",
    zro: "ZERO PAGE",
    zrox: "ZERO PAGE X",
    zroy: "ZERO PAGE Y"
}

export class Cpu {
    rom : Rom;
    a : number = 0;
    x: number = 0;
    y: number = 0;
    pc: number = 65532;
    s: number = 0;
    p: boolean = false;

    registers = {
        C: 0,
        Z: 0,
        I: 1,
        D: 0,
        V: 0,
        N: 0
    }

    constructor(rom_data : Rom) {
        this.rom = rom_data;
        let parsing : boolean = true;
        const logging : boolean = true;
        this.pc = this.get_init()
        while (parsing) {
            const token = Opcodes.get(this.read_address(this.pc))
            switch (token?.instruction){
                case "ADC":
                    if(logging){
                        console.log("ADC")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "AND":
                    if(logging){
                        console.log("AND")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "ASL":
                    if(logging){
                        console.log("ASL")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BCC":
                    if(logging){
                        console.log("BCC")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BCS":
                    if(logging){
                        console.log("BCS")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BEQ":
                    if(logging){
                        console.log("BEQ")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BIT":
                    if(logging){
                        console.log("BIT")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BMI":
                    if(logging){
                        console.log("BMI")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BNE":
                    if(logging){
                        console.log("BNE")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BPL":
                    if(logging){
                        console.log("BPL")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BRK":
                    if(logging){
                        console.log("BRK")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BVC":
                    if(logging){
                        console.log("BVC")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "BVS":
                    if(logging){
                        console.log("BVS")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "CLC":
                    if(logging){
                        console.log("CLC")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "CLD":
                    if(logging){
                        console.log("CLD")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "CLI":
                    if(logging){
                        console.log("CLI")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "CLV":
                    if(logging){
                        console.log("CLV")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "CMP":
                    if(logging){
                        console.log("CMP")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "CPX":
                    if(logging){
                        console.log("CPX")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "CPY":
                    if(logging){
                        console.log("CPY")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "DEC":
                    if(logging){
                        console.log("DEC")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "DEX":
                    if(logging){
                        console.log("DEX")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "DEY":
                    if(logging){
                        console.log("DEY")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "EOR":
                    if(logging){
                        console.log("EOR")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "INC":
                    if(logging){
                        console.log("INC")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "INX":
                    if(logging){
                        console.log("INX")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "INY":
                    if(logging){
                        console.log("INY")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "JMP":
                    if(logging){
                        console.log("JMP")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "JSR":
                    if(logging){
                        console.log("JSR")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "LDA":
                    if(logging){
                        console.log("LDA")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "LDX":
                    if(logging){
                        console.log("LDX")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "LDY":
                    if(logging){
                        console.log("LDY")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "LSR":
                    if(logging){
                        console.log("LSR")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "NOP":
                    if(logging){
                        console.log("NOP")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "ORA":
                    if(logging){
                        console.log("ORA")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "PHA":
                    if(logging){
                        console.log("PHA")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "PHP":
                    if(logging){
                        console.log("PHP")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "PLA":
                    if(logging){
                        console.log("PLA")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "PLP":
                    if(logging){
                        console.log("PLP")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "ROL":
                    if(logging){
                        console.log("ROL")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "ROR":
                    if(logging){
                        console.log("ROR")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "RTI":
                    if(logging){
                        console.log("RTI")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "RTS":
                    if(logging){
                        console.log("RTS")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "SBC":
                    if(logging){
                        console.log("SBC")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "SEC":
                    if(logging){
                        console.log("SEC")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "SED":
                    if(logging){
                        console.log("SED")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "SEI":
                    if(logging){
                        console.log("SEI")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "STA":
                    if(logging){
                        console.log("STA")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "STX":
                    if(logging){
                        console.log("STX")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "STY":
                    if(logging){
                        console.log("STY")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "TAX":
                    if(logging){
                        console.log("TAX")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "TAY":
                    if(logging){
                        console.log("TAY")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "TSX":
                    if(logging){
                        console.log("TSX")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "TXA":
                    if(logging){
                        console.log("TXA")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "TXS":
                    if(logging){
                        console.log("TXS")
                    }
                    this.find_address(token?.address_mode)
                    break;
                case "TYA":
                    if(logging){
                        console.log("TYA")
                    }
                    this.find_address(token?.address_mode)
                    break;
                default:
                    console.log("Token not found: " + token?.instruction)
                    parsing = false;
            }
            this.pc += 1;
        }
    }

    find_address(mode : string) : number | void {
        switch (mode) {
            case address_mode.acc:
                console.log(address_mode.acc);
                break;
            case address_mode.abs:
                this.pc += 2;
                console.log(address_mode.abs + " | " + this.read_address(this.pc - 1).toString(16)
                    + this.read_address(this.pc).toString(16));
                return this.read_address(this.combine_nibbles(
                    this.read_address(this.pc - 1),
                    this.read_address(this.pc)
                ))
            case address_mode.absx:
                this.pc += 2;
                console.log(address_mode.absx + " | " + this.read_address(this.pc - 1).toString(16)
                    + this.read_address(this.pc).toString(16));
                return this.read_address(this.combine_nibbles(
                    this.read_address(this.pc - 1),
                    this.read_address(this.pc)
                ))
            case address_mode.absy:
                this.pc += 2;
                console.log(address_mode.absy + " | " + this.read_address(this.pc - 1).toString(16)
                    + this.read_address(this.pc).toString(16));
                return this.read_address(this.combine_nibbles(
                    this.read_address(this.pc - 1),
                    this.read_address(this.pc)
                ))
            case address_mode.imd:
                this.pc += 1;
                console.log(address_mode.imd + " | " + this.read_address(this.pc).toString(16));
                return this.read_address(this.pc)
            case address_mode.imp:
                console.log(address_mode.imp);
                break;
            case address_mode.ind:
                this.pc += 2;
                console.log(address_mode.ind + " | " + this.read_address(this.pc - 1).toString(16)
                    + this.read_address(this.pc).toString(16));
                return this.read_address(this.combine_nibbles(
                    this.read_address(this.pc - 1),
                    this.read_address(this.pc)
                ))
            case address_mode.indx:
                this.pc += 1;
                console.log(address_mode.indx + " | " + this.read_address(this.pc).toString(16));
                return this.read_address(this.pc)
            case address_mode.indy:
                this.pc += 1;
                console.log(address_mode.indy + " | " + this.read_address(this.pc).toString(16));
                return this.read_address(this.pc)
            case address_mode.rel:
                this.pc += 1;
                console.log(address_mode.rel + " | " + this.read_address(this.pc).toString(16));
                return this.read_address(this.pc)
            case address_mode.zro:
                this.pc += 1;
                console.log(address_mode.zro + " | " + this.read_address(this.pc).toString(16));
                return this.read_address(this.pc)
            case address_mode.zrox:
                this.pc += 1;
                console.log(address_mode.zrox + " | " + this.read_address(this.pc).toString(16));
                return this.read_address(this.pc)
            case address_mode.zroy:
                this.pc += 1;
                console.log(address_mode.zroy + " | " + this.read_address(this.pc).toString(16));
                return this.read_address(this.pc)
            default:
                console.error("Unrecognized address mode " + mode);
        }
    }

    read_address(address : number) : number {
        console.log("Reading address " + address.toString(16) + " -> " + (address - 0x8000).toString(16)
            + " | " + this.rom.prg_data[address - 0x8000].toString(16));
        return this.rom.prg_data[address - 0x8000];
    }

    get_init() : number {
        const init_upper = this.rom.prg_data[this.rom.prg_data.length - 4] * 256
        const init_lower = this.rom.prg_data[this.rom.prg_data.length - 3]
        return init_upper + init_lower;
        //this.read_address(this.pc)
        // this.read_address(reset_vector).toString(16)
    }

    combine_nibbles(upper_nibble : number, lower_nibble : number) : number {
        return (upper_nibble * 256) + lower_nibble;
    }
}