import React, { useState, useEffect} from 'react';
import { StyleSheet, Image,  View, SafeAreaView, Text,  ScrollView, TouchableOpacity, Switch, PermissionsAndroid } from 'react-native';
import * as colors from '../assets/css/Colors';""
import Icon, { Icons } from '../components/Icons'
import { bold, home_banner, delivery_boy_dashboard, delivery_boy_change_online_status, api_url, img_url, app_name, LATITUDE_DELTA, LONGITUDE_DELTA } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import CardView from 'react-native-cardview'
import Loader from '../components/Loader';
import axios from 'axios';
import { connect } from 'react-redux'; 
import { updatePartnerProfilePicture } from '../actions/AuthFunctionActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FusedLocation from 'react-native-fused-location';
import database from '@react-native-firebase/database';

const Home = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(false);
  const [lng, setLng] = useState(false);
  const [switch_value, setSwitchValue] = useState(true);
  const [dashboard_value, setDashboardValue] = useState("");

  useEffect(() => {
    const onValueChange = database()
    .ref(`/delivery_partners/${global.id}`)
    .on('value', snapshot => {
      if(snapshot.val().on_stat == 1 && snapshot.val().o_stat == 1){
        sync(snapshot.val().o_id);
      }
    });
    if(global.online_status == 1){
      setSwitchValue(true);
    }else{
      setSwitchValue(false)
    }
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_location();
      await dashboard(); 
    });
    return unsubscribe;
  },[]);

  const sync = (order_id) =>{
    navigation.navigate("OrderRequest",{order_id:order_id});
  }

  const toggleSwitch = async(value) => {
    if(value){
      await setSwitchValue(value);  
      await online_status(1);
      await saveData(1);
    }else{
      await setSwitchValue( value );  
      await online_status(0);
      await saveData(0);
    }  
  }

  const online_status = async (status) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_change_online_status,
      data:{ id: global.id, online_status : status }
    })
    .then(async response => {
      setLoading(false);
    })
    .catch(error => {
      alert('Sorry something went wrong')
      setLoading(false);
    });
  }

  const saveData = async(status) =>{
    try{
        await AsyncStorage.setItem('online_status', status.toString());
        global.online_status = await status.toString();
      }catch (e) {
    }
  }

  const dashboard = async() =>{
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_dashboard,
      data:{ id:global.id }
    })
    .then(async response => {
      setDashboardValue(response.data.result);
    })
    .catch(error => {
      alert('Sorry something went wrong')
    });
  }

  const get_location = async() =>{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location Access Required',
          message: app_name+' needs to Access your location for tracking'
          }
      );
      if (granted) {
        FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
 
        // Get location once.
        const location = await FusedLocation.getFusedLocation();
        await setLat(location.latitude);
        await setLng(location.longitude);
 
        // Set options.
        FusedLocation.setLocationPriority(FusedLocation.Constants.BALANCED);
        FusedLocation.setLocationInterval(5000);
        FusedLocation.setFastestLocationInterval(5000);
        FusedLocation.setSmallestDisplacement(10);
 
       
        // Keep getting updated location.
        FusedLocation.startLocationUpdates();
 
        // Place listeners.
        const subscription = FusedLocation.on('fusedLocation', location => {
        
           let region = {
              latitude:       location.latitude,
              longitude:      location.longitude,
              latitudeDelta:  LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }

            let marker = {
              latitude:       location.latitude,
              longitude:      location.longitude,
            }

            let lat =  location.latitude;
            let lng =  location.longitude;

            database().ref('/delivery_partners/'+global.id).update({
              lat: lat,
              lng: lng,
              bearing : location.bearing
            });

        });
      }
  }
  
  const move_profile = () =>{
    navigation.navigate('Profile');
  }
  
  return (
  <SafeAreaView style={styles.container}>
    <Loader visible={loading} />
    <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}>
      <View style={{ margin:10 }} />
      <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
        <View style={{ width:'50%',justifyContent:'center', alignItems:'flex-start', }}>
          <TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: colors.theme_bg }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={switch_value}
            />
          </TouchableOpacity>
        </View>
        <View  style={{ width:'50%',justifyContent:'center', alignItems:'flex-end' }}>
          <TouchableOpacity onPress={move_profile.bind(this)} style={{ width: 40, height:40, borderWidth:1, borderRadius:30, borderColor:colors.light_grey }}>
            <Image style= {{ height: undefined, width: undefined, flex: 1, borderRadius:30 }} source={{uri: img_url + props.partner_profile_picture}} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ margin:10 }} />
      <Text style={{ fontSize:24, fontFamily:bold, color:colors.theme_fg_two,  letterSpacing:0.5 }}>Hello Mr.{global.delivery_boy_name},</Text>
      <View style={{ width:'100%', height:190}} >
        <Image style= {{ height: undefined,width: undefined,flex: 1, borderRadius:10 }} source={home_banner} />
      </View>
      <View style={{ margin:15 }} />
      <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_two }}>Your Reports</Text>
      <View style={{ margin:10 }} />
      <View style={{ flexDirection:'row'}}>
        <View style={{ width:'50%', padding:5}}>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={10}>
            <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#b394e9', height:270, }}>
              <Icon type={Icons.Ionicons} name="list-circle"  style={{ fontSize:40, fontFamily:bold, color:colors.theme_fg_three }} />
              <View style={{ margin:10 }} />
              <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                  {dashboard_value.total_bookings}
              </Text>
              <View style={{ margin:10 }} />
              <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>
                  Total Bookings
              </Text>
            </View>
          </CardView>
        </View>
        <View style={{ width:'50%', padding:5, }}>
          <CardView
            cardElevation={4}
            style={{ margin:5}}
            cardMaxElevation={4}
            cornerRadius={10}>
            <View style={{ padding:5, alignItems:'center', justifyContent:'center', backgroundColor:'#94b2e9', height:80, }}>
              <Icon type={Icons.Ionicons} name="ios-today"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg_three }} />
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg_three }}>
                  {dashboard_value.today_bookings}
              </Text>
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:12, fontFamily:bold, color:colors.theme_fg_three }}>
                  Today Bookings
              </Text>
            </View>
          </CardView>
          <CardView
            cardElevation={4}
            style={{ margin:5}}
            cardMaxElevation={4}
            cornerRadius={10}>
            <View style={{ padding:5, alignItems:'center', justifyContent:'center', backgroundColor:'#e9949a', height:80, }}>
              <Icon type={Icons.MaterialIcons} name="pending"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg_three }} />
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg_three }}>
                  {dashboard_value.pending_bookings}
              </Text>
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:12, fontFamily:bold, color:colors.theme_fg_three }}>
                  Pending 
              </Text>
            </View>
          </CardView>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            style={{ margin:5}}
            cornerRadius={10}>
            <View style={{ padding:5, alignItems:'center', justifyContent:'center', backgroundColor:'#e994c5', height:80, }}>
              <Icon type={Icons.FontAwesome} name="check-circle"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg_three }} />
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg_three }}>
                  {dashboard_value.completed_bookings}
              </Text>
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:12, fontFamily:bold, color:colors.theme_fg_three }}>
                  Completed
              </Text>
            </View>
          </CardView>
        </View>
      </View> 
      <View style={{ margin:50 }} />
    </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function mapStateToProps(state){
  return{
    partner_profile_picture : state.auth_function.partner_profile_picture,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updatePartnerProfilePicture: (data) => dispatch(updatePartnerProfilePicture(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Home);