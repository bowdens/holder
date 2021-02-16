import Toast from "react-bootstrap/Toast";
import { useDispatch, useSelector } from "react-redux";
import { dismissToast, selectToasts } from "./toastsSlice";


const Toasts = () => {
    const toasts = useSelector(selectToasts);
    const dispatch = useDispatch();

    return (
        <>
            <div style={{
                position: "sticky",
                bottom: "40px",
                right: "40px",
                float: "right"
            }}>
                {toasts.map(t =>
                    <Toast
                        key={t.key}
                        onClose={() => {
                            dispatch(dismissToast({ key: t.key }));
                        }}
                        delay={10000}
                        autohide
                    >
                        <Toast.Header>
                            <strong className="mr-auto">
                                {t.header}
                            </strong>
                            <small>
                            </small>
                        </Toast.Header>
                        <Toast.Body>
                            {t.content}
                        </Toast.Body>
                    </Toast>
                )}

            </div>
        </>
    );
}

export default Toasts;