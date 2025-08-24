import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/modal/slice.js';

export default function TestModalButtons() {
  const dispatch = useDispatch();

  return (
    <div style={{ display: 'flex', gap: '10px', margin: '20px' }}>
      <button onClick={() => dispatch(openModal({ type: 'test1' }))}>
        Відкрити Test 1
      </button>
      <button onClick={() => dispatch(openModal({ type: 'test2' }))}>
        Відкрити Test 2
      </button>
    </div>
  );
}
