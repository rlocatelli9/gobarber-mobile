import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px 30px 70px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Regular';
  margin: 64px 0 24px;
`;

export const ForgotPassword = styled.TouchableOpacity`
  margin-top: 24px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

export const ForgotPasswordText = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
  margin-left: 16px;
`;

export const CreateAccountButton = styled.TouchableOpacity`
  position: absolute;
  left:0;
  bottom: 0;
  right: 0;
  background: #312e38;
  border-top-width: 1px;
  border-color: #232129;
  padding: 16px 0 ${10 + getBottomSpace()}px;

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CreateAccountButtonText = styled.Text`
  color: #ff9000;
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
  margin-left: 16px;
`;
