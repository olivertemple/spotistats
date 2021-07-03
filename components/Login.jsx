import React, { Component } from "react";
import { StyleSheet, Text, View, Linking } from 'react-native';
import Button from "./Button"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component{

    async componentDidUpdate(){
        let url = await Linking.getInitialURL();
        if (url.includes("code")){
            let code = url.split("?code=")[1]
            if (code){
                await AsyncStorage.setItem("code", code);
                await this.props.loggedIn(code)
                Linking.openURL(this.props.url)
            }else{
                let error = url.split("?error=")[1];
                if (error == "access_denied"){
                    alert("access to spotify is needed for this application to work")
                }else{
                    alert("an unknown error occurred, please try again")
                }
            }
        }
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor:"black", justifyContent:"space-between", padding:10}}>
                <View style={styles.welcome}>
                    <Text style={[styles.generalText, {marginTop:10}]}>
                        <Text>Welcome to </Text>
                        <Text style={styles.greenText}>SpotiStats</Text>
                        <Text>.</Text>
                    </Text>
                    <Text style={styles.generalText}>
                        <Text>Your </Text>
                        <Text style={styles.greenText}>music</Text>
                        <Text>, visualized.</Text>
                    </Text>
                </View>
                <View style={styles.prompt}>
                    <Text style={styles.generalText}>Log In With Your Spotify Account to Continue</Text>
                </View>
                <Button title="login" color="#1DB954" click={this.props.login}></Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    greenText:{
        color:"#1DB954",
        fontSize:25
    },
    generalText:{
        fontSize:25,
        textAlign:"center",
        color:"white"
    },
    welcome:{
        alignItems:"center"
    },
    prompt:{
        alignItems:"center",
        justifyContent:"center"
    }
})