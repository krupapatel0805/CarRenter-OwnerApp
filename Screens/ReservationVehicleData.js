import React, { useEffect, useState } from 'react';
import { View, Text, Image , StyleSheet, ScrollView} from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';

const ReservationData = ({route}) => {

    const {docId} = route.params
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        const bookingDocRef = doc(db, 'reservationBooking', docId);
        const unsubscribe = onSnapshot(bookingDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setBookingData(docSnap.data());
          }
        });
    
        return () => unsubscribe();
      }, [docId]);


    if (!bookingData) {
        return <Text>Loading...</Text>;
      }

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.carDetails}>
              <Text style={styles.descriptionText}>Name: {bookingData.name}</Text>
              <Image style={{width:300, height:200,alignSelf:"center",marginVertical:10}} source={ {uri: bookingData.vehicleImage} } resizeMode='contain'/>
              <Text style={styles.descriptionText}>Booking Date: {bookingData.bookingDate}</Text>
              <Text style={styles.descriptionText}>License Plate: {bookingData.lisencePlate} </Text>
              <Text style={styles.descriptionText}>Pickup Location: {bookingData.pickupAdd}</Text>
              <Text style={styles.descriptionText}>Price: ${bookingData.price}</Text>
              <Text style={styles.descriptionText}>Range: {bookingData.range}KM</Text>
              <Text style={styles.descriptionText}>Fuel Type: {bookingData.fuelType}</Text>
              <Text style={styles.descriptionText}>City: {bookingData.city}</Text>
          </View>
          <View style={styles.ownerDetails}>
            <Text style={styles.title}>Owner's Profile</Text>
            <Image
              style={styles.ownerProfileImage}
              source={{ uri: bookingData.ownerImage }}
              resizeMode="cover"
            />
            <Text style={styles.descriptionText}>{bookingData.vehicleOwnerName}</Text>
          </View>
          <View style={styles.bookingStatus}>
            <Text style={styles.title}>Booking Status</Text>
            <Text style={styles.descriptionText}>Status: {bookingData.bookingStatus}</Text>
            {bookingData.bookingStatus === 'Confirmed' && (
              <Text style={{ fontSize: 20, marginVertical: 10 }}>Confirmation Code: CARBOK</Text>
            )}
          </View>
          </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  carDetails: {
    marginBottom: 20,
  },
  ownerDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bookingStatus: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 18,
    marginBottom: 5,
  },
  ownerProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 75,
    marginBottom: 10,
  },
});

export default ReservationData;