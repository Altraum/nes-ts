import { Rom } from "./Rom.ts"
import { Opcodes, type Opcode } from "./Opcodes.ts";
import { address_modes } from "./AddressModes.ts";

export class Cpu {
    i : number = 1;
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
    stack : Array<number> = [0xFD]
    ram: Array<number> = new Array<number>(0x800).fill(0);

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
        let parsing : boolean = true;
        this.pc = this.get_init()
        while (parsing) {
            this.logline += this.i + " " + this.pc.toString(16)
            const register_status = "A:" + this.a.toString(16)
                + " X:" + this.x.toString(16)
                + " Y:" + this.y.toString(16)
                + " P:" + this.registers_to_number().toString(16)
                + " SP:" + this.s.toString(16)
                + " PPU:" + "0".padStart(3, " ") + "," + "0".padStart(3," ")
                + " CYC:" + this.cycles
            const token = Opcodes.get(this.read_address(this.pc))
            const address = this.get_address(token!.address_mode)
            let adc_result : number
            // @ts-expect-error Undefined case will be handled by Default
            switch (token.instruction){
                case "ADC":
                    adc_result = this.a + this.read_address(address) + this.registers.C
                    // console.log("A + C + memory | " + this.a + " + " + this.registers.C + " + "
                    //     + this.read_address(address) + " = " + adc_result.toString(16))
                    console.log("Overflow | a: " + (adc_result ^ this.a) + " + memory: " + (adc_result ^ this.read_address(address))
                        + " = " + ((adc_result ^ this.a)
                            & (adc_result ^ this.read_address(address)) & 0x80))
                    this.set_usual_flags(adc_result)
                    this.registers.C = Number(adc_result > 0xFF)
                    this.registers.V = Number(!!((adc_result ^ this.a)
                        & (adc_result ^ this.read_address(address)) & 0x80))
                    this.a = adc_result
                    break;
                case "AND":
                    this.a &= this.read_address(address)
                    this.evaluate_zero(this.a)
                    this.evaluate_negative(this.a)
                    break;
                case "ASL":
                    this.get_address(token!.address_mode)
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
                    parsing = false;
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
                    this.get_address(token!.address_mode)
                    break;
                case "DEX":
                    this.get_address(token!.address_mode)
                    break;
                case "DEY":
                    this.get_address(token!.address_mode)
                    break;
                case "EOR":
                    this.a ^= this.read_address(address)
                    this.evaluate_zero(this.a)
                    this.evaluate_negative(this.a)
                    break;
                case "INC":
                    this.get_address(token!.address_mode)
                    break;
                case "INX":
                    this.get_address(token!.address_mode)
                    break;
                case "INY":
                    this.get_address(token!.address_mode)
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
                    this.get_address(token!.address_mode)
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
                    this.a = this.pull_from_stack()
                    this.set_usual_flags(this.a)
                    break;
                case "PLP":
                    this.number_to_registers(this.pull_from_stack())
                    break;
                case "ROL":
                    this.get_address(token!.address_mode)
                    break;
                case "ROR":
                    this.get_address(token!.address_mode)
                    break;
                case "RTI":
                    this.get_address(token!.address_mode)
                    break;
                case "RTS":
                    this.pc = this.pull_from_stack()
                    break;
                case "SBC":
                    this.get_address(token!.address_mode)
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
                    this.get_address(token!.address_mode)
                    break;
                case "TAY":
                    this.get_address(token!.address_mode)
                    break;
                case "TSX":
                    this.get_address(token!.address_mode)
                    break;
                case "TXA":
                    this.get_address(token!.address_mode)
                    break;
                case "TXS":
                    this.get_address(token!.address_mode)
                    break;
                case "TYA":
                    this.get_address(token!.address_mode)
                    break;
                default:
                    console.log("Token not found: " + token!.instruction)
                    parsing = false;
            }
            this.cycles += token!.cycles;
            this.logline += register_status
            this.log.push(this.logline.toUpperCase())
            // console.log((this.i + " " + this.logline).toUpperCase())
            this.logline = ""
            this.pc += 1;
            this.i += 1
        }
        console.log(this.log.join('\n'))
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
            //DONE?
            case address_modes.abs:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 2;
                upper_nibble = this.read_address(this.pc)
                lower_nibble = this.read_address(this.pc - 1)
                return this.combine_nibbles(upper_nibble, lower_nibble)
            //DONE?
            case address_modes.abx:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 2;
                upper_nibble = this.read_address(this.pc)
                lower_nibble = this.read_address(this.pc - 1)
                return this.combine_nibbles(upper_nibble, lower_nibble) + this.x
            //DONE?
            case address_modes.aby:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 2;
                upper_nibble = this.read_address(this.pc)
                lower_nibble = this.read_address(this.pc - 1)
                return this.combine_nibbles(upper_nibble, lower_nibble) + this.y
            //DONE
            case address_modes.imm:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                return this.pc
            //DONE
            case address_modes.imp:
                this.append_instruction_log(this.read_address(this.pc))
                return NaN
            //WIP
            case address_modes.ind:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 2;
                return NaN
                // return this.read_address(this.combine_nibbles(
                //     this.read_address(this.read_address(this.pc)),
                //     this.read_address(this.read_address(this.pc - 1))
                // ))
            //WIP
            case address_modes.izx:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 1;
                upper_nibble = this.read_address(this.pc)
                lower_nibble = this.read_address(this.pc - 1)
                return NaN
                // return this.read_address(this.combine_nibbles(
                //     this.read_address(upper_nibble),
                //     this.read_address(lower_nibble)
                // ))
            //WIP
            case address_modes.izy:
                this.append_instruction_log(this.read_address(this.pc),
                    this.read_address(this.pc + 1), this.read_address(this.pc + 2))
                this.pc += 1;
                return NaN
                // return this.read_address(this.pc)
            //DONE
            case address_modes.rel:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                offset = this.read_address(this.pc)
                if (offset & 0x80) offset = offset - 0x100;
                return this.pc + offset
            //DONE?
            case address_modes.zpo:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                return this.read_address(this.pc)
            //DONE?
            case address_modes.zpx:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                return this.read_address(this.pc) + this.x
            //DONE?
            case address_modes.zpy:
                this.append_instruction_log(this.read_address(this.pc), this.read_address(this.pc + 1))
                this.pc += 1;
                return this.read_address(this.pc) + this.y
            default:
                console.log("Unrecognized address mode: " + mode)
                return NaN
        }
    }

    write_address(address : number, value : number) {
        this.ram[address % 0x800] = value
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
            this.pc = address
        }
    }

    push_to_stack(value:number) {
        this.stack.push(value)
        this.s -= value < 256 ? 1 : 2
    }

    pull_from_stack() : number {
        const value = this.stack.pop()
        this.s += value! < 256 ? 1 : 2
        return value!
    }

    evaluate_negative(value : number) {
        this.registers.N = this.is_bit_set(value, 7) ? 1 : 0;
    }

    evaluate_overflow(value : number) {
        this.registers.V = this.is_bit_set(value, 6) ? 1 : 0;
    }

    evaluate_zero(value : number) {
        this.registers.Z = Number(value == 0);
    }

    is_bit_set(value : number, bitPosition : number) {
        return (value & (1 << bitPosition)) !== 0;
    }

    compare(value : number, address : number){
        this.registers.C = Number(value >= this.read_address(address))
        this.registers.Z = Number(value == this.read_address(address))
        this.evaluate_negative(value - this.read_address(address))
    }
}