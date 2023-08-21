import React, { useState , useEffect} from 'react'
import {ScrollView, Image , View, Text, TextInput , Pressable,FlatList, StyleSheet} from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import Slider from '@react-native-community/slider'
import { Picker } from '@react-native-picker/picker'
import {collection ,addDoc, getDocs} from "firebase/firestore"
import { auth , db } from '../Firebase/FirebaseConfig'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions';


const ListingScreen = ({navigation}) => {

    // vehicle info variables
    const [vehicleName,setVehicleName] = useState("")
    const [vehicleImage,setVehicleImage] = useState("https://autobunny-docs.s3.ca-central-1.amazonaws.com/common/design/cta/luxury.jpg")
    const [seatingCapacity, setSeatingCapacity] = useState(2);
    const [fuelTypeValue,setFuelTypeValue] = useState("")
    const [selectedFuelTypeIndex, setSelectedFuelTypeIndex] = useState(0)
    const [totalRange,setTotalRange] = useState("")

    // owner and renter info variables
    const [lisencePlate,setLisencePlate] = useState("")
    const [pickupAddress,setPickupAddress] = useState("")
    const [pickupAddressCity,setPickupAddressCity] = useState("")
    const [pickupAddressCountry,setPickupAddressCountry] = useState("")
    const [rentalPrice,setrentalPrice] = useState("")

    // list variables
    const [showFlatList, setShowFlatList] = useState(false);
    const [vehiclesData, setVehiclesData] = useState([])

    useEffect(() => {
        getVehiclesFromAPI(vehicleName)
        setSelectedFuelTypeIndex(fuelTypeValue === "PHEV" ? 0 : 1);
    }, [fuelTypeValue]);


    const getVehiclesFromAPI = async (searchQuery) => {
        try {
            const apiURL = "https://akshatsri19.github.io/vehicles.json" 

            const dataFromUrl = await fetch(apiURL)

            const response = await dataFromUrl.json()
            if (searchQuery === "") {
                setVehiclesData(response);
              } else {
                const filteredData = vehiclesData.filter((item) =>
                  item.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.trim.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setVehiclesData(filteredData);
              }
        } catch (error) {
            console.error(error);
        }
    }

    const populateField = (vehicleDataToPopulate) => {
        const name = `${vehicleDataToPopulate.make} ${vehicleDataToPopulate.model} ${vehicleDataToPopulate.trim}`
        setVehicleName(name) 
        setSeatingCapacity(vehicleDataToPopulate.seats_max)
        setFuelTypeValue(vehicleDataToPopulate.fuel)
        setTotalRange(vehicleDataToPopulate.total_range)
        setVehicleImage(vehicleDataToPopulate.images[0].url_full)
        setShowFlatList(false)
    }

    const addRenting = async () => {
        if(vehicleName=="" || lisencePlate == "" || pickupAddress == "" || pickupAddressCity == "" || rentalPrice == ""){
            alert("Please fill the fields")
            return
        }
        try{
            const { status } = await Permissions.askAsync(Permissions.LOCATION);

            if (status !== 'granted') {
            alert('Location permission not granted. Please enable location services in your device settings.');
            return;
            }
            const geocodedLocation = await Location.geocodeAsync(pickupAddress)
            const result = geocodedLocation[0]
            if(result == undefined) {
                alert("No coordinates found")
                return
            }
            let name = ""
            const querySnapshot1 = await getDocs(collection(db, "Users"));
            querySnapshot1.forEach((doc) => {          
                if(doc.data().id === auth.currentUser.uid){
                    name = doc.data().name
                    return
                }                           
            })     
            const vehicleToInsert = {
                name:vehicleName,
                seatingCapacity:seatingCapacity,
                fuelType:fuelTypeValue,
                range:totalRange,
                lisencePlate:lisencePlate,
                pickupAddress:pickupAddress,
                city:pickupAddressCity,
                rentalPrice:rentalPrice,
                addressCoordinates:result,
                image:vehicleImage,
                vehicleOwnerName:name
            }
            const insertedDocument = await addDoc(collection(db, "RentedVehicleInfo"), vehicleToInsert);
            setTotalRange(0)
            setLisencePlate("")
            setPickupAddress("")
            setPickupAddressCity("")
            setPickupAddressCountry("")
            setrentalPrice("")
            alert(`done! ${insertedDocument.id}`)
        }catch(err){
            console.log(err)
        }
    }


  return (
        <View style={{padding:10,backgroundColor:"white",flex:1,alignItems:"center"}}>
             
            <View style={{width:"100%"}}>
                <TextInput placeholder="Vehicle Name eg: Audi A7 TFSIe" 
                    value={vehicleName} onChangeText={
                        (text) => {
                            setVehicleName(text);
                            getVehiclesFromAPI(text);
                            setShowFlatList(true)
                        }
                    } style={{width:"100%",padding:8,borderWidth:1,borderRadius:10,fontSize:18}}/>
                    
                    {
                    showFlatList && vehicleName !== "" && (  
                    <FlatList style={{width:"100%"}}
                    data={vehiclesData}
                    keyExtractor={(item) => item.handle}
                    renderItem={ ({ item }) => (
                        <Pressable onPress={() => populateField(item)}>
                        <View style={{padding:10,backgroundColor:"black"}}>
                            <Text style={{fontSize:15,color:"white"}}>{item.make} {item.model} {item.trim}</Text>
                        </View>
                        </Pressable>
                    )}
                    ItemSeparatorComponent={() => {
                        return <View style={{ borderWidth: 1, borderColor: "#ccc" }} />;
                    }}/>
                )}

                <ScrollView>
                    <View>
                        <Image style={{width:300, height:200,alignSelf:"center"}} source={ {uri: vehicleImage} } resizeMode='contain'/>

                        <View style={{marginVertical:10}}>
                            <Text style={{fontSize:18,fontWeight:"bold"}}>Seating Capacity</Text>
                            <Picker 
                            selectedValue={seatingCapacity}
                            onValueChange={(itemValue) => setSeatingCapacity(itemValue)}
                            style={styles.picker}
                            >
                            <Picker.Item label="2" value={2} />
                            <Picker.Item label="4" value={4} />
                            <Picker.Item label="5" value={5} />
                            <Picker.Item label="7" value={7} />
                            </Picker>
                        </View>
                        

                        <View style={{marginVertical:10}}>
                            <Text style={{fontSize:18, fontWeight:"bold"}}>Fuel Type</Text>
                            <SegmentedControl
                            values={["PHEV", "BEV"]}
                            selectedIndex={selectedFuelTypeIndex}
                            onChange={(event) => {
                                setSelectedFuelTypeIndex(event.nativeEvent.selectedSegmentIndex)
                            }}
                            onValueChange={setFuelTypeValue}
                            />
                        </View>
                        
                        {/* <View style={{marginVertical:10}}>
                            <Text style={{fontSize:18, fontWeight:"bold"}}>Total Range: {totalRange}</Text>
                            <Slider
                            style={{width: "100%", height: 40}}
                            minimumValue={100}
                            maximumValue={2000}
                            value={totalRange}
                            onValueChange={setTotalRange}
                            minimumTrackTintColor="black" 
                            maximumTrackTintColor="#d3d3d3" 
                            thumbTintColor="black"
                            />
                        </View> */}
                       
                    </View>

                    <View style={{marginVertical:10,paddingHorizontal:20}}>
                        <Text style={{fontSize:18,fontWeight:"bold"}}>Lisence Plate</Text>
                        <TextInput placeholder="Example..BLHT281" 
                        value={lisencePlate} onChangeText={setLisencePlate}
                        style={{width:"100%",padding:8,borderWidth:1,borderRadius:10,fontSize:18}}/>
                    </View>

                    <View>
                        <View style={{marginVertical:10,paddingHorizontal:20}}>
                        <Text style={{fontSize:18,fontWeight:"bold"}}>Enter pickup Address </Text>
                            <TextInput placeholder="Enter street" 
                            value={pickupAddress} onChangeText={setPickupAddress}
                            style={{marginVertical:5,width:"100%",padding:8,borderWidth:1,borderRadius:10,fontSize:18}}/>
                            <TextInput placeholder="Enter city" 
                            value={pickupAddressCity} onChangeText={setPickupAddressCity}
                            style={{width:"100%",padding:8,borderWidth:1,borderRadius:10,fontSize:18}}/>
                            <TextInput placeholder="Enter Country" 
                            value={pickupAddressCountry} onChangeText={setPickupAddressCountry}
                            style={{marginVertical:5,width:"100%",padding:8,borderWidth:1,borderRadius:10,fontSize:18}}/>
                        </View>

                        <View style={{marginVertical:10,paddingHorizontal:20}}>
                            <Text style={{fontSize:18,fontWeight:"bold"}}>Rental Price</Text>
                            <TextInput placeholder="example...$250" 
                            value={rentalPrice} onChangeText={setrentalPrice}
                            style={{width:"100%",padding:8,borderWidth:1,borderRadius:10,fontSize:18}}/>
                        </View>

                        <Pressable onPress={addRenting} style={{alignSelf:"center",marginBottom:50,marginTop:20,padding:10,borderWidth:1,backgroundColor:"black",width:100,borderRadius:20,alignItems:"center"}}>
                            <Text style={{fontSize:30,color:"white"}}>Rent</Text>
                        </Pressable>

                    </View>
                        
                </ScrollView>            
            </View>

            
        </View>
    
  );
};

const styles = StyleSheet.create({
    picker: {
        height:200,
        width: 200,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: '#f9f9f9'
    },
})

export default ListingScreen