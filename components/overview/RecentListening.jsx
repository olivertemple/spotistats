import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class RecentListening extends Component{
    constructor(props){
        super(props)
        this.state = {
            name:"",
            imageUrl:"",
            artists:"",
            album:"",
            dataFetched:false
        }
        this.fetchData = this.fetchData.bind(this);
        this.fetchData();
    }
    async fetchData(){
        let access_token = await AsyncStorage.getItem("access_token");
        
        let data = {
            method:"GET",
            headers:{
                "Authorization":"Bearer "+access_token
            }
          }
          //let res = await fetch("https://api.spotify.com/v1/me/playlists",data)
          let res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1",data)
          res = await res.json();
          if (res.error){
            if (res.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (res.error.message === "Invalid access token"){
              console.log("Invalid access token")
            }
          }else{
            let info = res.items[0].track
            this.props.getSongId(info.id)
            let artists = ""
            for (let i = 0; i < info.artists.length; i++){
                if (i == 0){
                    artists += (info.artists[i].name)
                }else{
                    artists += (", "+info.artists[i].name)
                }
            }
            this.setState({name:info.name, artists:artists, album:info.album.name, imageUrl:info.album.images[0].url, dataFetched:true})
            window.setTimeout(() => {
                this.fetchData()
            }, (info.duration_ms))
            
          }
    }
    render(){
        if (this.state.dataFetched){
            return(
                <View style={styles.container}>
                    <Text style={[styles.GeneralText, {fontSize:25}]}>Recent Listening</Text>
                    <View style={{display:"flex",flexDirection:"row", padding:5}}>
                        <Image source={{ uri:this.state.imageUrl }} style={{width:100,height:100, borderRadius:10}}></Image>
                        <View style={{marginLeft:10, display:"flex", justifyContent:"space-evenly", width:"75%"}}>
                            <View>
                                <Text style={[styles.GeneralText, {fontSize:25, fontWeight:"bold"}]}>{this.state.name}</Text>
                                <Text style={[styles.GeneralText, {fontSize:15}]}>{this.state.artists}</Text>
                            </View>
                            <Text style={[styles.GeneralText, {fontSize:15}]}>{this.state.album}</Text>
                        </View>
                    </View>
                </View>
            )
        }else{
            return(
                <View style={{height:"100%", justifyContent:"center"}}>
                    <ActivityIndicator size="large" color="#1DB954"></ActivityIndicator>
                </View>
            )
        }
       
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"rgb(20,20,20)",
        borderRadius:10,
        padding:5
    },
    GeneralText:{
        color:"white"
    }
})