import React, { useState } from 'react';
import styled from 'styled-components';
import { SystemComponent } from './SystemComponents';

// Credits: https://www.w3schools.com/howto/howto_css_custom_checkbox.asp
const Checkbox = () => {  
    const [checked, setChecked] = useState(false);  

    return (
      <Wrapper onClick={() => setChecked(!checked)} checked={checked} >
        <Box />
        <Checkmark />
      </Wrapper>
    );
}
export default Checkbox;

const Box = styled(SystemComponent)`
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  border: 1px solid ${props => props.theme.colors.greys[3]};
  box-shadow: inset 0 1px 3px rgba(0,0,0,.3);
`;

const Checkmark = styled(SystemComponent)`
  position: absolute;
  top: 5px;
  left: 9px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
`;

const Wrapper = styled(SystemComponent)`
  display: block;
  position: relative;
  margin-left: 10px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  ${Box} {
    background-color: ${props => props.checked ? props.theme.colors.primaryBlue : props.theme.colors.white};
  }

  &:hover ${Box} {
    background-color: ${props => props.checked ? props.theme.colors.primaryBlue : props.theme.colors.greys[1]};
  }

  &:hover ${Checkmark} {
    display: ${props => props.checked ? "block" : "none"};
  }
`;