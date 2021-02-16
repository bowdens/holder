import Obfuscate from "react-obfuscate";

const Contact = () => {
    return (
        <>
            <h3>Contact</h3>
            <p>Please send any communications to {' '}
                <Obfuscate email="tom@bowdens.me"/>
            </p>
        </>
    )
}

export default Contact;