import React from 'react';
import GoogleLogin from 'react-google-login';

import Header2 from '../atoms/Header2';
import Header4 from '../atoms/Header4';
import Card from '../atoms/Card';
import styled from 'styled-components';
import { SystemComponent } from '../atoms/SystemComponents';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../store/reducers/userReducer';

export default ({onFinish}) => {
    const dispatch = useDispatch()
    function responseGoogle(response) {
        userLogin(response, dispatch).then(_ => {
            onFinish && onFinish();
        })
    }
    return (
        <LoginCard>
            <SystemComponent m={7}>
                <Header2 mb={6}>
                    Log In
                </Header2>
                <Header4 mb={3}>
                    Login with your Waterloop Email
                </Header4>
                <GoogleLogin
                    style={{ fontFamily: 'Nunito Sans' }}
                    clientId="404915833701-5kvp9td9jonstfsola74atmkjct4h00d.apps.googleusercontent.com"
                    buttonText="Sign In"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </SystemComponent>
        </LoginCard>
    );
};

const LoginCard = styled(Card)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    ${props => props.theme.mediaQueries.tablet} {
       width: auto;
    }
`
