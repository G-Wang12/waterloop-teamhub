import React, { useState, useContext, useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeContext } from "styled-components";
import anime from "animejs";

import PageTemplate from '../frontend/components/templates/PageTemplate';
import { SystemComponent } from '../frontend/components/atoms/SystemComponents';
import Header3 from '../frontend/components/atoms/Header3';
import Card from '../frontend/components/atoms/Card';
import Button from "../frontend/components/atoms/Button";
import MemberFilterComponent from '../frontend/components/molecules/MemberFilterComponent';
import MemberListGrid from '../frontend/components/molecules/MemberListGrid';
import { searchMembers, lookupMember, getFilters } from '../frontend/store/reducers/membersReducer';
import MemberInfoCard from '../frontend/components/organisms/MemberInfoCard';
import MembersFilterModal from '../frontend/components/organisms/MembersFilterModal';

const Home = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const theme = useContext(ThemeContext);

    const members = useSelector(state => state.membersState.members)
    const selectedMember = useSelector(state => state.membersState.selectedMember)
    const loadedMembers = useSelector(state => state.membersState.loadedMembers)
    const filters = useSelector(state => state.membersState.filters);

    const [ modalVisible, setModalVisible ] = useState(false);
    const memberCardRef = useRef();

    const onSelectMember = (id) => {
        if (window.innerWidth < theme.breakpoints[1].slice(0, -2)) {
            router.push(`/members/${id}`);
            return
        }
        if (loadedMembers[id]) {
            dispatch({
                type: "SET_SELECTED_MEMBER",
                payload: loadedMembers[id]
            })
            return
        }
        lookupMember(dispatch, localStorage.getItem("refreshToken"), id);
    };

    const updateSearchQuery = (input, filters) => {
        let normalized = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key].length > 0) normalized[key == "roles" ? "memberType" : key.toLowerCase()] = filters[key][0].label
        });
        searchMembers(dispatch, normalized)
    };

    useEffect(() => {
        getFilters(dispatch, localStorage.getItem("refreshToken"));
    }, [])

    useEffect(() => {
        if (selectedMember._id) {
            anime({
                targets: memberCardRef.current,
                translateX: 0,
                easing: "easeOutQuad",
                duration: 200
            })
        }
    }, [selectedMember])
    
    return (
        <PageTemplate title="Explore">
            <SystemComponent
                position="relative"
                overflow={["auto", "auto", "hidden"]}
                overflowX={"hidden"}
                gridGap={["cardMarginSmall", "cardMarginSmall", "cardMargin"]}
                display={["block", "block", "grid"]}
                gridTemplateRows="auto auto"
                gridTemplateColumns="auto 1fr"
            >
                <MembersFilterModal visible={modalVisible} filters={filters}/>
                <MembersListCard
                    display="grid" gridTemplateColumns="1fr" gridTemplateRows="auto auto 1fr" gridRow={"1/3"}
                    overflowY={["auto", "auto", "scroll"]}
                    overflowX="hidden"
                    position={["relative", "relative", "relative"]}
                    memberData={selectedMember}
                >
                    <SystemComponent display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Header3 style={{ transformOrigin: 'left' }}>Members</Header3>
                        <Button 
                            display={["block", "block", "none"]}
                            onClick={() => setModalVisible(!modalVisible)}
                        >
                            Edit Filters
                        </Button>
                    </SystemComponent>
                    <MemberFilterComponent filterOptions={filters} updateSearchQuery={updateSearchQuery} />
                    <MemberListGrid members={members} onSelect={onSelectMember} />
                </MembersListCard>
                <MemberCard 
                    animRef={memberCardRef}
                    memberData={selectedMember}
                    onClose={() => {
                        anime({
                            targets: memberCardRef.current,
                            translateX: "110%",
                            easing: "easeOutQuad",
                            duration: 200
                        }).finished.then(() => {
                            dispatch({
                                type: "SET_SELECTED_MEMBER",
                                payload: {}
                            })
                        })
                        
                    }}
                />
            </SystemComponent>
        </PageTemplate>
    );
};

export default Home;

const MembersListCard = styled(Card)`
    transition: transform 0.2s ease-out;
    -webkit-transition: transform 0.5s ease;

    width: calc(100vw - ${props => 2 * props.theme.space.cardMarginSmall + 2 * props.theme.space.cardPaddingSmall}px);
    top: 0;
    ${props => props.theme.mediaQueries.tablet} {
        height: auto;
        transform: none;
        width: 300px;
    }

    ${props => props.theme.mediaQueries.smallDesktop} {
        width: 35vw;
    }
`

const MemberCard = styled(MemberInfoCard)`
    display: none !important;
    ${props => props.theme.mediaQueries.tablet} {
        display: grid !important;
        width: auto;
        position: relative;
        height: auto;
        transition: all 0.2s ease-in-out;
    }
`;