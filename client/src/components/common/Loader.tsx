 import { Spinner } from 'react-bootstrap';

const Loader = ({ text = 'Loading...' }) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <Spinner animation="border" role="status" style={{ color: 'var(--accent-color)' }}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            {text && <p className="mt-2 text-secondary">{text}</p>}
        </div>
    );
};
export default Loader;
