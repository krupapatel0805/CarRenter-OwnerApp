import { useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import { auth } from '../Firebase/FirebaseConfig';
import { signInWithEmailAndPassword} from 'firebase/auth';
import { db } from '../Firebase/FirebaseConfig'
import { collection, getDocs} from "firebase/firestore";

const SignInScreen = ({navigation}) => {
    const [usernameFromUI, setUsernameFromUI] = useState("akshat.sri19@gmail.com");
    const [passwordFromUI, setPasswordFromUI] = useState("akshat123");
  
    const onLoginClicked = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, usernameFromUI, passwordFromUI)
            const querySnapshot = await getDocs(collection(db, "Users"));
            let isOwnerFound = false;
            querySnapshot.forEach((doc) => {          
                if(doc.data().userType === "owner" && doc.id === userCredentials.user.uid){
                    isOwnerFound = true;
                    return
                }                           
            })
            if (isOwnerFound) {
                navigation.navigate('Home');
            } else {
                console.log("Invalid user");
            }
        } catch(err) {
            console.log(err)
        }
    }
  
  return(
    <View style={styles.container}>
        <Text style={styles.headerText}>Login Screen</Text>
        <TextInput
            style={styles.tb}
            placeholder="peter@gmail.com"
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

export default SignInScreen

const styles = StyleSheet.create({   
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding:20,
      }, 
    btn: {
        borderWidth:1,
        borderColor:"#141D21",
        borderRadius:8,
        paddingVertical:16,
        marginVertical:10
    }, 
    btnLabel: {
        fontSize:20,
        textAlign:"center"
    }, 
    tb: {
        width:"100%",   
        borderRadius:5,
        backgroundColor:"#efefef",
        color:"#333",
        fontWeight:"bold", 
        paddingHorizontal:10,
        paddingVertical:15,
        marginVertical:10,       
    },
    formLabel: {
        fontSize:16,
    },
    headerText: {
        fontSize:20, 
        fontWeight:"bold", 
        marginVertical:10
    }
  });