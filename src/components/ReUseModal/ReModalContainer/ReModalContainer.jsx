import { useSelector } from 'react-redux';
import {
  selectModalType,
  selectIsModalOpen,
} from '../../../redux/modal/selectors.js';
import ReUseModal from '../ReUseModal.jsx';
import TestContent1 from '../ReUseTest1/ReUseTest1.jsx';
import TestContent2 from '../ReUseTest2/ReUseTest2.jsx';

export default function ReModalContainer() {
  const isOpen = useSelector(selectIsModalOpen);
  const type = useSelector(selectModalType);

  if (!isOpen) return null;

  return (
    <ReUseModal>
      {type === 'test1' && <TestContent1 />}
      {type === 'test2' && <TestContent2 />}
    </ReUseModal>
  );
}
