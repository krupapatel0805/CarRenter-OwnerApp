import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase/FirebaseConfig'
import { signOut } from 'firebase/auth'

const LogoutButton = ({}) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try{
        if(auth.currentUser === null){
            alert("Logout Pressed: There is no user to logout !")
        }else{
            await signOut(auth)
            navigation.navigate('SignIn')
        }
    }catch(err){
        console.log(err)
    }  
  };

  return (
    <View style={{ marginRight: 16 , padding: 10}}>
      <Icon name="sign-out" size={30}  onPress={handleLogout} />
    </View>
  );
};

export default LogoutButton;