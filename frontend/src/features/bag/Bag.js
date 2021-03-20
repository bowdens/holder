import { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import logo from "../../logo.svg";

import {
    setPending,
    selectBagPending,
    selectBag,
    selectError
} from "./bagSlice";

import SettingsIcon from "@material-ui/icons/Settings";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ListQuery from "./ListQuery";
import ItemList, { ItemElement } from "./ItemList";
import AddItem from "./AddItem";
import EditableModal from "../editable/EditableModal";
import { createOrGetSocket } from "../../socket";
import { selectNickname, setCurrentCode } from "../auth/authSlice";

const Bag = () => {
    const { code } = useParams();
    const dispatch = useDispatch();
    const bag = useSelector(selectBag);
    const pending = useSelector(selectBagPending);
    const bagError = useSelector(selectError);
    const nickname = useSelector(selectNickname);
    const location = useLocation();


    useEffect(() => {
        const { socket } = createOrGetSocket();
        socket.emit("join_bag", { code, nickname });
        dispatch(setPending(true));
        console.log(`setting current code to ${code}`)
        dispatch(setCurrentCode({ currentCode: code }));
    }, [code]);

    return (
        <>
            <Helmet>
                <title>Bag {code}</title>
                <meta property="og:title" content="extradimension.al - Shared Bag" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={location} />
                <meta property="og:description" content={`Bag ${code} has been shared with you.`} />
                <meta property="og:image" content={logo} />
            </Helmet>
            <Row>
            </Row>
            {bag === null ?
                <Row>{pending === true ?
                    <>
                        <p>Bag Loading...</p>
                    </>
                    :
                    <>
                        {bagError !== null ?
                            <p>There was an error: {bagError}</p>
                            :
                            <p>There was an error but no error was set!</p>
                        }
                    </>
                }
                </Row>
                :
                <>
                    <Row>
                        <Col>
                            <h3>{bag.name}</h3>
                        </Col>
                        <Col>
                            <h3>Code - {code}</h3>
                        </Col>
                        <Col xs="auto">
                            <h3 className="text-right">
                                <Link to={`/bag/${code}/settings`}><SettingsIcon /></Link>
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <ListQuery items={bag.items}>
                            <ItemList Element={ItemElement} />
                        </ListQuery>
                    </Row>
                    <hr />
                    <AddItem />

                </>}
            <EditableModal />
        </>
    );
}

export default Bag;