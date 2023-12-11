import React, { useState, useEffect }  from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold, api_url, delivery_boy_login, delivery_boy_forget_password, terms_and_conditions, delivery_boy_privacy_policy } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePartnerProfilePicture } from '../actions/AuthFunctionActions';
import { connect } from 'react-redux'; 
import Modal from "react-native-modal";

const Password = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [validation,setValidation] = useState(false); 
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false); 
  const [isPrivacyPolicyModalVisible, setIsPrivacyPolicyModalVisible] = useState(false); 
  const [privacy_result, setPrivacyResult] = useState([]);
  const [termsandconditions, setTermsAndConditions] = useState([]);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }  

  const login_validation = async() =>{
    if(password == ""){
      alert('Please enter Password.')
      await setValidation(false);
    }else{
      await setValidation(true);
      login();
    }
  }

  const login = async() => {
    console.log({ phone_with_code: phone_with_code_value , fcm_token: global.fcm_token, password: password })
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_login,
      data:{ phone_with_code: phone_with_code_value , fcm_token: global.fcm_token, password: password }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        saveData(response.data)
      }else{
        alert('Please enter correct Password')
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('id', data.result.id.toString());
        await AsyncStorage.setItem('delivery_boy_name', data.result.delivery_boy_name.toString());
        await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        await AsyncStorage.setItem('email', data.result.email.toString());
        await AsyncStorage.setItem('profile_picture', data.result.profile_picture.toString());
        
        global.id = await data.result.id.toString();
        global.phone_number = await data.result.phone_number.toString();
        global.phone_with_code = await data.result.phone_with_code.toString();
        global.email = await data.result.email.toString();
        global.delivery_boy_name = await data.result.delivery_boy_name.toString();
        await props.updatePartnerProfilePicture(data.result.profile_picture.toString());

        await home();
      }catch (e) {
        alert(e);
    }
  }

  const home = async() => {
    navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

  const forgot_password = async() =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_forget_password,
      data:{ phone_with_code: phone_with_code_value }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigation.navigate('Otp',{ data : response.data.result.otp, id : response.data.result.id })
      }else{
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  useEffect(() => {
    get_privacy(); 
    get_terms_and_conditions();
  },[]);

  const terms_toggleModal = () => {
    setIsTermsModalVisible(true);
  };

  const privacy_policy_toggleModal = () => {
    setIsPrivacyPolicyModalVisible(true);
  };

  const terms_open_dialog = () =>{
    setIsTermsModalVisible(false);
  }

  const privacy_policy_open_dialog = () =>{
    setIsPrivacyPolicyModalVisible(false);
  }

  const get_privacy = async() => {
    setLoading(true);
    axios({
    method: 'post', 
    url: api_url + delivery_boy_privacy_policy,
    data:{ user_type:global.user_type}
    })
    .then(async response => {
      setLoading(false);
      setPrivacyResult(response.data.result)
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  } 

  const get_terms_and_conditions = async() => {
    setLoading(true);
    axios({
    method: 'post', 
    url: api_url + terms_and_conditions,
    data:{user_type:1},
    })
    .then(async response => {
      setLoading(false);
      setTermsAndConditions(response.data.result);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const renderItem = ({ item }) => (
    <View>
      <View style={{ justifyContent:'center', alignItems:'flex-start', padding:10,}}>
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>{item.title}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>{item.description}</Text>
      </View>
    </View>
  );

  const privacy_policy_renderItem = ({ item }) => (
    <View>
      <View style={{ justifyContent:'center', alignItems:'flex-start', padding:10,}}>
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>{item.title}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>{item.description}</Text>
      </View>
    </View>
  );

  return( 
  <SafeAreaView style={styles.container}>
    <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
    <Loader visible={loading} />
      <View>
        <TouchableOpacity onPress={handleBackButtonClick} style={{width:'10%'}} >
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Welcome to {app_name}</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Please enter your password to access your account</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Password"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={{marginTop:"10%"}} />
          <View style={{ alignItems:'flex-start', }}>
            <Text style={{ fontFamily:regular, color:colors.theme_fg_two, fontSize:12 }}>By clicking the Sign Up I agree that I have read and accepted the <Text onPress={terms_toggleModal} style={{ fontFamily:bold, color:'blue', fontSize:12 }}>Terms of Use</Text>, <Text onPress={privacy_policy_toggleModal} style={{ fontFamily:bold, color:'blue', fontSize:12 }}>Privacy Policy</Text>.</Text>
          </View>
          <View style={{marginTop:"10%"}} />
        <TouchableOpacity onPress={login_validation} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold}}>Ready to Delivery</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <TouchableOpacity activeOpacity={1} onPress={forgot_password}>
          <Text style={{ color:colors.theme_fg, fontFamily:regular, alignSelf:'center'}}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    <Modal 
          isVisible={isTermsModalVisible}
          onBackButtonPress={terms_toggleModal}
          style={{ backgroundColor:colors.theme_bg_three }}
        >
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View style={{ margin:10 }} />
              <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two, alignSelf:'center'}}>Terms of Use</Text>
              <View style={{ padding:20 }}>
                <FlatList
                  data={termsandconditions}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                />
              </View>
              <View style={{ margin:10 }} />
              <TouchableOpacity activeOpacity={1} onPress={terms_open_dialog.bind(this)} style={{ width:150, backgroundColor:colors.green, alignItems:'center', justifyContent:'center', borderRadius:5, height:40, alignSelf:'center'}}>
                <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_three}}>Okay</Text>
              </TouchableOpacity>
            </View>
            <View style={{ margin:10 }} />
          </ScrollView>
        </Modal>

        <Modal 
          isVisible={isPrivacyPolicyModalVisible}
          onBackButtonPress={privacy_policy_toggleModal}
          style={{ backgroundColor:colors.theme_bg_three }}
        >
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View style={{ margin:10 }} />
              <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two, alignSelf:'center'}}>Privacy Policy</Text>
              <View style={{ padding:20 }}>
                <FlatList
                  data={privacy_result}
                  renderItem={privacy_policy_renderItem}
                  keyExtractor={item => item.id}
                />
              </View>
              <View style={{ margin:10 }} />
              <TouchableOpacity activeOpacity={1} onPress={privacy_policy_open_dialog.bind(this)} style={{ width:150, backgroundColor:colors.green, alignItems:'center', justifyContent:'center', borderRadius:5, height:40, alignSelf:'center'}}>
                <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_three}}>Okay</Text>
              </TouchableOpacity>
            </View>
            <View style={{ margin:10 }} />
          </ScrollView>
        </Modal>
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
});

function mapStateToProps(state){
  return{
    partner_profile_picture : state.auth_function.partner_profile_picture
  };
}

const mapDispatchToProps = (dispatch) => ({
  updatePartnerProfilePicture: (data) => dispatch(updatePartnerProfilePicture(data))

});

export default connect(mapStateToProps,mapDispatchToProps)(Password);
