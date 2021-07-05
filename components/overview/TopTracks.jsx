import React, { Component } from "react";
import { ScrollView, Text, View, ImageBackground, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight } from "react-native-gesture-handler";

export default class TopTracks extends Component{

    constructor(props){
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            dataFetched:false
        };
        this.fetchData();
    }
    async fetchData(){
        let access_token = await AsyncStorage.getItem("access_token");
        
        let data = {
            method:"GET",
            headers:{
                "Authorization":"Bearer "+access_token
            }
          };

          let res = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term",data);
          res = await res.json();
          if (res.error){
            if (res.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (res.error.message === "Invalid access token"){
              console.log("Invalid access token");
            }
          }else{
            res = res.items;
            this.setState({
                artists:res,
                dataFetched:true
            });

          }
    }

    render(){
        if (this.state.dataFetched){
            return(
                <ScrollView horizontal={true}>
                    {this.state.artists.map((item,index) => {
                        return(
                            <TouchableHighlight onPress={() => {this.props.showScreen({screen:"artist",artist:{id:item.id}})}}>

                                <ImageBackground source={{uri:item.images.slice(-1)[0].url}} style={{padding:5,minWidth:125,maxWidth:200, height:125, margin:5, justifyContent:"space-between"}} imageStyle={{borderRadius:10, opacity:0.7}}>
                                    <Text style={{color:"white", fontSize:25, textShadowColor:"black", textShadowRadius:5, fontWeight:"bold"}}>#{index+1}</Text>
                                    <Text style={{color:"white", fontSize:25, textShadowColor:"black", textShadowRadius:5}}>{item.name}</Text>
                                </ImageBackground>

                            </TouchableHighlight>
                        )
                    })}
                </ScrollView>
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