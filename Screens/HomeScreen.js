import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListingScreen from './ListingScreen';
import BookingScreen from './BookingScreen';
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 


const Tab = createBottomTabNavigator()

const HomeScreen = () => {
  return (
      <Tab.Navigator screenOptions={() => ({
      "tabBarActiveTintColor" : "red",
      "tabBarInactiveTintColor" : "black",
      "tabBarStyle" : [{"display": "flex"}, null]
      })}>
        <Tab.Screen component={ListingScreen} name="Listing" options={{
            tabBarIcon: ({ color }) => (
              <AntDesign name="car" size={24} color={color} />
            ),
          }}/>
        <Tab.Screen component={BookingScreen} name="Booking" options={{
            tabBarIcon: ({ color }) => (
              <Feather name="bookmark" size={24} color={color} />
            ),
          }}/>
      </Tab.Navigator>  
  )
}

export default HomeScreen