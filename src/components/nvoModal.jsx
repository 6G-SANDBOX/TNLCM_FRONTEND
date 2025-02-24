import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NvoModal = ({ component,removeComponent }) => {


    return (
            <div className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-2">
                <span>NOT VALID COMPONENT: {component.label}</span>
                <button onClick={() => removeComponent(component.id)} className="text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
    );
};

export default NvoModal;