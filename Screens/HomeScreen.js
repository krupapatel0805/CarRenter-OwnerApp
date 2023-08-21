import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from './SearchScreen';
import ReservationDetails from './ReservationDetails';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()

const HomeScreen = () => {
  return (
      <Tab.Navigator screenOptions={() => ({
      "tabBarActiveTintColor" : "red",
      "tabBarInactiveTintColor" : "black",
      "tabBarStyle" : [{"display": "flex"}, null]
      })}>
        <Tab.Screen component={SearchScreen} name="Search" 
        options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome name="search" size={20} color={color} />
            ),
          }}/>
        <Tab.Screen component={ReservationDetails} name="Reservations"
        options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome name="calendar" color={color} size={20} />
            ),
          }}/>
      </Tab.Navigator>  
  )
}

export default HomeScreen