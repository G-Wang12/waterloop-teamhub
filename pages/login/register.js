import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { isEmail } from "validator";
import { ThemeContext } from "styled-components";

import useLoginTransition from "../../frontend/hooks/useLoginTransition";
import useLoginController from "../../frontend/hooks/useLoginController";
import { updateUser } from "../../frontend/store/reducers/userReducer";

import PageTemplate from '../../frontend/components/templates/PageTemplate';
import { SystemComponent, SystemSpan } from '../../frontend/components/atoms/SystemComponents';
import Subtitle from "../../frontend/components/atoms/Subtitle";
import Card from '../../frontend/components/atoms/Card';
import FieldSection from "../../frontend/components/molecules/Form/FieldSection";
import SubmitButton from '../../frontend/components/atoms/SubmitButton';
import LoginTransition from "../../frontend/components/templates/LoginTransition";
import LoadingModal from '../../frontend/components/atoms/LoadingModal';

const TERM_STATUSES = [
    'Academic term, active on Waterloop in-person', 
    'Academic term, active on Waterloop remotely', 
    'Co-op term, working on Waterloop remotely', 
    'Co-op term, active on Waterloop in-person', 
    'Not active on Waterloop this term', 
    'Other',
];

const PREV_TERMS = ['F21', 'S21', 'W21', 'F20', "S20",'W20',];

const FUTURE_TERMS = ['W22', 'S22', 'F22', 'W23', "S23",'F23',];

const MEMBER_TYPES = [
    'Member', 
    'Exec/lead/advisor', 
    'Coop', 
    'Not active on Waterloop this term',
];

const SUBTEAMS = [
    "Software",
    "Electrical",
    "Mechanical",
    "Admin",
    "Infrastructure",
    "Exec",
    "Web"
]

const FormHeader = ({title, marginBottom}) => {
    const theme = useContext(ThemeContext);
    return (
        <SystemComponent
            textAlign='center'
            mb={marginBottom}
        >
            <SystemSpan>
                <Subtitle fontSize={[theme.fontSizes.smallSubtitle, theme.fontSizes.subtitle]}>{title}</Subtitle>
            </SystemSpan>
        </SystemComponent>
    );
}

const FormFooter = ({handleSubmit, submitDisabled}) => {
    return (
        <SystemComponent mt={5} textAlign='center'>
            <SubmitButton handleClick={(e) => handleSubmit(e)} disabled={submitDisabled}>Submit</SubmitButton>
        </SystemComponent>
    );
}

const RegistrationForm = () => {
    const theme = useContext(ThemeContext);

    const dispatch = useDispatch();
    const router = useRouter();
    const { user, hydrated } = useSelector(state => state.userState);
    const loginTransition = useLoginTransition();
    useLoginController(loginTransition, dispatch, router.pathname);

    const [formValues, setFormValues] = useState({
        fullName:  "",
        phoneNumber: "", 
        email: "", 
        program: "", 
        studentId: "",  
        termStatus: "", 
        memberType: "", 
        subteam: "",
        previousTerms: [], 
        futureTerms: [], 
        designCentreSafety: false,
        whmis: false, 
        machineShop: false,
    });

    const [hasError, setHasError] = useState({
        fullName: false,
        phoneNumber: false, 
        email: false, 
        program: false, 
        studentId: false,  
        termStatus: false, 
        memberType: false, 
        subteam: false,
        previousTerms: false, 
        futureTerms: false, 
        designCentreSafety: false,
        whmis: false, 
        machineShop: false,
    });

    const clearErrorMessages = (formErrors) => {
        for (const field of Object.keys(formErrors)) {
            formErrors[field] = false;
        }
    }

    const setErrorMessages = (formErrors) => {
        const {fullName, phoneNumber, email, program, studentId, termStatus, memberType, 
            subteam, designCentreSafety, whmis, machineShop} = formValues;
        if (!fullName || fullName.split(/\s+/).length !== 2) {
            formErrors['fullName'] = true;
        }
        if (!phoneNumber || phoneNumber.length !== 10) {
            formErrors['phoneNumber'] = true;
        }
        if (!email || !isEmail(email)) {
            formErrors['email'] = true;
        }
        if (!program) {
            formErrors['program'] = true;
        }
        if (!studentId || studentId.length !== 8) {
            formErrors['studentId'] = true;
        }
        if (!termStatus) {
            formErrors['termStatus'] = true;
        }
        if (!memberType) {
            formErrors['memberType'] = true;
        }
        if (!subteam) {
            formErrors['subteam'] = true;
        }
        if (designCentreSafety === null || designCentreSafety === undefined) {
            formErrors['designCentreSafety'] = true;
        }
        if (whmis === null || whmis === undefined) {
            formErrors['whmis'] = true;
        }
        if (machineShop === null || machineShop === undefined) {
            formErrors['machineShop'] = true;
        }

        setHasError(formErrors);
    }

    const handleSubmit = (evt) => {
        console.log("HAHA");
        evt.preventDefault();
        console.log('clicked button')
        console.log(formValues)
        const formErrors = {...hasError};

        clearErrorMessages(formErrors);
        setErrorMessages(formErrors);

        const formHasErrors = Object.values(formErrors).some(err => err);
        if (!formHasErrors) {
            loginTransition.setVisible(false);

            const {fullName, phoneNumber, email, program, studentId, termStatus, memberType, 
                subteam, designCentreSafety, whmis, machineShop, previousTerms, futureTerms} = formValues;

            updateUser(dispatch, {
                name: {
                    first: fullName.split(/\s+/)[0].trim(),
                    last: fullName.split(/\s+/)[1].trim()
                },
                phone: phoneNumber.trim(),
                program: program.trim(),
                personalEmail: email.trim(),
                studentId: studentId.trim(),
                activeSchoolTerms: [...previousTerms, ...futureTerms],
                termStatus,
                memberType,
                subteams: [subteam], // NOTE: As of March 2022, members can only select one option for subteam. Before this, members can select multiple subteams. We will keep subteams as an array for now for backwards-compatability and to prevent conflicts with Database data.
                designCentreSafety,
                whmis,
                machineShop,
            }, user._id, router).then(res => {
                router.push("/")
            });
        }        
    }

    const handleInputChange = (name, value) => {
        // Prevent user from typing in non-numeric characters.
        if (name === "phoneNumber") {
            if (value && (!value.match(/^[0-9]*$/) || value.length > 10)) {
                return;
            }
        } else if (name === "studentId") {
            if (value && (!value.match(/^[0-9]*$/) || value.length > 8)) {
                return
            };
        }

        setFormValues({...formValues, [name]: value});
    }

    const handleFieldChange = (name, value) => {
        setFormValues({...formValues, [name]: value})
    }

    return (
        <>
            <PageTemplate>
                <LoginTransition transitionRef={loginTransition.ref}>
                    <SystemComponent>
                        <Card
                            css={{
                                boxSizing: 'border-box'
                            }}
                            width={["98%", "500px", "700px", "768px"]}
                            margin={["cardMarginSmall", "auto"]}
                            padding={["cardPaddingSmall", "cardPadding", "cardPadding"]}
                        >
                            <FormHeader
                                title="Tell us More About You"
                                marginBottom={theme.space.titleBottomMargin}
                            />
                            <SystemComponent
                                display="grid"
                                gridTemplateColumns="1fr"
                                gridAutoRows="autofill"
                                gridAutoFlow="row"
                                gridGap={["cardPadding", "cardMargin", "cardMargin"]}
                                justifyItems="start"
                                overflowY="auto"
                            >
                                <FieldSection 
                                    title='Full Name'
                                    required={true}                     
                                    name="fullName"
                                    required={true}
                                    value={formValues['fullName']}
                                    onChange={handleInputChange}
                                    hasError={hasError['fullName']}
                                    errorText="Please enter your full name."
                                    />
                                <FieldSection 
                                    title='Phone Number'      
                                    name="phoneNumber"
                                    required={true}
                                    value={formValues['phoneNumber']} 
                                    onChange={handleInputChange}
                                    hasError={hasError['phoneNumber']}
                                    errorText="Please enter a valid 10 digit phone number."
                                    />
                                <FieldSection 
                                    title='Personal Email Address'                             
                                    name="email"
                                    required={true}
                                    value={formValues['email']}
                                    onChange={handleInputChange}
                                    hasError={hasError['email']}
                                    errorText="Please enter a valid email."
                                    />
                                <FieldSection 
                                    title='Program'
                                    required={true}                     
                                    name="program"
                                    value={formValues['program']}
                                    onChange={handleInputChange}
                                    hasError={hasError['program']} 
                                    errorText="Please enter your program."       
                                    />
                                <FieldSection 
                                    title='Student ID #' 
                                    required={true}
                                    name="studentId"
                                    value={formValues['studentId']}
                                    onChange={handleInputChange}
                                    hasError={hasError['studentId']} 
                                    errorText="Student ID must have 8 digits."   
                                    /> 
                                <FieldSection 
                                    title="Which describes you best?" 
                                    type="radio" 
                                    name="termStatus"
                                    required={true} 
                                    options={TERM_STATUSES}
                                    onChange={handleFieldChange}
                                    value={formValues.termStatus}
                                    hasError={hasError['termStatus']}
                                    errorText="Please select an option above."
                                    />
                                <FieldSection 
                                    title="Subteam" 
                                    type="radio" 
                                    name="subteam"
                                    required={true}
                                    options={SUBTEAMS}
                                    onChange={handleFieldChange}
                                    value={formValues.subteam}
                                    hasError={hasError['subteam']}
                                    errorText="Please select an option above."
                                    />
                                <FieldSection
                                    title="Membership Type" 
                                    name="memberType"
                                    type="radio" 
                                    required={true}
                                    options={MEMBER_TYPES}
                                    value={formValues.memberType}
                                    onChange={handleFieldChange}
                                    hasError={hasError['memberType']}
                                    errorText="Please select an option above."
                                    />
                                <FieldSection 
                                    title="Previous Terms" 
                                    type="checkbox" 
                                    name="previousTerms"
                                    value={formValues['previousTerms']}
                                    options={PREV_TERMS}
                                    onChange={handleFieldChange}
                                    hasError={hasError['previousTerms']}
                                    />
                                <FieldSection 
                                    title="Future Terms" 
                                    type="checkbox" 
                                    name="futureTerms"
                                    value={formValues['futureTerms']}
                                    options={FUTURE_TERMS}
                                    onChange={handleFieldChange}
                                    hasError={hasError['FUTURE_TERMS']}
                                    />
                                <FieldSection 
                                    title="Student Design Center Safety Requirements" 
                                    name="designCentreSafety"
                                    type="boolean" 
                                    required={true}
                                    onChange={handleFieldChange}
                                    value={formValues.designCentreSafety}
                                    hasError={hasError['designCentreSafety']}
                                    errorText="Please select an option above."
                                    />
                                <FieldSection 
                                    title="WHIMIS 2015" 
                                    name="whmis"
                                    type="boolean" 
                                    required={true}
                                    onChange={handleFieldChange}
                                    value={formValues.whmis}
                                    hasError={hasError['whmis']}
                                    errorText="Please select an option above."
                                    />
                                <FieldSection 
                                    title="Machine Shop Orientation" 
                                    name="machineShop"
                                    type="boolean" 
                                    required={true}
                                    onChange={handleFieldChange}
                                    value={formValues.machineShop}
                                    hasError={hasError['machineShop']}
                                    errorText="Please select an option above."
                                    />
                            </SystemComponent> 
                            <FormFooter handleSubmit={handleSubmit} submitDisabled={!hydrated}/>
                        </Card>
                    </SystemComponent>
                </LoginTransition>
            </PageTemplate>
            <LoadingModal visible={!loginTransition.visible}/>
        </>
    );
};

export default RegistrationForm;