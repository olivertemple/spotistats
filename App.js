import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { StyleSheet, View, Linking, Platform} from 'react-native';
import Login from "./components/Login"
import Spotistats from './Spotistats';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from "base-64"
export default class App extends Component {
  constructor(props){
    //!rgb(18,18,18)
    super(props);
    this.state = {
      loggedin:false
    }
    this.login = this.login.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.refresh = this.refresh.bind(this);

    this.RedirectUrl = "com.spotistats://auth/";
    this.url = "com.spotistats://"

    /*
    if (Platform.OS === "android"){
      //this.RedirectUrl = "exp://172.16.3.104:19000/auth/"
      //this.url = "exp://172.16.3.104:19000/"
      this.RedirectUrl = "exp://192.168.1.117:19000/auth/"
      this.url = "exp://192.168.1.117:19000/"
    }else{
      this.RedirectUrl = "http://127.0.0.1:19006/auth/"
      this.url = "http://127.0.0.1:19006/"
    }    */
  }

  componentDidMount(){
    this.getCodeFromStorage()
  }

  async getCodeFromStorage(){
    const code = await AsyncStorage.getItem("code");
    if (code!==null){
      this.setState({
        loggedin:true
      })
      this.code = code;
    }else{
      this.setState({
        loggedin:false
      })
    }
  }
  login(){
    //Linking.openURL("https://accounts.spotify.com/authorize?client_id=034aecf762cf4795a294c19c1e08c9e7&response_type=code&redirect_uri=com.spotistats://auth/&scope=playlist-read-private").then(() => {Linking.getInitialURL().then(res => alert(res))})
    Linking.openURL("https://accounts.spotify.com/authorize?client_id=034aecf762cf4795a294c19c1e08c9e7&response_type=code&redirect_uri="+this.RedirectUrl+"&scope=playlist-read-private,user-library-read,user-read-recently-played,user-top-read,user-library-modify,playlist-modify-public,playlist-modify-private")
    //Linking.openURL("https://accounts.spotify.com/authorize?client_id=034aecf762cf4795a294c19c1e08c9e7&response_type=code&redirect_uri=exp://192.168.1.117:19000/auth/&scope=playlist-read-private")        
  }
  async getTokens(code){
    let data = {
      method:"POST",
      headers:{
        'Authorization': "Basic "+encode("034aecf762cf4795a294c19c1e08c9e7:fe27ece9c68f4bffa478ba00efb7a9ae"),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "grant_type=authorization_code&code="+code+"&redirect_uri="+this.RedirectUrl
    }
    let result = await fetch("https://accounts.spotify.com/api/token", data)
    result = await result.json()
    await AsyncStorage.setItem("access_token", result.access_token)
    await AsyncStorage.setItem("refresh_token", result.refresh_token)
  }
  async loggedIn(code){
    this.setState({
      loggedin:true
    })
    await this.getTokens(code)
    
  }

  async refresh(){
    let refresh_token = await AsyncStorage.getItem("refresh_token")
    let data = {
      method:"POST",
      headers:{
        'Authorization': "Basic "+encode("034aecf762cf4795a294c19c1e08c9e7:fe27ece9c68f4bffa478ba00efb7a9ae"),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "grant_type=refresh_token&refresh_token="+refresh_token
    }
    let result = await fetch("https://accounts.spotify.com/api/token", data)
    result = await result.json()
    await AsyncStorage.setItem("access_token", result.access_token)
  }

  render(){
    return (
      <View style={styles.container}>
        <StatusBar style="auto"></StatusBar>
        {!this.state.loggedin ? <Login loggedIn={this.loggedIn} login={this.login} url={this.url}></Login> : <Spotistats refresh={this.refresh}></Spotistats>}   
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:Constants.statusBarHeight,
    backgroundColor:"black"
  },
});
