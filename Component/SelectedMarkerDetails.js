import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth, query, where } from '../Firebase/FirebaseConfig';

const SelectedMarkerSummary = ({ selectedMarker, onClose }) => {

  const generateRandomFutureDate = () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
    return futureDate;
  };

  const bookNow = async () => {
    try {
      const bookingDate = generateRandomFutureDate();
      let name = ""
      let ownerImage = ""
      const querySnapshot = await getDocs(collection(db, "Users"));
      querySnapshot.forEach((doc) => {
        if (doc.data().userType === "renter" && doc.id === auth.currentUser.uid) {
          name = doc.data().name
          ownerImage = doc.data().image
          return
        }
      })

      const vehicleToInsert = {
        vehicleImage: selectedMarker.image,
        name: selectedMarker.name,
        pickupAdd: selectedMarker.pickupAdd,
        lisencePlate: selectedMarker.lisencePlate,
        seatingCapacity: selectedMarker.seatingCapacity,
        range: selectedMarker.range,
        fuelType: selectedMarker.fuelType,
        bookingDate: bookingDate.toDateString(),
        ownerName: name,
        price: selectedMarker.price,
        bookingStatus: "Awaiting Confirmation",
        ownerImage: selectedMarker.ownerImage,
        city: selectedMarker.city,
        vehicleOwnerName: selectedMarker.vehicleOwnerName
      };
      await addDoc(collection(db, "reservationBooking"), vehicleToInsert);
      alert(`${selectedMarker.name} added successfully`);
    } catch (err) {
      console.log(err);
    }
  };

  if (!selectedMarker) {
    return null;
  }

  return (

    <View style={styles.container}>
      <Text style={styles.nameText}>{selectedMarker.pickupAdd}</Text>
      <Image style={{ width: 300, height: 200, alignSelf: "center", marginVertical: 10 }} source={{ uri: selectedMarker.image }} resizeMode='contain' />
      <Text style={styles.descriptionText}>Car name: {selectedMarker.name}</Text>
      <Text style={styles.descriptionText}>Lisence plate: {selectedMarker.lisencePlate}</Text>
      <Text style={styles.descriptionText}>Seating capacity: {selectedMarker.seatingCapacity}</Text>
      <Text style={styles.descriptionText}>Range: {selectedMarker.range}</Text>
      <Text style={styles.descriptionText}>Fuel type: {selectedMarker.fuelType}</Text>
      <Text style={styles.descriptionText}>City:{selectedMarker.city}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Pressable onPress={bookNow} style={styles.bookNowButton}>
          <Text style={styles.buttonText}>Book Now</Text>
        </Pressable>
        <Pressable style={styles.bookNowButton} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    marginBottom: 8,
  },
  bookNowButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SelectedMarkerSummary