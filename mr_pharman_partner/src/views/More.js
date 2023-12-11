import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, img_url, api_url, delivery_boy_change_online_status } from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux'; 
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePartnerProfilePicture } from '../actions/AuthFunctionActions';
import axios from 'axios';
import Loader from '../components/Loader';

const More = (props) => {

  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const next = (name) => {
    if(name == 'Notifications'){
      navigation.navigate("Notifications")
    }else if(name == 'FAQ Categories'){
      navigation.navigate("FaqCategories")
    }else if(name == 'Privacy Policies'){
      navigation.navigate("PrivacyPolicy")
    }else if(name == 'Logout'){
      showDialog();
    }else if(name == 'Help'){
      showSnackbar('Not Active')
    }
  }

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleLogout = async() => {
    setVisible(false);
    online_status();
  };

  const online_status = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + delivery_boy_change_online_status,
      data:{ id:global.id, online_status:0 }
    })
    .then(async response => {
      setLoading(false);
      navigate();
    })
    .catch(error => {
      alert('Sorry something went wrong')
      setLoading(false);
    });
  }

  const navigate = async() =>{
    await AsyncStorage.clear();
    global.online_status=0
    navigation.dispatch(
      CommonActions.reset({
          index: 0,
          routes: [{ name: "CheckPhone" }],
      })
    );
  }
 
  const DATA = [
    {
      id:1,
     title: 'Notifications',
      icon:'notifications-outline'
    },
    {
      id:2,
     title: 'FAQ Categories',
      icon:'alert-circle-outline'
    },
    {
      id:3,
      title: 'Privacy Policies',
      icon:'finger-print-outline'
    },
    {
      id:4,
      title: 'Logout',
      icon:'log-out-outline'
    },
    
  ];

  const profile = () => {
    navigation.navigate("Profile")
  }

  const renderItem = ({ item }) => (
  <TouchableOpacity onPress={next.bind(this,item.title)}>
    <Dialog.Container contentStyle={{backgroundColor:colors.theme_bg_three}} visible={visible}>
      <Dialog.Title style={{fontFamily: bold, color:colors.theme_fg_two, fontSize:18}}>Confirm Logout</Dialog.Title>
      <Dialog.Description style={{fontFamily: regular, color:colors.theme_fg_two, fontSize:16}}>
        Do you want to logout?
      </Dialog.Description>
      <Dialog.Button style={{color:colors.theme_fg_two, fontSize:14}} label="Yes" onPress={handleLogout} />
      <Dialog.Button style={{color:colors.theme_fg_two, fontSize:14}} label="No" onPress={handleCancel} />
    </Dialog.Container>
    <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
      <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
        <Icon type={Icons.Ionicons} name={item.icon} color={colors.regular_grey} style={{ fontSize:20 }} />
      </View>  
      <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
        <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.title}</Text>
      </View>
      <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
        <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
      </View>  
    </View>
  </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
        <View style={{ margin:5}} />
        <View style={styles.header}>
          <View style={{ width:'100%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Settings</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <TouchableOpacity activeOpacity={1} onPress={profile}>
          <CardView
            cardElevation={5}
            style={{ paddingLeft:10, paddingRight:10, marginLeft:5, marginRight:5, backgroundColor:colors.theme_bg_three }}
            cardMaxElevation={5}
            cornerRadius={10}>
            <View style={{ flexDirection:'row', paddingTop:15, paddingBottom:15,}}>
              <View style={{ width:'20%',justifyContent:'center', alignItems:'flex-start' }}>
                <Image style={{ height: 50, width: 50, borderRadius:50 }} source={{uri: img_url + props.partner_profile_picture}} />
              </View>  
              <View style={{ width:'75%', justifyContent:'center', alignItems:'flex-start'}}>
                <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two}}>{global.delivery_boy_name}</Text>
              <View style={{ margin:2 }} />
                <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>Edit Profile</Text>   
              </View>
              <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
                <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
              </View>  
            </View>
          </CardView>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
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

export default connect(mapStateToProps,mapDispatchToProps)(More);
