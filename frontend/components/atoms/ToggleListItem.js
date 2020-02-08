import styled from 'styled-components';
import Button from './Button';
import { variant } from 'styled-system';


// TODO: consider making this inherit from SystemButton --> decouples these 2 atoms
const ToggleListItem = styled(Button)`
    padding-top: 2px;
    padding-bottom: 2px;

    &::after {
        margin-left: 15px;
        content: "✔";
    }
`;
export default ToggleListItem;