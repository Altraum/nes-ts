import {Rom} from "./Rom.ts";

export class Ppu {
    patternTable0 : number[] = [];
    patternTable1 : number[] = [];
    rom : Rom;
    tiles : number[][][] = [];

    palette_base = [
        0x7C7C7C, 0x0000FC, 0x0000BC, 0x4428BC,
        0x940084, 0xA80020, 0xA81000, 0x881400,
        0x503000, 0x007800, 0x006800, 0x005800,
        0x004058, 0x000000, 0x000000, 0x000000,
        0xBCBCBC, 0x0078F8, 0x0058F8, 0x6844FC,
        0xD800CC, 0xE40058, 0xF83800, 0xE45C10,
        0xAC7C00, 0x00B800, 0x00A800, 0x00A844,
        0x008888, 0x000000, 0x000000, 0x000000,
        0xF8F8F8, 0x3CBCFC, 0x6888FC, 0x9878F8,
        0xF878F8, 0xF85898, 0xF87858, 0xFCA044,
        0xF8B800, 0xB8F818, 0x58D854, 0x58F898,
        0x00E8D8, 0x787878, 0x000000, 0x000000,
        0xFCFCFC, 0xA4E4FC, 0xB8B8F8, 0xD8B8F8,
        0xF8B8F8, 0xF8A4C0, 0xF0D0B0, 0xFCE0A8,
        0xF8D878, 0xD8F878, 0xB8F8B8, 0xB8F8D8,
        0x00FCFC, 0xF8D8F8, 0x000000, 0x000000
    ]

    palette = [
        0x7C7C7C, 0x0a02f9, 0xf90206, 0x02f91b
    ]

    constructor(rom_data : Rom) {
        this.rom = rom_data
        this.fill_pattern_tables()
        this.test()
        console.log("Tiles: ")
        console.log(this.tiles)
    }

    fill_pattern_tables() {
        for (let i = 0; i < 0x2000; i++) {
            if (i < 0x1000) this.patternTable0.push(this.rom.chr_data[i])
            else this.patternTable1.push(this.rom.chr_data[i])
        }
    }

    get_pattern_table_colors(){
        const colored_pattern0 : number[] = this.patternTable0.map(paletteIndex => this.palette[paletteIndex])
    }

    test() {
        for (let i = 0; i < 256; i++) {
            const tile: number[][] = []
            for (let j = 0; j < 8; j++) {
                tile.push(this.get_tile_from_low_byte(i * 16 + j))
            }
            this.tiles.push(tile)
        }
    }

    get_tile_from_low_byte(low_byte : number) : number[]{
        const high_byte : number = low_byte + 8
        const tile_row : number[] = []
        for (let i = 7; i >= 0; i--) {
            tile_row.push(
                this.palette[
                    (this.get_bit(this.patternTable0[high_byte], i) << 1) +
                    (this.get_bit(this.patternTable0[low_byte], i))
                ]
            )
        }
        // console.log(
        //     "Hey " + (
        //         (this.get_bit(this.patternTable0[high_byte], 7) << 1) +
        //         (this.get_bit(this.patternTable0[low_byte], 7))
        //     ).toString(2)
        // )
        //
        // console.log(
        //     "High Byte: " + (this.get_bit(this.patternTable0[high_byte], 7)) +
        //     " | Low Byte: " + (this.get_bit(this.patternTable0[low_byte], 7))
        // )
        return tile_row;
    }

    get_bit(byte : number, bit : number) {
        if ( byte & (1 << bit)) {
            return 1
        } else{
            return 0
        }
    }
}