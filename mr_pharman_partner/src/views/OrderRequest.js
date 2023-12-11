import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, api_url, delivery_boy_order_details, accept, reject, order_notification} from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import Loader from '../components/Loader';
import axios from 'axios'; 
import LottieView from 'lottie-react-native';

var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var whoosh = new Sound('uber.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

});

const OrderRequest = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [should_repeate, setShouldRepeat] = useState(true); 
  const [delay, setDelay] = useState(2);  
  const [order_id, setOrderId] = useState(route.params.order_id);
  const [order_items, setOrderItems] = useState([]);
  const [order_details, setOrderDetails] = useState("");

  useEffect( () => {
    get_order_detail();
    whoosh.play();
    whoosh.setNumberOfLoops(-1);
    const _unblur = navigation.addListener('blur', async () => {
      whoosh.stop();
    });
    return _unblur;
  },[]); 

  const get_order_detail = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_order_details,
      data:{ order_id:order_id }
    })
    .then(async response => {
      await setLoading(false);
      await setOrderDetails(response.data.result);
     // await setOrderItems(response.data.result.item_list)
    })
    .catch(error => {
      setLoading(false);
      alert(error)
    });
  }

  const navigate = () =>{
    whoosh.stop();
    navigation.navigate("Home")
  }

  const order_accept = async (id) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + accept,
      data:{ order_id:id, partner_id:global.id }
    })
    .then(async response => {
      await setLoading(false);
      navigate();
    })
    .catch(error => {
      setLoading(false);
      alert("Sorry something went wrong")
    });
  }

  const order_reject = async (id) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + reject,
      data:{ order_id:id, partner_id:global.id }
    })
    .then(async response => {
      await setLoading(false);
      navigate();
    })
    .catch(error => {
      setLoading(false);
      alert("Sorry something went wrong")
    });
  }  

  return(
		<View style={{ alignItems:'center', justifyContent:'center', flex:1, backgroundColor:colors.theme_bg }} >
      <Loader visible={loading} />
      <View style={{ height:150, width:150 }}>
          <Image source={require('.././assets/img/notification.png')} style={{ height:undefined, width:undefined, flex:1 }} />
      </View>
      <View style={{ margin:40 }} />
		  <Text style={{ fontSize:24, fontFamily:bold, color:colors.theme_fg_three }}>Hi, you get new order !!</Text>
      <View style={{ margin:40 }} />
      <View style={{ flexDirection:'row'}}>
        <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity onPress={order_accept.bind(this, order_id)} style={{ width:150, padding:10, borderWidth:1, borderColor:colors.theme_bg_three, borderRadius:5, alignItems:'center', justifyContent:'center', backgroundColor:colors.theme_bg_three}}>
                <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg }}>Accept</Text>
            </TouchableOpacity>
        </View>
        <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity  onPress={order_reject.bind(this, order_id)} style={{ width:150, padding:10, borderWidth:1, borderColor:colors.theme_bg_three, borderRadius:5, alignItems:'center', justifyContent:'center'}}>
                <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg_three }}>Ignore</Text>
            </TouchableOpacity>
        </View>
      </View>
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
});

export default OrderRequest;
