import yaml from 'js-yaml';
import { FaTrash } from 'react-icons/fa';
import styles from './Descriptor.module.css';

export default function Descriptor ({ yamlData, handleRemoveFromDescriptor }) {
    const descriptor = yaml.load(yamlData);
    
    const handleRemoveClick = (entityName) => {
        handleRemoveFromDescriptor(entityName);
    };

    return (
        <div>
            <div className={styles.descriptor}>
                <h3>Descriptor:</h3>
                <pre>{yamlData}</pre>
            </div>
            <div>
                <h5>Delete components from the descriptor</h5>
                <ul>
                    {Object.keys(descriptor.trial_network).map((entityName, index) => (
                        <li key={index}>
                            <span>{entityName}</span>
                            <FaTrash onClick={() => handleRemoveClick(entityName)} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};