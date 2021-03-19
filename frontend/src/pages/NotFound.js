import { useLocation, Link } from "react-router-dom";
import { getRandomName } from "../features/auth/monsters";

const NotFound = () => {
    const location = useLocation();
    const name = getRandomName();
    return (
        <>
            <h3>Error 404 - Not Found</h3>
            <p>Shoot. Looks like a {name} was rummaging around here and stole this page.</p>
            <p>Would you like to go <Link to="/">home</Link> instead?</p>
        </>
    );
}

export default NotFound;