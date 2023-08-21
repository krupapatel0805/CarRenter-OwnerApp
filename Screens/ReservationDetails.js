import React, { useEffect, useState } from 'react';
import { View, Text , StyleSheet, FlatList, Pressable} from 'react-native';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db , auth } from '../Firebase/FirebaseConfig';

const ReservationDetails = ({navigation}) => {

  const[bookedVehicles,setBookedVehicles] = useState([])
  const [loading, setLoading] = useState(true);

    const fetchReservationData = async () => {
      try {
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
                .filter((doc) => doc.data().ownerName === name)
                .map((doc) => ({
                  ...doc.data(),
                  docId: doc.id,
                }));
              setBookedVehicles(resultsFromFirestore);
            });
            setLoading(false);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
        setLoading(false);
      }
    };

    const renderItem = ({ item }) => {
      return (
        <Pressable
          style={styles.reservationItem}
          onPress={() => navigation.navigate('ReservationData',{docId:item.docId})}
        >
          <View style={styles.detailsContainer}>
            <Text style={styles.vehicleName}>{item.name}</Text>
          </View>
        </Pressable>
      );
    };

    useEffect(() => {
      fetchReservationData();
    }, []);

    useEffect(() => {
    }, [bookedVehicles]);
  
 
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
        <View style={styles.container}>
          <FlatList
            data={bookedVehicles}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
          />
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f0f0f0',
    },
    reservationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 8,
      marginBottom: 16,
    },
    vehicleImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 16,
    },
    detailsContainer: {
      flex: 1,
    },
    vehicleName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });

export default ReservationDetails
