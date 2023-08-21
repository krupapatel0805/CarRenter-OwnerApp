import React, { useEffect, useState } from 'react';
import { View, Text, Button, Pressable, FlatList } from 'react-native';
import { collection, onSnapshot , getDocs} from "firebase/firestore";
import { db , auth } from '../Firebase/FirebaseConfig';


const BookingScreen = ({navigation}) => {

  const [bookingList,setBookingList] = useState([])

  const getBookingData = async () => {
    try{
      let name = ""
        const querySnapshot1 = await getDocs(collection(db, "Users"));
          querySnapshot1.forEach((doc) => {          
              if(doc.data().id === auth.currentUser.uid){
                  name = doc.data().name
                  return
              }                           
          })     
          const querySnapshot = collection(db, "reservationBooking");
          onSnapshot(querySnapshot, (snapshot) => {
            const resultsFromFirestore = snapshot.docs
              .filter((doc) => doc.data().vehicleOwnerName === name)
              .map((doc) => ({
                ...doc.data(),
                docId: doc.id,
              }));
            setBookingList(resultsFromFirestore);
          });
    }catch(err){
      console.log(err);
    }
  }
  

  useEffect(() => {
    getBookingData();
  }, []);

  return (
    <View>
      <FlatList
        data={bookingList}
        keyExtractor={(item) => item.name}
        renderItem={ ({ item }) => (
            <Pressable onPress= {() => navigation.navigate('BookingDetails',{selectedBooking:item, docId: item.docId})}>
              <View style={{backgroundColor:"#dba0a0",padding:10,flexDirection:"row",justifyContent:"space-between"}}>
                  <Text style={{fontSize:20 , fontWeight:"bold"}}>{item.name}</Text>
                  <Text style={{fontSize:20, fontStyle:"italic"}}>{item.bookingStatus}</Text>
              </View>
            </Pressable>
        )}
        ItemSeparatorComponent={() => {
            return <View style={{ borderWidth: 1, borderColor: "#ccc" }} />;
        }}/>
    </View>
  );
};

export default BookingScreen
