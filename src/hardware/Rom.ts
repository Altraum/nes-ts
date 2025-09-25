export class Rom {
    rom_data : Uint8Array;
    rom_signature : string;
    prg_units : number;
    chr_units : number;
    flag_6 : number;
    flag_7 : number;
    mapper : number;
    constructor(rom_raw_array : ArrayBuffer){
        this.rom_data = new Uint8Array(rom_raw_array);
        this.rom_signature = (this.rom_data[0].toString(16) + this.rom_data[1].toString(16)
            + this.rom_data[2].toString(16) + this.rom_data[3].toString(16)).toUpperCase();
        if (this.rom_signature != "4E45531A"){
            console.log("Invalid rom signature: " + this.rom_signature);
        } else{
            this.prg_units = this.rom_data[4];
            this.chr_units = this.rom_data[5];
            this.flag_6 = this.rom_data[6];
            this.flag_7 = this.rom_data[7];
            const mapper_lower = this.flag_6.toString(2);
            const mapper_higher = this.flag_7.toString(2);
            console.log(
                "Combined Mapper: "
                + mapper_lower.padStart(8, "0").slice(0,4)
                + mapper_higher.padStart(8, "0").slice(0,4)
            );
            this.mapper = parseInt(
                mapper_lower.padStart(8, "0").slice(0,4)
                + mapper_higher.padStart(8, "0").slice(0,4)
            );
            console.log("Flag 6: " + this.flag_6.toString(2));
            console.log("Flag 7: " + this.flag_7.toString(2));
            console.log("Mapper : " + this.mapper);
        }
    }
}