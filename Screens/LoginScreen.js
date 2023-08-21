import React from 'react';
import { useState} from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth , db } from '../Firebase/FirebaseConfig';
import { collection, getDocs } from "firebase/firestore";

const LoginScreen = ({navigation}) => {

    const [usernameFromUI, setUsernameFromUI] = useState("krupapatel08@gmail.com");
    const [passwordFromUI, setPasswordFromUI] = useState("krupa123");

    const onLoginClicked = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, usernameFromUI, passwordFromUI)
            const querySnapshot = await getDocs(collection(db, "Users"));
            let isRenterFound = false;
            querySnapshot.forEach((doc) => {          
                if(doc.data().userType === "renter" && doc.id === userCredentials.user.uid){
                    isRenterFound = true;
                    return
                }                           
            })
            if (isRenterFound) {
                navigation.navigate('Home');
            } else {
                console.log("Invalid user");
            }
        } catch(err) {
            console.log(err)
        }
    }
 
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>
                Login Screen</Text>

            <TextInput
                style={styles.tb}
                placeholder="Enter your email"
                textContentType="emailAddress"
                autoCapitalize="none"
                value={usernameFromUI}
                onChangeText={setUsernameFromUI}
            />
            <TextInput
                style={styles.tb}
                placeholder="Enter your password"
                secureTextEntry={true}
                autoCapitalize="none"
                value={passwordFromUI}
                onChangeText={setPasswordFromUI}
            />

            <Pressable style={styles.btn}>
                <Text style={styles.btnLabel} onPress={onLoginClicked}>Login</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 10,
        width: "100%"
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center"
    },
    tb: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: "#efefef",
        color: "#333",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 10,
    },
    formLabel: {
        fontSize: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10
    }
});

export default LoginScreen;