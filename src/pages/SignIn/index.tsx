import React from 'react';
import { Image } from 'react-native';

import { Container, Title } from './styles';

import LogoImage from '../../assets/logo.png';

const SignIn = () => (
  <Container>
    <Image source={LogoImage} />
    <Title>Faça seu logon</Title>
  </Container>
);

export default SignIn;
