import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';

import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import LogoImage from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {
  Container,
  BackButton,
  UserAvatarButton,
  UserAvatarImage,
  CustomTitle,
  Title
} from './styles';
import { useAuth } from '../../context/AuthContext';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

const Profile = () => {
  const formRef = useRef<FormHandles>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmationPasswordInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          oldPassword: Yup.string(),
          newPassword: Yup.string().when('oldPassword', {
            is: (oldPassword: string) => !!oldPassword.length,
            then: Yup.string()
              .required('A senha é obrigatória')
              .min(6, 'No mínimo 6 dígitos'),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string()
            .when('oldPassword', {
              is: (oldPassword: string) => !!oldPassword.length,
              then: Yup.string()
                .required('A senha é obrigatória')
                .min(6, 'No mínimo 6 dígitos'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('newPassword', undefined)],
              'Confirmação incorreta',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          oldPassword,
          newPassword,
          passwordConfirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(oldPassword && {
            oldPassword,
            newPassword,
            passwordConfirmation,
          }),
        };

        const response = await api.put('/profile', formData);

        await updateUser(response.data);

        Alert.alert(
          'Atualizado com sucesso!',
          'Suas informações do perfil foram atualizadas com sucesso!',
        );

        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro!',
          'Erro durante cadastro. Tente novamente!',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker({
      title: 'Selecione um avatar',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar câmera',
      chooseFromLibraryButtonTitle: 'Escolher da galera'
    }, (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.error) {
        Alert.alert('Erro ao atualizar seu avatar.');
        return;
      }

      const data = new FormData();

      data.append('avatar', {
        type: 'image/jpeg',
        name: `${user.id}.jpg`,
        uri: response.uri,
      });

      api.patch('/users/avatar', data).then((apiResponse) => {
        updateUser(apiResponse.data);
      });
    });
  }, [updateUser, user.id]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={Platform.OS === 'android' ? { flexGrow: 1 } : { flex: 1 }}
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatarImage source={{ uri: user.avatarUrl }} />
            </UserAvatarButton>

            <CustomTitle>
              <Title style={{ textAlign: 'left' }}>Meu Perfil</Title>
            </CustomTitle>

            <Form initialData={user} onSubmit={handleSubmit} ref={formRef} style={{ width: '100%' }}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                keyboardType="email-address"
                autoCompleteType="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                name="oldPassword"
                icon="lock"
                textContentType="password"
                placeholder="Senha atual"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                secureTextEntry
                onSubmitEditing={() => {
                  newPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={newPasswordInputRef}
                name="newPassword"
                icon="lock"
                textContentType="newPassword"
                placeholder="Nova senha"
                returnKeyType="next"
                secureTextEntry
                onSubmitEditing={() => {
                  confirmationPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={confirmationPasswordInputRef}
                name="passwordConfirmation"
                icon="lock"
                placeholder="Confirmação de senha"
                returnKeyType="send"
                secureTextEntry
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => {
                formRef.current?.submitForm();
              }}
              >
                Confirmar mudança

              </Button>
            </Form>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

    </>
  );
};

export default Profile;
