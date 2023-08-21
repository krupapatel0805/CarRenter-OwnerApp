import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { db } from '../Firebase/FirebaseConfig'
import { collection, getDocs} from "firebase/firestore";
import SelectedMarkerSummary from "../Component/SelectedMarkerDetails";

const SearchScreen = () => {

    const [currLatitude, setCurrentLatitude] = useState(null);
    const [currLongitude, setCurrentLongitude] = useState(null);
    const [isCurrLocationFetched, setIsCurrLocationFetched] = useState(false);
    const [markersList, setMarkersList] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const getCurrentLocation = async () => {
        try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access location was denied");
            return;
        }
        let location = await Location.getCurrentPositionAsync();
        setCurrentLatitude(location.coords.latitude);
        setCurrentLongitude(location.coords.longitude);
        setIsCurrLocationFetched(true)
        } catch (err) {
        console.log(err);
        }
    };

    const generateMarkers = async () => {
        try {
        const querySnapshot = await getDocs(collection(db, "RentedVehicleInfo"));
        const vehicleDataFromFirestore = [];
        querySnapshot.forEach((doc) => {
            const vehicleData = {
            pickupAdd: doc.data().pickupAddress,
            latitude: doc.data().addressCoordinates.latitude,
            longitude: doc.data().addressCoordinates.longitude,
            price: doc.data().rentalPrice,
            name: doc.data().name,
            fuelType: doc.data().fuelType,
            lisencePlate: doc.data().lisencePlate,
            range: doc.data().range,
            seatingCapacity: doc.data().seatingCapacity,
            image: doc.data().image,
            city: doc.data().city,
            vehicleOwnerName: doc.data().vehicleOwnerName,
            ownerImage: doc.data().ownerImage,
            };
            vehicleDataFromFirestore.push(vehicleData);
            
        });
        setMarkersList(vehicleDataFromFirestore);
        } catch (error) {
        console.log(error);
        }
    };
      

    useEffect(() => {
        getCurrentLocation();
        generateMarkers()
    }, []);
  
    useEffect(() => {
      }, [markersList]);

  return (
    <View style={{ flex:1}}>
        { !isCurrLocationFetched ? (
        <ActivityIndicator animating={true} size="large"/>
        ) :
        (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: currLatitude,
            longitude: currLongitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}>
            {
                markersList.map(
                    (currMarker, index)=>{
                        const coords = {
                            latitude: currMarker.latitude,
                            longitude: currMarker.longitude
                        }
                        return (
                            <Marker key={currMarker.pickupAdd} coordinate={coords} onPress={() => setSelectedMarker(currMarker)}>
                                <View  style={{ backgroundColor: 'white', padding: 8, borderRadius: 5}}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>${currMarker.price}</Text>
                                </View>
                            </Marker>
                            
                        )
                    }
                )
            }
            
        </MapView>
      )}

        {selectedMarker && (
            <SelectedMarkerSummary
              selectedMarker={selectedMarker}
              onClose={() => setSelectedMarker(null)}
            />
        )}
    </View>
  );
};

export default SearchScreen;