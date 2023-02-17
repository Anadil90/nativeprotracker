import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const LoginScreen = () => {
    const [isLoginModalVisible, setLoginModalVisible] = React.useState(false);
    const [isRegisterModalVisible, setRegisterModalVisible] = React.useState(false);

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00008B',
        }}>
            <Text onPress={() => setLoginModalVisible(true)} style={styles.container}>Login</Text>
            <Text onPress={() => setRegisterModalVisible(true)} style={styles.container}>Register</Text>
            <LoginModal visible={isLoginModalVisible} setVisible={setLoginModalVisible} />
            <RegisterModal visible={isRegisterModalVisible} setVisible={setRegisterModalVisible} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        fontSize: 30,
        color: 'white'
    }
});
export default LoginScreen;
