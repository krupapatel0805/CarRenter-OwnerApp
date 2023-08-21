import React, { useState } from 'react';
import { View, Text , Pressable, Image } from 'react-native';
import { doc , updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';

const BookingDetails = ({route}) => {

  const {selectedBooking,docId} = route.params
  const [updatedBooking, setUpdatedBooking] = useState(selectedBooking);
  const [confirmationCode, setConfirmationCode] = useState("")

  const handleConfirm = async () => {
    try {
      const bookingDocRef = doc(db, "reservationBooking", docId);
      await updateDoc(bookingDocRef, { bookingStatus: "Confirmed" });
      setUpdatedBooking({ ...updatedBooking, bookingStatus: "Confirmed" });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecline = async () => {
    try {
      const bookingDocRef = doc(db, "reservationBooking", docId);
      await updateDoc(bookingDocRef, { bookingStatus: "Declined" });
      setUpdatedBooking({ ...updatedBooking, bookingStatus: "Declined" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Text style={{fontSize:25,alignSelf:"center",fontWeight:"bold",marginVertical:10}}>{updatedBooking.name}</Text>
      <Image style={{width:300, height:200,alignSelf:"center",marginVertical:10}} source={ {uri: updatedBooking.vehicleImage} } resizeMode='contain'/>
      <View style={{alignItems:"center"}}>
        <Text style={{fontSize:20, marginVertical:10}}>Booking Date: {updatedBooking.bookingDate}</Text>
        <Text style={{fontSize:20}}>License Plate: {updatedBooking.lisencePlate} </Text>
        <Text style={{fontSize:20, marginVertical:10}}>Pickup Location: {updatedBooking.pickupAdd}</Text>
        <Text style={{fontSize:20}}>Price: ${updatedBooking.price}</Text>
        <Text style={{fontSize:20, marginVertical:10}}>Owner Name: {updatedBooking.ownerName}</Text>
        <Text style={{fontSize:20}}>Booking Status: {updatedBooking.bookingStatus}</Text>
        {updatedBooking.bookingStatus === 'Confirmed' && (
          <Text style={{ fontSize: 20, marginVertical: 10 }}>Confirmation Code: CARBOK</Text>
        )}
        <Text style={{fontSize:30,marginVertical:10,textDecorationLine:"underline"}}>Renter Info:</Text>
        <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",gap:20}}>
        <Image style={{width:50, height:50,alignSelf:"center",marginVertical:10}} source={ {uri: updatedBooking.ownerImage} } resizeMode='contain'/>
          <Text style={{fontSize:20}}>{updatedBooking.ownerName}</Text>   
        </View>
      </View>
      <View style={{flexDirection:"row",justifyContent:"space-evenly", marginVertical:50}}>
        <Pressable style={{ padding:10,borderRadius: 20,backgroundColor:"#1ec940"}} onPress={handleConfirm}>
          <Text style={{fontSize:25}}>Confirm</Text>
        </Pressable>
        <Pressable style={{ padding:10,borderRadius: 20,backgroundColor:"#d63c44"}} onPress={handleDecline}>
          <Text style={{fontSize:25}}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BookingDetails;