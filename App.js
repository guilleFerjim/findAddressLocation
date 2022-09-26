import * as React from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { useEffect } from 'react';

export default function App() {

  const [location, setLocation] = React.useState(null);
  const [latitude, setLatitude] = React.useState(null);
  const [longitude, setLongitude] = React.useState(null);
  const [notNull, setNotNull] = React.useState(false);
  
  useEffect(() => {  
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {      
        Alert.alert('No permission to get location')
        return;    
      }
      let location = await Location.getCurrentPositionAsync({});    
      if (location !== null){
        setLocation(location); 
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        setNotNull(true);
      }
    })();
  }, []);

  useEffect(() => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=NEPK9E6d2hxLI6RBqSA9LRngB9RdOACA&location=${keyword}`)  
    .then(response => response.json())
    .then(data => setLocation(data))
    .catch(error => {
      Alert.alert('Error', error);
    });
  }, [location])

  const findLocation = () => {
    var latitude = location.results[0].locations[0].latLng.lat;
    var longitude = location.results[0].locations[0].latLng.lng;
    setLongitude(longitude);
    setLatitude(latitude);
    mapRef.current.animateToRegion({ latitude, longitude, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
  }

  return (
    <View style={styles.container}>
      {notNull && <MapView  style={styles.map}  
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,  
          }}
      >
        <Marker 
          coordinate={{
            latitude: latitude, 
            longitude: longitude
          }} 
        />
      </MapView>
      }
    <View style={{marginBottom: 60}}>
        <TextInput
          style={styles.input} 
          onChangeText={(text) => setKeyword(text)}
          value={keyword}
        />
        <Button
          title='FIND'
          onPress={findLocation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
