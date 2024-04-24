import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import CustomLoader from "./CustomLoader";

import styles from "@/components/modules/CustomForm.module.css";

export default function CustomForm({ onSubmit, loading, containerClassName, formClassName, h1, paragraphs, inputs, buttons, extraContent }) {
    return (
        <div className={`${styles[containerClassName]}`}>
            {loading && <CustomLoader />}
            <form onSubmit={onSubmit} className={`${styles[formClassName]}`}>
                {h1 && <h1>{h1}</h1>}
                {paragraphs}
                {inputs.length > 0 && inputs.map((input, index) => (
                    <CustomInput key={index} {...input} />
                ))}
                {buttons.length > 0 && buttons.map((button, index) => (
                    <CustomButton key={index} {...button} />
                ))}
            </form>
            {extraContent}
        </div>
    );
};