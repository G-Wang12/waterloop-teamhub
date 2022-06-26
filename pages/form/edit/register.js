import React, { useState, useEffect, useContext } from "react";
import styled, { ThemeContext } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import {useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import PageTemplate from "../../../frontend/components/templates/PageTemplate";
import { SystemComponent } from "../../../frontend/components/atoms/SystemComponents";

import { useFormDetails } from '../../../frontend/store/api/forms';
import Section from "../../../frontend/components/organisms/formsection/Section";

const Container = styled(SystemComponent)`
    display: flex;
    flex-direction: column;
    overflow: auto;

    ${Section}:last-child {
        margin-bottom: 0;
    }
`;

const RegFormEditor = () => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const router = useRouter();
    const [formSections, setFormSections] = useState([
        {
            name: 'personalEmail',
            display: 'Personal Email Address',
            description: '',
            type: "email",
            customizable: 'edit'
        },
        {
            name: 'termStatus',
            display: 'Which describes you best ?',
            options: ["Academic term, active on Waterloop in-person","Academic term, active on Waterloop remotely","Co-op term, working on Waterloop remotely","Co-op term, active on Waterloop in-person","Not active on Waterloop this term","Other"],
            type: "menu_single",
            customizable: 'edit'
        },
        {
            name: 'previousTerms',
            display: 'Previous Terms I worked on Waterloop',
            options: ["F22","S22","W22"],
            type: "menu_multi",
            customizable: 'edit'
        },
        {
            name: 'sampleBoolean',
            display: 'True or False Question',
            description: 'same help text',
            type: "boolean",
            customizable: 'delete'
        },
    ]);

    useEffect(() => {
        useFormDetails('629c13c59d0c0a6b357b4e0f', dispatch, router)
            .then(res => {
                console.log("res.body");
                console.log(res.body);
            })
            .catch(e => console.error(e));
    }, [])

    const onTypeChange = (sectionName, newType) => {
        const idx = formSections.findIndex(section => section.name === sectionName)
        if (idx === -1) {
            throw new Error("register.js: Could not find the appropriate form section by section name.");
        }

        const newFormSections = [...formSections];
        newFormSections[idx] = {
            ...newFormSections[idx],
            type: newType,
        };
        setFormSections(newFormSections);
    }

    const onInputChange = (sectionName, inputFieldName, newValue) => {
        const idx = formSections.findIndex(section => section.name === sectionName)
        if (idx === -1) {
            throw new Error("register.js: Could not find the appropriate form section by section name.");
        }

        const newFormSections = [...formSections];
        newFormSections[idx] = {
            ...newFormSections[idx],
            [inputFieldName]: newValue,
        };
        setFormSections(newFormSections);
    }

    const onOptionChange = (sectionName, optionIdx, newValue) => {
        const idx = formSections.findIndex(section => section.name === sectionName)
        if (idx === -1) {
            throw new Error("register.js: Could not find the appropriate form section by section name.");
        }

        const newFormSections = [...formSections];
        newFormSections[idx] = {
            ...newFormSections[idx],
            options: 
                [
                    ...newFormSections[idx].options.slice(0, optionIdx), 
                    newValue, 
                    ...newFormSections[idx].options.slice(optionIdx + 1, newFormSections[idx].options.length)
                ],
        };
        setFormSections(newFormSections);
    }

    const onOptionAdd = (sectionName) => {
        const idx = formSections.findIndex(section => section.name === sectionName)
        if (idx === -1) {
            throw new Error("register.js: Could not find the appropriate form section by section name.");
        }

        const newFormSections = [...formSections];
        newFormSections[idx].options.push('');
        setFormSections(newFormSections);
    }

    const onOptionDelete = (sectionName, optionIdx) => {
        const idx = formSections.findIndex(section => section.name === sectionName)
        if (idx === -1) {
            throw new Error("register.js: Could not find the appropriate form section by section name.");
        }

        const newFormSections = [...formSections];
        newFormSections[idx].options.splice(optionIdx, 1);
        setFormSections(newFormSections);
    }

    const onSectionDelete = (sectionName) => {
        const idx = formSections.findIndex(section => section.name === sectionName)
        if (idx === -1) {
            throw new Error("register.js: Could not find the appropriate form section by section name.");
        }

        const newFormSections = [...formSections];
        newFormSections.splice(idx, 1);
        setFormSections(newFormSections);
    }

    const onSectionDuplicate = (sectionName) => {
        const idx = formSections.findIndex(section => section.name === sectionName)
        if (idx === -1) {
            throw new Error("register.js: Could not find the appropriate form section by section name.");
        }

        const newSection = {
            ...formSections[idx],
            name: uuidv4(),
        }
        setFormSections([
            ...formSections,
            newSection
        ]);
    }

    return (
        <PageTemplate>
            <Container>
                {
                    formSections.map(section => 
                        <Section 
                            key={section.name}
                            name={section.name}
                            type={section.type} 
                            question={section.display} 
                            helpText={section.description} 
                            options={section.options}
                            canDelete={section.customizable === 'delete'}
                            handleTypeChange={onTypeChange}
                            handleInputChange={onInputChange}
                            handleOptionChange={onOptionChange}
                            handleOptionAdd={onOptionAdd}
                            handleOptionDelete={onOptionDelete}
                            handleSectionDelete={onSectionDelete}
                            handleSectionDuplicate={onSectionDuplicate}
                        />
                    )
                }
            </Container>
        </PageTemplate>
    );
}
export default RegFormEditor
