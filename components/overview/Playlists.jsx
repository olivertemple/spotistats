import React, { Component } from "react";
import { ScrollView, Text, View, Image, Dimensions, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight } from "react-native-gesture-handler";

export default class TopTracks extends Component{

    constructor(props){
        super(props)
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            dataFetched:false
        }
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

          let res = await fetch("https://api.spotify.com/v1/me/playlists",data)
          res = await res.json();
          res = res.items
          if (res.error){
            if (res.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (res.error.message === "Invalid access token"){
              console.log("Invalid access token")
            }
          }else{
            this.setState({
                artists:res,
                dataFetched:true
            })

          }
    }

    render(){
        if (this.state.dataFetched){
            return(
                <ScrollView horizontal={true}>
                    {this.state.artists.map((item) => {
                        if (item.name.length > 25){
                            item.name = item.name.slice(0,20)+"..."
                        }
                        return(
                            <TouchableHighlight onPress={() => {this.props.showScreen({screen:"playlist",playlist:{id:item.id}})}}>
                            <View style={{flexDirection:"row", maxWidth:(Dimensions.get("window").width)*0.6, backgroundColor:"rgb(20,20,20)", marginRight:10, borderRadius:10}}>
                                <Image source={{ uri:item.images.slice(-1)[0].url }} style={{width:100, height:100, borderRadius:10}}></Image>
                                <View style={{padding:10, justifyContent:"space-between", flexWrap:"wrap"}}>
                                    <View>
                                        <Text style={{color:"white", fontSize:15, maxWidth:Dimensions.get("window").width*0.6 - 120, minWidth:Dimensions.get("window").width*0.2, fontWeight:"bold"}}>{item.name}</Text>
                                        <Text style={{color:"white", fontSize:10}}>{item.owner.display_name}</Text>
                                    </View>
                                    <Text style={{color:"white"}}>{item.public ? "public" : "private"}</Text>
                                </View>
                            </View>
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