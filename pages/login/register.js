import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ThemeContext } from 'styled-components';

import useLoginTransition from '../../frontend/hooks/useLoginTransition';
import useLoginController from '../../frontend/hooks/useLoginController';
import { updateUser } from '../../frontend/store/reducers/userReducer';
import useLoadingScreen from '../../frontend/hooks/useLoadingScreen';

import PageTemplate from '../../frontend/components/templates/PageTemplate';
import { SystemComponent } from '../../frontend/components/atoms/SystemComponents';
import Card from '../../frontend/components/atoms/Card';
import FieldSection from '../../frontend/components/molecules/Form/FieldSection';
import FormHeader from '../../frontend/components/molecules/Form/FormHeader';
import FormFooter from '../../frontend/components/molecules/Form/FormFooter';
import LoginTransition from '../../frontend/components/templates/LoginTransition';
import LoadingModal from '../../frontend/components/atoms/LoadingModal';

import { useFormAndUserDetails } from '../../frontend/hooks/forms';
import {
    validateFields,
    isInvalidPhoneNumber,
    isInvalidStudentId,
    clearErrorMessageIfExists,
    scrollToFirstError,
    initHasErrorsToFalse,
    getFieldDefaultValues,
    formatFormValues,
} from '../../frontend/util';
import _ from 'lodash';

const FORM_NAME_KEY = 'register';

const RegistrationForm = () => {
    const theme = useContext(ThemeContext);

    const dispatch = useDispatch();
    const router = useRouter();
    const { user, hydrated } = useSelector((state) => state.userState);
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formValues, setFormValues] = useState({});
    const [hasError, setHasError] = useState({});
    const [formSections, setFormSections] = useState([]);

    const [loader, showLoader, hideLoader] = useLoadingScreen(true);
    const loginTransition = useLoginTransition();
    useLoginController(loginTransition, dispatch, router.pathname);

    useEffect(() => {
        if (hydrated) {
            useFormAndUserDetails(FORM_NAME_KEY, dispatch, router, user._id)
                .then((res) => {
                    if (res.success) {
                        const sections = res.body.form.sections
                            .map((s) => {
                                let newObj = {
                                    ...s,
                                    ..._.omit(s.section, ['_id']),
                                };
                                delete newObj._id;
                                delete newObj.section;
                                return newObj;
                            })
                            .sort((a, b) => a.position - b.position);

                        setFormTitle(res.body.form.title);
                        setFormDescription(res.body.form.description);
                        setFormSections(sections);
                        setFormValues(getFieldDefaultValues(sections));
                        setHasError(initHasErrorsToFalse(sections));
                    }
                    // TODO: handle error case
                })
                .catch((e) => {
                    console.error(e);
                    throw e;
                })
                .finally(() => {
                    hideLoader();
                });
        }
    }, [hydrated]);

    const setErrorMessages = () => {
        const sectionMetadataByName = {};
        formSections.map((section) => {
            sectionMetadataByName[section.name] = {
                type: section.type,
                required: section.required,
            };
        });
        const hasValidationPassed = validateFields(
            formValues,
            sectionMetadataByName
        );
        const formErrorsList = {};
        Object.keys(hasValidationPassed).map((key) => {
            formErrorsList[key] = !hasValidationPassed[key];
        });
        setHasError(formErrorsList);
        return formErrorsList;
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const formErrorsList = setErrorMessages();
        const formHasErrors = Object.values(formErrorsList).some((err) => err);

        if (!formHasErrors) {
            showLoader();
            loginTransition.setVisible(false);
            updateUser(dispatch, formatFormValues(formValues), user._id, router)
                .then(() => {
                    router.push('/');
                })
                .catch((err) => {
                    console.error(err);
                    alert('Failed to submit registration form. Error: ' + err);
                })
                .finally(() => {
                    hideLoader();
                });
        } else {
            scrollToFirstError(formSections, formErrorsList);
        }
    };

    const handleInputChange = (name, value) => {
        clearErrorMessageIfExists(name, hasError, setHasError);

        // Prevent user from typing in non-numeric characters.
        if (name === 'phoneNumber') {
            if (value && isInvalidPhoneNumber(value)) {
                return;
            }
        } else if (name === 'studentId') {
            if (value && isInvalidStudentId(value)) {
                return;
            }
        }
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFieldChange = (name, value) => {
        clearErrorMessageIfExists(name, hasError, setHasError);
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <>
            <PageTemplate>
                <LoginTransition transitionRef={loginTransition.ref}>
                    <SystemComponent>
                        <Card
                            css={{
                                boxSizing: 'border-box',
                            }}
                            width={['98%', '500px', '700px', '768px']}
                            margin={['cardMarginSmall', 'auto']}
                            padding={[
                                'cardPaddingSmall',
                                'cardPadding',
                                'cardPadding',
                            ]}
                        >
                            <FormHeader
                                title='Tell us More About You'
                                marginBottom={theme.space.titleBottomMargin}
                            />
                            <SystemComponent
                                display='grid'
                                gridTemplateColumns='1fr'
                                gridAutoRows='autofill'
                                gridAutoFlow='row'
                                gridGap={[
                                    'cardPadding',
                                    'cardMargin',
                                    'cardMargin',
                                ]}
                                justifyItems='start'
                                overflowY='auto'
                            >
                                {formSections.map((s) => (
                                    <FieldSection
                                        key={s.name}
                                        type={s.type}
                                        title={s.display}
                                        required={s.required}
                                        name={s.name}
                                        value={formValues[s.name]}
                                        onChange={
                                            [
                                                'text',
                                                'longtext',
                                                'phone',
                                                'numbers',
                                                'email',
                                            ].includes(s.type)
                                                ? handleInputChange
                                                : handleFieldChange
                                        }
                                        hasError={hasError[s.name]}
                                        errorText={s.errorText}
                                        options={s.options}
                                    />
                                ))}
                            </SystemComponent>
                            <FormFooter
                                handleSubmit={handleSubmit}
                                submitDisabled={!hydrated}
                            />
                        </Card>
                        {loader}
                    </SystemComponent>
                </LoginTransition>
            </PageTemplate>
            <LoadingModal visible={!loginTransition.visible} />
        </>
    );
};

export default RegistrationForm;
