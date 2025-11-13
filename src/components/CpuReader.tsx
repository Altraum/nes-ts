import FileUploader from "./FileLoader.tsx";

export default function CpuReader() {
    return (
        <main>
            <div id="InputRom">
                <FileUploader/>
            </div>
            <div id="OutputLog">

            </div>
        </main>
    )
}