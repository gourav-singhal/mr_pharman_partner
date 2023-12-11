import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, delivery_boy_check_phone, api_url } from '../config/Constants';
import PhoneInput from 'react-native-phone-input';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';

const CheckPhone = () => {

  const navigation = useNavigation();
  const [validation,setValidation] = useState(false); 
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState('false');

  useEffect(() => {
    setTimeout(() => {
      phone_ref.current.focus();
    }, 200);
  },[]);

  const phone_validation = async() => {
    Keyboard.dismiss();
    if('+'+phone_ref.current.getCountryCode() == phone_ref.current.getValue()){
      await setValidation(false);
      alert('Please enter your phone number')
    }else if(!phone_ref.current.isValidNumber()){
      await setValidation(false);
      alert('Please enter valid phone number')
    }else{
      await setValidation(true);
      check_phone( phone_ref.current.getValue() )
    }
  }

  const check_phone = async(phone_with_code) => {
    console.log({ phone_with_code : phone_with_code})
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_check_phone,
      data:{ phone_with_code : phone_with_code}
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigation.navigate('Password',{ phone_with_code : phone_with_code, type: 1 })
      }else if(response.data.status == 2){
        alert(response.data.message)
      }else if(response.data.status == 0){
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('sorry something went wrong');
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <Loader visible={loading} />
        <View style={{ padding:20 }}>
          <View style={{ margin:20 }}/>
          <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Enter your phone number</Text>
          <View style={{ margin:2 }}/>
          <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>We will send you an one time password on this mobile number</Text>
          <View style={{ margin:10 }}/>
          <View style={styles.textFieldcontainer}>
            <PhoneInput ref={phone_ref} style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style}  initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "Enter your phone number", placeholderTextColor : colors.grey, color:colors.theme_fg_two, fontSize:14 }} autoFormat={true} />
          </View>
          <View style={{ margin:20 }}/>
          <TouchableOpacity activeOpacity={1}  onPress={phone_validation.bind(this)}  style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
          </TouchableOpacity>
          <View style={{ margin:10 }}/>
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
    height: 45
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
    color:colors.theme_fg_two,
    fontSize:14
  }
});

export default CheckPhone;