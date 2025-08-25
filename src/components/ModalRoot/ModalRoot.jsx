import { useSelector } from "react-redux";
import { selectIsModalOpen, selectModalType } from "../../redux/modal/selectors.js";
import ModalNotAuthorized from "../ModalNotAuthorized/ModalNotAuthorized.jsx";
import ModalLogoutConfirm from "../ModalLogoutConfirm/ModalLogoutConfirm.jsx";

const ModalRoot = () => {
    const isOpen = useSelector(selectIsModalOpen);
    const type = useSelector(selectModalType);

    if(!isOpen || !type) return null;

    switch (type) {
        case 'notAuthorized':
            return <ModalNotAuthorized />;
        case 'logoutConfirm':
            return <ModalLogoutConfirm />;
        default:
            return null;
    }
};

export default ModalRoot;