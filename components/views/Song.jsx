import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, ScrollView, TouchableHighlight, BackHandler, ActivityIndicator } from 'react-native';
import AudioFeatures from "./components/AudioFeatures";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Back = require("../../assets/left-arrow.png")
export default class Song extends Component{
    constructor(props){
        super(props)
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            imageUrl:"https://emby.media/community/uploads/inline/355992/5c1cc71abf1ee_genericcoverart.jpg",
            name:"",
            artists:"",
            album:"",
            features:{},
            dataFetched:false
        }
        this.fetchData()
        BackHandler.addEventListener("hardwareBackPress", this.props.back)


    }

    async fetchData(){
        let access_token = await AsyncStorage.getItem("access_token");
        let data = {
            method:"GET",
            headers:{
                "Authorization":"Bearer "+access_token
            }
          }
          let res = await fetch("https://api.spotify.com/v1/tracks?ids="+this.props.id,data)
          res = await res.json();
          if (res.error){
            if (res.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (res.error.message === "Invalid access token"){
              console.log("Invalid access token")
            }
          }else{
                let info = res.tracks[0];

                let features = await fetch("https://api.spotify.com/v1/audio-features?ids="+this.props.id, data);
                features = await features.json();
                features = features.audio_features[0]
                for (let i = 0; i < info.artists.length; i++){
                    let key = Object.keys(info.artists)[i];
                    let artistInfo = await fetch("https://api.spotify.com/v1/artists?ids="+info.artists[key].id, data)
                    artistInfo = await artistInfo.json();
                    info.artists[Object.keys(info.artists)[i]].image = artistInfo.artists[0].images[0]
                }

                this.setState({
                    name:info.name,
                    album:{name:info.album.name, id:info.album.id},
                    imageUrl:info.album.images[0].url,
                    artists:info.artists,
                    popularity:info.popularity,
                    length:info.duration_ms,
                    features:{
                        valence:features.valence,
                        popularity:(info.popularity/100),
                        energetic:features.energy,
                        danceable:features.danceability,
                        acoustic:features.acousticness,
                        lively:features.liveness,
                        speechful:features.speechiness,
                        instrumental:features.instrumentalness
                    },
                    dataFetched:true
                })
          }
    }


    render(){
        if (this.state.dataFetched){
            return(
                <ScrollView style={{marginBottom:35}}>
                    <ImageBackground source = {{ uri:this.state.imageUrl }} style={{width:Dimensions.get("window").width, height:Dimensions.get("window").width, justifyContent:"space-between", padding:10}} imageStyle={{borderBottomRightRadius:10, borderBottomLeftRadius:10, opacity:0.7}}>
                        <TouchableHighlight onPress={this.props.back} underlayColor={"#00000000"}>
                            <Image source={{ uri:String(Back) }} style={{width:20, height:20}}></Image>
                        </TouchableHighlight>
                        <Text style={{color:"white", fontSize:25, textShadowColor:"black", textShadowRadius:5, textShadowOffset:{width:0, height:0}}}>{this.state.name}</Text>
                    </ImageBackground>
                    <View style={{margin:10}}>
                        <View style={{display:"flex",flexDirection:"row", width:"100%"}}>
                            <View style={styles.info}>
                                <Text style={[styles.GreenText]}>{String(this.state.popularity/10)}</Text>
                                <Text style={styles.GeneralText}>0-10 popularity</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={[styles.GreenText]}>{String(((this.state.length/1000)/60).toFixed(2))}</Text>
                                <Text style={styles.GeneralText}>track length</Text>
                            </View>
                        </View>
    
                        <View>
                            <Text style={[styles.GeneralText, {fontSize:25}]}>Audio Features</Text>
                            <AudioFeatures features={this.state.features}></AudioFeatures>
                        </View>

                        <TouchableHighlight onPress={() => {this.props.showScreen({screen:"album",previous:"song",album:{id:this.state.album.id}})}}>
                        <View style={{backgroundColor:"rgb(20,20,20)", borderRadius:10, padding:5, marginTop:10}}>
                            <Text style={{color:"white", fontSize:25}}>Album</Text>
                            <View style={{display:"flex", flexDirection:"row", padding:5}}>
                                <Image source={{ uri:this.state.imageUrl }} style={{height:50,width:50, borderRadius:10 }}></Image>
                                <View style={{marginLeft:5, justifyContent:"space-evenly", width:"100%", flexWrap:"wrap"}}>
                                    <Text style={{color:"white", fontSize:20, width:"85%"}}>{this.state.album.name}</Text>
                                    <Text style={{color:"white", fontSize:15, width:"85%"}}>{
                                        Object.keys(this.state.artists).map((x,i) => {
                                            if (i === 0){
                                                return(
                                                    <Text>
                                                        {this.state.artists[x].name}
                                                    </Text>
                                                )
                                            }else{
                                                return(
                                                    <Text>
                                                        , {this.state.artists[x].name}
                                                    </Text>
                                                )
                                            }
                                        })
                                    }</Text>
                                </View>
                            </View>
                        </View>
                        </TouchableHighlight>

    
                        <View style={{marginTop:10}}>
                            <Text style={{color:"white", fontSize:25}}>Artists</Text>
                            <View>
                                {Object.keys(this.state.artists).map((x,i) => {
                                    if (this.state.artists[x].image){
                                        return(
                                            <TouchableHighlight onPress={() => {this.props.showScreen({screen:"artist",artist:{id:this.state.artists[x].id}})}}>

                                            <View style={{margin:5}}>
                                                <ImageBackground source={{ uri:this.state.artists[x].image.url }} style={{height:50, width: "100%", justifyContent:"center"}} imageStyle={{borderRadius:10}}>
                                                    <Text style={{color:"white", textAlign:"center", fontSize:25, textShadowColor:"black", textShadowRadius:5, textShadowOffset:{width:0, height:0}}}>{this.state.artists[x].name}</Text>
                                                </ImageBackground>
                                            </View>       

                                            </TouchableHighlight>
                                        )
                                    }else{
                                        return(
                                            <TouchableHighlight onPress={() => {this.props.showScreen({screen:"artist",artist:{id:this.state.artists[x].id}})}}>

                                            <View style={{margin:5}}>
                                                <ImageBackground  style={{height:50, width: "100%", justifyContent:"center"}} imageStyle={{borderRadius:10}}>
                                                    <Text style={{color:"white", textAlign:"center", fontSize:25, textShadowColor:"black", textShadowRadius:5, textShadowOffset:{width:0, height:0}}}>{this.state.artists[x].name}</Text>
                                                </ImageBackground>
                                            </View>             

                                            </TouchableHighlight>
                                        )
                                    }
                                    
                                })}
                            </View>
                        </View>
                    </View>
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

const styles = StyleSheet.create({
    GeneralText:{
        color:"white",
        fontSize:20
    },
    info:{
        width:"50%",
        padding:5
    },
    GreenText:{
        color:"#1DB954",
        fontSize:25
    }
})