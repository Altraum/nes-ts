import { Rom } from "./Rom.ts"
import { Opcodes, type Opcode } from "./Opcodes.ts";
import { address_modes } from "./AddressModes.ts";
import {goldtest} from "../goldtest.ts";

export class Cpu {
    comparison_index : number = 0;
    rom : Rom;
    a : number = 0;
    x: number = 0;
    y: number = 0;
    pc: number = 65532;
    s: number = 0xFD;
    p: boolean = false;
    cycles: number = 7;
    log: Array<string> = [];
    logline: string = "";
    ram: Array<number> = new Array<number>(0x800).fill(0);
    comparing : boolean = true;
    parsing : boolean = true;
    current_opcode : Opcode | undefined = undefined;

    registers = {
        C: 0,
        Z: 0,
        I: 1,
        D: 0,
        V: 0,
        N: 0,
        B: 0
    }

    constructor(rom_data : Rom) {
        this.rom = rom_data;
        this.pc = this.get_init()
        try{
            while(this.parsing) {
                this.process_next_instruction()
            }
        } catch(e){
            console.error(e)
            console.log(this.log)
        }
        console.log(this.log.join('\n'))
    }

    process_next_instruction(){
        this.logline += this.pc.toString(16).padStart(4, "0")
        const register_status = "A:" + this.a.toString(16).padStart(2,"0")
            + " X:" + this.x.toString(16).padStart(2,"0")
            + " Y:" + this.y.toString(16).padStart(2,"0")
            + " P:" + this.registers_to_number().toString(16).padStart(2,"0")
            + " SP:" + this.s.toString(16).padStart(2,"0")
            + " PPU:" + "0".padStart(3, " ") + "," + "0".padStart(3," ")
            + " CYC:" + this.cycles
        const token = Opcodes.get(this.read_address(this.pc))
        this.current_opcode = token;
        const address = this.get_address(token!.address_mode)
        let result : number
        // @ts-expect-error Undefined case will be handled by Default
        switch (token.instruction){
            case "ADC":
                result = this.a + this.read_address(address) + this.registers.C
                // console.log("Overflow | a: " + (result ^ this.a) + " + memory: " + (result ^ this.read_address(address))
                //     + " = " + ((result ^ this.a)
                //         & (result ^ this.read_address(address)) & 0x80))
                this.set_usual_flags(result)
                this.registers.C = Number(result > 0xFF)
                this.registers.V = Number(!!((result ^ this.a)
                    & (result ^ this.read_address(address)) & 0x80))
                this.a = result & 0xFF;
                break;
            case "AND":
                this.a &= this.read_address(address)
                this.evaluate_zero(this.a)
                this.evaluate_negative(this.a)
                break;
            case "ASL":
                if (token?.address_mode == address_modes.acc) {
                    result = address
                } else{
                    result = this.read_address(address)
                }
                this.registers.C = Number(this.is_bit_set(result, 7))
                result = (result << 1) & 0xFF
                this.registers.N = Number(this.is_bit_set(result, 7))
                this.evaluate_zero(result)
                this.write_address(address, result,  token?.address_mode == address_modes.acc)
                break;
            case "BCC":
                this.branch(!this.registers.C, address)
                break;
            case "BCS":
                this.branch(this.registers.C, address)
                break;
            case "BEQ":
                this.branch(this.registers.Z, address)
                break;
            case "BIT":
                this.evaluate_zero(this.a & this.read_address(address))
                this.evaluate_negative(this.read_address(address))
                this.evaluate_overflow(this.read_address(address))
                break;
            case "BMI":
                this.branch(this.registers.N, address)
                break;
            case "BNE":
                this.branch(!this.registers.Z, address)
                break;
            case "BPL":
                this.branch(!this.registers.N, address)
                break;
            case "BRK":
                this.pc += 1;
                // while(Opcodes.get(this.read_address(this.pc))?.instruction == "BRK"){
                //     this.pc += 1 ;
                // }
                this.parsing = false;
                break;
            case "BVC":
                this.branch(!this.registers.V, address)
                break;
            case "BVS":
                this.branch(this.registers.V, address)
                break;
            case "CLC":
                this.registers.C = 0
                break;
            case "CLD":
                this.registers.D = 0
                break;
            case "CLI":
                this.registers.I = 0
                break;
            case "CLV":
                this.registers.V = 0
                break;
            case "CMP":
                this.compare(this.a, address)
                break;
            case "CPX":
                this.compare(this.x, address)
                break;
            case "CPY":
                this.compare(this.y, address)
                break;
            case "DEC":
                this.write_address(address, (this.read_address(address) - 1) & 0xFF)
                this.set_usual_flags(this.read_address(address))
                break;
            case "DEX":
                this.x = (this.x - 1) & 0xFF
                this.set_usual_flags(this.x)
                break;
            case "DEY":
                this.y = (this.y - 1) & 0xFF
                this.set_usual_flags(this.y)
                break;
            case "EOR":
                this.a ^= this.read_address(address)
                this.evaluate_zero(this.a)
                this.evaluate_negative(this.a)
                break;
            case "INC":
                this.write_address(address, (this.read_address(address) + 1) & 0xFF)
                this.set_usual_flags(this.read_address(address))
                break;
            case "INX":
                this.x = (this.x + 1) & 0xFF
                this.set_usual_flags(this.x)
                break;
            case "INY":
                this.y = (this.y + 1) & 0xFF
                this.set_usual_flags(this.y)
                break;
            case "JMP":
                this.pc = address - 1
                break;
            case "JSR":
                this.push_to_stack(this.pc)
                this.pc = address - 1
                break;
            case "LDA":
                this.a = this.read_address(address)
                this.set_usual_flags(this.a)
                break;
            case "LDX":
                this.x = this.read_address(address)
                this.set_usual_flags(this.x)
                break;
            case "LDY":
                this.y = this.read_address(address)
                this.set_usual_flags(this.y)
                break;
            case "LSR":
                if (token?.address_mode == address_modes.acc) {
                    result = address
                } else{
                    result = this.read_address(address)
                }
                this.registers.C = Number(this.is_bit_set(result, 0))
                this.registers.N = 0
                result = result >>> 1
                this.evaluate_zero(result)
                this.write_address(address, result, token?.address_mode == address_modes.acc)
                break;
            case "NOP":
                break;
            case "ORA":
                this.a |= this.read_address(address)
                this.evaluate_zero(this.a)
                this.evaluate_negative(this.a)
                break;
            case "PHA":
                this.push_to_stack(this.a)
                break;
            case "PHP":
                if (this.registers.B) {
                    this.push_to_stack(this.registers_to_number())
                } else {
                    this.push_to_stack(this.registers_to_number() + 0b10000)
                }
                break;
            case "PLA":
                this.a = this.pull_from_stack(1)
                this.set_usual_flags(this.a)
                break;
            case "PLP":
                this.number_to_registers(this.pull_from_stack(1))
                break;
            case "ROL":
                if (token?.address_mode == address_modes.acc) {
                    result = address
                } else{
                    result = this.read_address(address)
                }
                result = (result << 1) + this.registers.C
                this.registers.C = Number(this.is_bit_set(result, 8))
                result = result & 0xFF
                // result = parseInt(
                //     result.toString(2).padStart(8, "0").substring(1)
                //     + result.toString(2).padStart(8, "0").substring(0, 1)
                // , 2)
                // this.registers.C = result & 0x80
                // result = (result << 1 | (this.registers.C ? 1 : 0)) & 0xFF;
                this.set_usual_flags(result)
                this.write_address(address, result,  token?.address_mode == address_modes.acc)
                break;
            case "ROR":
                if (token?.address_mode == address_modes.acc) {
                    result = address
                } else{
                    result = this.read_address(address)
                }
                result = (this.registers.C << 8) + result
                this.registers.C = Number(this.is_bit_set(result, 0))
                result = result >>> 1
                // result = parseInt(
                //     result.toString(2).padStart(8, "0").substring(7)
                //     + result.toString(2).padStart(8, "0").substring(0, 7)
                //     , 2)
                this.set_usual_flags(result)
                this.write_address(address, result,  token?.address_mode == address_modes.acc)
                break;
            case "RTI":
                this.number_to_registers(this.pull_from_stack(1))
                this.pc = this.pull_from_stack(2) - 1
                break;
            case "RTS":
                this.pc = this.pull_from_stack(2)
                break;
            case "SBC":
                result = this.a + ~this.read_address(address) + this.registers.C
                // console.log("Overflow | a: " + (result ^ this.a) + " + memory: " + (result ^ this.read_address(address))
                //     + " = " + ((result ^ this.a)
                //         & (result ^ this.read_address(address)) & 0x80))
                this.set_usual_flags(result)
                this.registers.C = Number(result >= 0)
                this.registers.V = Number(!!((result ^ this.a)
                    & (result ^ ~this.read_address(address)) & 0x80))
                this.a = result & 0xFF;
                break;
            case "SEC":
                this.registers.C = 1
                break;
            case "SED":
                this.registers.D = 1
                break;
            case "SEI":
                this.registers.I = 1
                break;
            case "STA":
                this.write_address(address, this.a)
                break;
            case "STX":
                this.write_address(address, this.x)
                break;
            case "STY":
                this.write_address(address, this.y)
                break;
            case "TAX":
                this.x = this.a
                this.set_usual_flags(this.x)
                break;
            case "TAY":
                this.y = this.a
                this.set_usual_flags(this.y)
                break;
            case "TSX":
                this.x = this.s
                this.set_usual_flags(this.x)
                break;
            case "TXA":
                this.a = this.x
                this.set_usual_flags(this.a)
                break;
            case "TXS":
                this.s = this.x
                break;
            case "TYA":
                this.a = this.y
                this.set_usual_flags(this.a)
                break;
            default:
                console.log("Token not found: " + token!.instruction)
                this.parsing = false;
        }
        this.cycles += token!.cycles;
        this.logline += register_status
        this.logline = this.logline.toUpperCase()
        this.log.push(this.logline)
        // console.log((this.i + " " + this.logline).toUpperCase())
        if(this.comparing) this.compare_logs()
        this.logline = ""
        this.pc += 1;
        this.comparison_index += 1
    }

    get_log() {
        return this.log.join('\n')
    }

    get_address(mode : string) : number {
        let upper_nibble : number
        let lower_nibble : number
        let offset : number
        switch (mode) {
            //DONE
            case address_modes.acc:
                this.append_instruction_log(this.read_address(this.pc))
                return this.a
            //DONE
            case address_modes.abs:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 2;
                upper_nibble = this.read_address(this.pc)
                lower_nibble = this.read_address(this.pc - 1)
                return this.combine_nibbles(upper_nibble, lower_nibble)
            //DONE
            case address_modes.abx:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 2;
                upper_nibble = this.read_address(this.pc)
                lower_nibble = this.read_address(this.pc - 1)
                offset = this.combine_nibbles(upper_nibble, lower_nibble) + this.x
                this.check_page_crossing(offset - this.x, offset);
                return offset & 0xFFFF;
            //DONE
            case address_modes.aby:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 2;
                upper_nibble = this.read_address(this.pc)
                lower_nibble = this.read_address(this.pc - 1)
                offset = this.combine_nibbles(upper_nibble, lower_nibble) + this.y
                this.check_page_crossing(offset - this.y, offset);
                return offset & 0xFFFF
            //DONE
            case address_modes.imm:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                return this.pc
            //DONE
            case address_modes.imp:
                this.append_instruction_log(this.read_address(this.pc))
                return NaN
            //DONE?
            case address_modes.ind:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 2;
                lower_nibble = this.read_address(this.pc - 1)
                upper_nibble = this.read_address(this.pc)
                // if(this.comparing){
                //     console.log("ind address " + this.combine_nibbles(upper_nibble, lower_nibble).toString(16)
                //         + " found value " + this.read_address(this.combine_nibbles(upper_nibble,lower_nibble)).toString(16))
                // }
                offset = this.combine_nibbles(upper_nibble, lower_nibble)
                if (lower_nibble == 0xFF) {
                    upper_nibble = this.read_address(offset - 0xFF)
                } else{
                    upper_nibble = this.read_address(offset + 1)
                }
                lower_nibble = this.read_address(offset)
                return this.combine_nibbles(upper_nibble, lower_nibble)
            //DONE?
            case address_modes.izx:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1))
                this.pc += 1;
                offset = (this.read_address(this.pc) + this.x) & 0xFF
                lower_nibble = this.read_address(offset)
                upper_nibble = this.read_address((offset + 1) & 0xFF)
                // if(this.comparing){
                //     console.log("izx address " + this.combine_nibbles(upper_nibble, lower_nibble).toString(16)
                //         + " found value " + this.read_address(this.combine_nibbles(upper_nibble,lower_nibble)).toString(16))
                // }
                return this.combine_nibbles(upper_nibble, lower_nibble)
            //DONE?
            case address_modes.izy:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1))
                this.pc += 1;
                offset = this.read_address(this.pc)
                lower_nibble = this.read_address(offset)
                upper_nibble = this.read_address((offset + 1) & 0xFF)
                // if(this.comparing){
                //     console.log("izy address " + (this.combine_nibbles(upper_nibble, lower_nibble) + this.y).toString(16)
                //         + " found value " + (this.read_address(this.combine_nibbles(upper_nibble, lower_nibble) + this.y) & 0xFFFF).toString(16))
                // }
                offset = this.combine_nibbles(upper_nibble, lower_nibble) + this.y
                this.check_page_crossing(offset - this.y, offset);
                return offset & 0xFFFF
            //DONE
            case address_modes.rel:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                offset = this.read_address(this.pc)
                if (offset & 0x80) offset = offset - 0x100;
                this.check_page_crossing(this.pc, this.pc + offset)
                return this.pc + offset
            //DONE
            case address_modes.zpo:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                // if(this.comparing){
                //     console.log("Zero page address " + this.read_address(this.pc).toString(16)
                //         + " found value " + this.read_address(this.read_address(this.pc)).toString(16))
                // }
                return this.read_address(this.pc)
            //DONE
            case address_modes.zpx:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                return (this.read_address(this.pc) + this.x) & 0xFF
            //DONE
            case address_modes.zpy:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                return (this.read_address(this.pc) + this.y) & 0xFF
            default:
                console.log("Unrecognized address mode: " + mode)
                return NaN
        }
    }

    write_address(address : number, value : number, is_accumulator? : boolean) {
        if (is_accumulator) {
            this.a = value
        } else{
            this.ram[address % 0x800] = value
        }
    }

    read_address(address : number) : number {
        if (address < 0x2000) return this.ram[address % 0x800];
        if (address < 0x4000) {
            console.log("Attempt at PPU Register Read")
            return 0 % 8;
        }
        if (address < 0x6000) {
            console.log("Attempt at unused memory read")
            return 0
        }
        if (address < 0x8000) {
            console.log("Attempt at PRG RAM Read")
            return 0;
        }
        if (address >= 0x8000) {
            if (this.rom.prg_units == 1) {
                return this.rom.prg_data[address % 0x4000]
            } else {
                return this.rom.prg_data[address % 0x8000]
            }
        }
        return 0;
    }

    get_init() : number {
        const init_upper = this.rom.prg_data[this.rom.prg_data.length - 3]
        const init_lower = this.rom.prg_data[this.rom.prg_data.length - 4]
        console.log("reset vector = " + this.combine_nibbles(init_upper, init_lower).toString(16))
        return this.combine_nibbles(init_upper, init_lower);
    }

    combine_nibbles(upper_nibble : number, lower_nibble : number) : number {
        return (upper_nibble * 256) + lower_nibble;
    }

    registers_to_number() : number {
        return this.registers.N * 0b10000000
            + this.registers.V * 0b1000000
            + 0b100000
            + this.registers.B * 0b10000
            + this.registers.D * 0b1000
            + this.registers.I * 0b100
            + this.registers.Z * 0b10
            + this.registers.C;
    }

    registers_to_string() : string {
        return this.registers.N.toString()
            + this.registers.V.toString()
            + "1"
            + this.registers.B.toString()
            + this.registers.D.toString()
            + this.registers.I.toString()
            + this.registers.Z.toString()
            + this.registers.C.toString()
    }

    number_to_registers(value : number) {
        this.registers.N = Number(this.is_bit_set(value, 7))
        this.registers.V = Number(this.is_bit_set(value, 6))
        this.registers.D = Number(this.is_bit_set(value, 3))
        this.registers.I = Number(this.is_bit_set(value, 2))
        this.registers.Z = Number(this.is_bit_set(value, 1))
        this.registers.C = Number(this.is_bit_set(value, 0))
    }
    process_token(token : Opcode) {
        console.log(token);
    }

    append_instruction_log(instruction : number, address1? : number, address2? : number) {
        if (arguments.length == 1){
            this.logline += "  " + instruction.toString(16).padStart(2,"0").padEnd(10, " ")
        } else if (arguments.length == 2){
            this.logline += "  " + (instruction.toString(16).padStart(2,"0") + " " +
                address1!.toString(16).padStart(2,"0")).padEnd(10, " ")
        } else if (arguments.length == 3){
            this.logline += "  " + (instruction.toString(16).padStart(2,"0") + " " +
                address1!.toString(16).padStart(2,"0")  + " " +
                address2!.toString(16).padStart(2,"0")).padEnd(10, " ")
        }
        this.logline += Opcodes.get(instruction)?.instruction + " "
    }

    set_usual_flags(value:number) {
        this.evaluate_zero(value)
        this.evaluate_negative(value);
    }

    branch(register:number|boolean, address : number) {
        if (register) {
            this.cycles += 1
            this.pc = address
        }
    }

    push_to_stack(value:number) {
        if (value <= 0xFF) {
            this.ram[this.s + 0x100] = value
            this.s -= 1
            // if (this.comparing) {
            //     console.log("Pushed " + value.toString(16) + " to stack at stack pointer " + this.s.toString(16))
            //     console.log(this.ram.slice(0x100,0x200))
            // }
        } else {
            this.ram[this.s + 0x100] = (value - (value & 0xFF))/0x100
            this.ram[(this.s - 1) + 0x100] = value & 0xFF
            this.s -= 2
            // if (this.comparing) {
                // console.log("Pushed " + this.combine_nibbles(
                //     this.ram[this.s + 0x100] = (value - (value & 0xFF))/0x100,
                //     this.ram[(this.s - 1) + 0x100] = value & 0xFF
                // ).toString(16) + " to stack at stack pointer " + this.s.toString(16))
                // console.log(this.ram.slice(0x100,0x200))
            // }
        }
    }

    pull_from_stack(byte_count : number) : number {
        if (byte_count == 1) {
            this.s += 1
            const value = this.ram[this.s + 0x100]
            // if (this.comparing) {
                // console.log("Pulled " + value.toString(16) + " from stack at stack pointer " + this.s.toString(16))
                // console.log(this.ram.slice(0x100,0x200))
            // }
            return value!
        } else {
            this.s += 2
            const msb = this.ram[(this.s) + 0x100]
            const lsb = this.ram[(this.s - 1) + 0x100]
            // if(this.comparing){
                // console.log("Pulled " + this.combine_nibbles(msb, lsb).toString(16) + " from stack at stack pointer " + this.s.toString(16))
                // console.log(this.ram.slice(0x100,0x200))
            // }
            return this.combine_nibbles(msb, lsb)
        }
        // const value = this.ram[this.s + 0x100]
        // this.ram[this.s + 0x100] = 0
        // this.s += value! < 256 ? 1 : 2
        // console.log("Pulled stack")
        // console.log(this.ram.slice(0x100,0x200))
        // return value!
    }

    evaluate_negative(value : number) {
        this.registers.N = this.is_bit_set(value, 7) ? 1 : 0;
    }

    evaluate_overflow(value : number) {
        this.registers.V = this.is_bit_set(value, 6) ? 1 : 0;
    }

    evaluate_zero(value : number) {
        this.registers.Z = Number(value % 0x100 == 0);
    }

    is_bit_set(value : number, bitPosition : number) {
        return (value & (1 << bitPosition)) !== 0;
    }

    compare(value : number, address : number){
        this.registers.C = Number(value >= this.read_address(address))
        this.registers.Z = Number(value == this.read_address(address))
        this.evaluate_negative(value - this.read_address(address))
    }

    compare_logs() {
        const my_log : string = this.logline.slice(0,20) + " " + this.logline.slice(20,46)
        const gold_log : string = goldtest[this.comparison_index].slice(0,20) + " " + goldtest[this.comparison_index].slice(48,74)
        if (!(my_log === gold_log)) {
            console.log("A bug at line " + (this.comparison_index-1))
            console.log("GOLD| " + goldtest[this.comparison_index-1].slice(0,20) + " " + goldtest[this.comparison_index-1].slice(48,74))
            // console.log("MINE| " + this.log[this.i-1].slice(0,20) + " " + this.log[this.i-1].slice(20,46))
            console.log("Caused a diff at line " + this.comparison_index)
            console.log("GOLD| " + gold_log)
            console.log("MINE| " + my_log)
            console.log(this.ram)
            this.comparing = false
        }
    }

    check_page_crossing(old_address : number, new_address : number){
        if(this.current_opcode?.crosses_page && (old_address & 0xFF00) != (new_address & 0xFF00)){
            this.cycles += 1;
        }
    }
}