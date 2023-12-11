import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, api_url, delivery_boy_get_profile, delivery_boy_profile_update, delivery_boy_profile_picture, img_url } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImgToBase64 from 'react-native-image-base64';
import PhoneInput from 'react-native-phone-input';
import { connect } from 'react-redux'; 
import { updatePartnerProfilePicture } from '../actions/AuthFunctionActions';

const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  base64: true,
  quality:1, 
  maxWidth: 500, 
  maxHeight: 500,
};

const Profile = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false);
  const phone_ref = useRef(null); 
  const [delivery_boy_name, setDeliveryBoyName] = useState("");
  const [email, setEmail] = useState(""); 
  const [img_data,setImgData] = useState(""); 
  const [profile_image,setProfileImage] = useState("");
  const [phone_number, setPhoneNumber] = useState("");   
  const [profile_timer,setProfileTimer] = useState(true);

  const handleBackButtonClick= () => {
    navigation.goBack()
  } 

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      view_profile();
    });
    return unsubscribe;
  },[]);

  const profile_validation = async() =>{
    if(!delivery_boy_name || !email){
      alert('Please enter profile details.')
      await setValidation(false);
    }else{
      await setValidation(true);
      get_profile_update();
    }
  }

  const get_profile_update = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_profile_update,
      data:{ id: global.id, email:email, delivery_boy_name:delivery_boy_name }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        saveData(response.data)
      }else{
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('id', data.result.id.toString());
        await AsyncStorage.setItem('delivery_boy_name', data.result.delivery_boy_name.toString());
        await AsyncStorage.setItem('email', data.result.email.toString());
        await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
        await AsyncStorage.setItem('profile_picture', data.result.profile_picture.toString());
        
        global.id = await data.result.id.toString();
        global.delivery_boy_name = await data.result.delivery_boy_name.toString();
        await props.updatePartnerProfilePicture(data.result.profile_picture.toString());
        global.email = await data.result.email.toString();
        global.phone_number = await data.result.phone_number.toString();
        
        await handleBackButtonClick();
      }catch (e) {
        alert(e);
    }
  }

  const select_photo = async () => {
    if(profile_timer){
      ImagePicker.launchImageLibrary(options, async(response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const source =  await response.assets[0].uri;
            await setImgData(response.data)
            await ImgToBase64.getBase64String(response.assets[0].uri)
          .then(async base64String => {
            await profileimageupdate(base64String);
            await setProfileImage(response.assets[0].uri);
          }
            )
          .catch(err => console.log(err));
        }
      });
    }else{
      alert('Please try after 20 seconds');
    }
  }

  const profileimageupdate = async(img_data) =>{
    await setLoading(true);
    RNFetchBlob.fetch('POST', api_url + delivery_boy_profile_picture, {
      'Content-Type' : 'multipart/form-data',
    }, [
      {  
        name : 'image',
        filename : 'image.png', 
        data: img_data
      }
    ]).then(async (resp) => { 
      console.log(resp)
      await setLoading(false);
      let data = await JSON.parse(resp.data);
      if(data.result){
        await profile_image_update(data.result);
        await setProfileTimer(false);
        await setTimeout(function(){setProfileTimer(true)}, 20000)
      }
    }).catch((err) => {
        setLoading(false);
        console.log(err)
        alert('Error on while upload try again later.')
    })
  }

  const profile_image_update = async (data) => {
    setLoading(true);
      await axios({
        method: 'post', 
        url: api_url+delivery_boy_profile_update,
        data: {id:global.id, profile_picture:data}
      })
      .then(async response => {
        setLoading(false);
        console.log(response)
        if(response.data.status == 1){
          alert("Update Successfully")
          saveProfilePicture(data);
        }else{
          alert(response.data.message)
        }
      })
      .catch(error => {
          setLoading(false);
          alert("Sorry something went wrong")
      });
  }

  const saveProfilePicture = async(data) =>{
    try{
        await AsyncStorage.setItem('profile_picture', data.toString());
        view_profile();
        await props.updatePartnerProfilePicture(data.toString());
      }catch (e) {
        alert(e);
    }
  }

  const view_profile = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_get_profile,
      data:{ id: global.id }
    })
    .then(async response => {
      setLoading(false);
      setEmail(response.data.result.email);
      setDeliveryBoyName(response.data.result.delivery_boy_name);
      setPhoneNumber(response.data.result.phone_number);
      props.updatePartnerProfilePicture(response.data.result.profile_picture);

    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const change_password = () =>{
    navigation.navigate("ResetPassword", {from:"profile", id:global.id})
  }

  return( 
  <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      <Loader visible={loading} />
      <TouchableOpacity onPress={select_photo.bind(this)} style={styles.box}>
        <View style={styles.profile} >
          <Image style= {{ height: undefined,width: undefined, flex:1, borderRadius:50 }} source={{ uri : img_url + props.partner_profile_picture}} />
        </View>
      </TouchableOpacity>
      <View style={{ padding:20 }}>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Name"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setDeliveryBoyName(text)}
            value={delivery_boy_name}
          />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <PhoneInput ref={phone_ref} style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style} initialValue={global.phone_with_code} disabled={true} initialCountry="lb" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "", placeholderTextColor : colors.grey }} autoFormat={true} />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Email"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setEmail(text)}
            value={email}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity activeOpacity={1} onPress={profile_validation.bind(this)}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <TouchableOpacity activeOpacity={1} onPress={change_password} style={styles.password_button}>
          <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14}}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
    fontSize:14,
    color:colors.theme_fg_two
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.theme_fg_two
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.theme_fg_two
  },
  box:{
    left:(Dimensions.get('window').width / 2) - 50,
    borderColor:colors.theme_fg,
    borderWidth:1,
    width: 100,
    height: 100,
    borderRadius: 50
  },
  profile:{
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  password_button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    borderWidth:1
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

export default connect(mapStateToProps,mapDispatchToProps)(Profile);
