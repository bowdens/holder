import { Link } from "react-router-dom"

const Feedback = () => {
    return (
        <>
        <h3>Feedback</h3>
        <p>Feedback can be email to me (see <Link to="/contact">here</Link>) {' '}
        or an issue can be made at <a href="https://github.com/bowdens/holder">github</a>
        </p>
        </>
    )
}

export default Feedback;