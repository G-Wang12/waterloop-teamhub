import React from 'react';
import { connect } from 'react-redux';

import {
    addMember,
    removeMember,
    loadAllMembers,
    loadSelectedMember
} from '../frontend/data/reducers/memberSlice';

import PageTemplate from '../frontend/components/templates/PageTemplate';
import { SystemComponent } from '../frontend/components/atoms/SystemComponents';
import Header3 from '../frontend/components/atoms/Header3';
import Card from '../frontend/components/atoms/Card';
import MemberFilterComponent from '../frontend/components/molecules/MemberFilterComponent';
import MemberListGrid from '../frontend/components/molecules/MemberListGrid';
import MemberInfoCard from '../frontend/components/organisms/MemberInfoCard';

const Home = ({ members, loadSelectedMember, selectedMember, loadAllMembers }) => {
    const onSelectMember = (id) => {
        loadSelectedMember(id);
    };

    const updateSearchQuery = (input, filters) => {
        let normalized = {};
        Object.keys(filters).forEach(key => {
            if (filters[key].length > 0) normalized[key] = {
                _id: filters[key][0].value,
                name: filters[key][0].label
            };
        });
        loadAllMembers(normalized);
    };

    // get filters for members list
    const filters = (data) => {
        let returnData = {};
        function map(dataKey) {
            if (data[dataKey]) return Object.keys(data[dataKey]).map(key => ({ label: data[dataKey][key].name, value: key }));
            return undefined;
        }
        returnData.skills = map('skills');
        returnData.subteam = map('subteams');
        returnData.program = map('program');
        returnData.interests = map('interests');

        return returnData;
    };


    return (
        <PageTemplate title="Explore">
            <SystemComponent
                overflow="hidden"
                gridGap="cardMargin"
                display="grid"
                gridTemplateRows="auto auto"
                gridTemplateColumns="auto 1fr"
            >
                <Card
                    style={{ transformOrigin: 'left' }}
                    width={'40vw'} minWidth={[300, 300, 300, '25vw']} maxWidth={400, 400, 400, 'inherit'} gridRow="1/3"
                    display="grid" gridTemplateColumns="1fr" gridTemplateRows="auto auto 1fr"
                    overflow="scroll"
                >
                HAHA
                    <Header3 style={{ transformOrigin: 'left' }}>Members</Header3>
                    <MemberFilterComponent filterOptions={filters(members)} updateSearchQuery={updateSearchQuery} />
                    <MemberListGrid members={members.members} onSelect={onSelectMember} />
                </Card>

                <MemberInfoCard memberData={selectedMember} />
            </SystemComponent>
        </PageTemplate>
    );
};

const mapStateToProps = (state) => {
    return {
        members: state.members,
        selectedMember: state.members.selectedMember
    };
};

const mapDispatchToProps = {
    addMember,
    removeMember,
    loadSelectedMember,
    loadAllMembers
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
