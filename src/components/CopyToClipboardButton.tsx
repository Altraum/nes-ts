export default function CopyToClipboardButton({log} : {log : string}) {
    return (
        <div>
            <button onClick={() => {navigator.clipboard.writeText(log)}}>Copy Log to Clipboard</button>
        </div>
    )
}