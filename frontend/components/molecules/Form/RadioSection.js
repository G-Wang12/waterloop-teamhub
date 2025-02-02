import React from 'react';
import { SystemComponent } from '../../atoms/SystemComponents';
import RadioButton from '../../atoms/Radio';

const RadioSection = ({ options, name, selectedOption, setSelectedOption }) => {
    const selectOption = (newSelectedValue) => {
        setSelectedOption(name, newSelectedValue);
    };

    return (
        <>
            {options.map((opt) => (
                <SystemComponent
                    key={opt}
                    onClick={() => selectOption(opt)}
                    height='40px'
                >
                    <RadioButton selected={opt === selectedOption} />
                    <SystemComponent ml='45px' fontSize='16px' pt='2px'>
                        {opt}
                    </SystemComponent>
                </SystemComponent>
            ))}
        </>
    );
};
export default RadioSection;
