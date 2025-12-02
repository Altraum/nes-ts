export default function About() {
    if(document.getElementsByTagName("header")[0]){
        document.getElementsByTagName("header")[0].style.height = "300px"
    }
    return (
        <div>
            <h1>Learn More Below</h1>
        </div>
    )
}