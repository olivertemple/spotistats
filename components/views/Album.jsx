import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, ScrollView, TouchableHighlight, BackHandler, ActivityIndicator } from 'react-native';
import AudioFeatures from "./components/AudioFeatures";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Track from "./components/Track"
const Back = require("../../assets/left-arrow.png")

export default class Album extends Component{
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

        this.months = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Dec"];
        this.days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    }

    async fetchData(){
        let access_token = await AsyncStorage.getItem("access_token");
        let data = {
            method:"GET",
            headers:{
                "Authorization":"Bearer "+access_token
            }
          }
          let res = await fetch("https://api.spotify.com/v1/albums?ids="+this.props.id,data)
          res = await res.json();
          if (res.error){
            if (res.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (res.error.message === "Invalid access token"){
              console.log("Invalid access token")
            }
          }else{
                let info = res.albums[0];
                for (let i = 0; i < info.artists.length; i++){
                    let key = Object.keys(info.artists)[i];
                    let artistInfo = await fetch("https://api.spotify.com/v1/artists?ids="+info.artists[key].id, data)
                    artistInfo = await artistInfo.json();
                    info.artists[Object.keys(info.artists)[i]].image = artistInfo.artists[0].images[0]
                }

                let tracks = info.tracks.items;
                let keys = Object.keys(tracks);

                let ids = [];
                for (let i = 0; i < keys.length; i++){
                    ids.push(tracks[keys[i]].id)
                }
                ids=ids.join(",")
                let features = await fetch("https://api.spotify.com/v1/audio-features?ids="+ids, data);
                features = await features.json();
                features = features.audio_features;
                let albumFeatures = {}
                for (let i = 0; i < features.length; i++){
                    let keys = Object.keys(features[i]);
                    for (let j = 0; j < keys.length; j++){
                        if (["acousticness","danceability","energy","instrumentalness","liveness","speechiness","valence"].includes(keys[j])){
                            if (!albumFeatures[keys[j]]){
                                albumFeatures[keys[j]] = features[i][keys[j]]
                            }else{
                                albumFeatures[keys[j]] += features[i][keys[j]]
                            }
                        }
                    }

                    
                }
                features = albumFeatures;
                features.popularity = info.popularity
                this.setState({
                    name:info.name,
                    imageUrl:info.images[0].url,
                    artists:info.artists,
                    popularity:info.popularity,
                    length:info.total_tracks,
                    date:new Date(info.release_date),
                    features:{
                        valence:(features.valence/info.total_tracks),
                        popularity:(info.popularity/100),
                        energetic:(features.energy/info.total_tracks),
                        danceable:(features.danceability/info.total_tracks),
                        acoustic:(features.acousticness/info.total_tracks),
                        lively:(features.liveness/info.total_tracks),
                        speechful:(features.speechiness/info.total_tracks),
                        instrumental:(features.instrumentalness/info.total_tracks)
                    },
                    tracks:info.tracks.items,
                    smallestImage:info.images.slice(-1)[0].url,
                    dataFetched:true
                })
          }
    }


    render(){
        if (this.state.dataFetched){
            return(
                <ScrollView style={{marginBottom:35}}>
                    <ImageBackground source = {{ uri:this.state.imageUrl }} style={{width:Dimensions.get("window").width, height:Dimensions.get("window").width, justifyContent:"space-between", padding:10}} imageStyle={{borderBottomRightRadius:10, borderBottomLeftRadius:10,opacity:0.7}}>
                        <TouchableHighlight onPress={this.props.back} underlayColor={"#00000000"}>
                            <Image source={{ uri:String(Back) }} style={{width:20, height:20}}></Image>
                        </TouchableHighlight>
                        <Text style={{color:"white", fontSize:25, textShadowColor:"black", textShadowRadius:7.5, textShadowOffset:{width:0, height:0}}}>{this.state.name}</Text>
                    </ImageBackground>
                    <View style={{margin:10}}>
                        <View style={{display:"flex",flexDirection:"row", width:"100%"}}>
                            <View style={styles.info}>
                                <Text style={[styles.GreenText]}>{this.state.length}</Text>
                                <Text style={styles.GeneralText}>tracks</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={[styles.GreenText]}>{this.state.date.getFullYear()}</Text>
                                <Text style={styles.GeneralText}>{this.days[this.state.date.getDay()-1]}, {this.months[this.state.date.getMonth()]} {this.state.date.getDate()}</Text>
                            </View>
                        </View>
    
                        <View>
                            <Text style={[styles.GeneralText, {fontSize:25}]}>Audio Features</Text>
                            <AudioFeatures features={this.state.features}></AudioFeatures>
                        </View>
    
                        
    
                        <View style={{marginTop:10}}>
                            <Text style={{color:"white", fontSize:25}}>Artists</Text>
                            <View>
                                {Object.keys(this.state.artists).map((x,i) => {
                                    return(
                                        <TouchableHighlight onPress={() => {this.props.showScreen({screen:"artist",artist:{id:this.state.artists[x].id}})}}>

                                            <View style={{margin:5}}>
                                                <ImageBackground source={{ uri:this.state.artists[x].image.url }} style={{height:50, width: "100%", justifyContent:"center"}} imageStyle={{borderRadius:10}}>
                                                    <Text style={{color:"white", textAlign:"center", fontSize:25, textShadowColor:"black", textShadowRadius:5, textShadowOffset:{width:0, height:0}}}>{this.state.artists[x].name}</Text>
                                                </ImageBackground>
                                            </View>    

                                        </TouchableHighlight>                                   
                                    )
                                })}
                            </View>
                        </View>

                        <View>
                            <Text style={{color:"white", fontSize:25}}>Tracks</Text>
                            {this.state.tracks.map(i => {
                                let artists = [];
                                for (let j = 0; j<i.artists.length; j++){
                                    artists.push(i.artists[j].name)
                                }
                                artists = artists.join(", ")
                                return(
                                    <Track id={i.id} name={i.name} artists={artists} image={this.state.smallestImage} showScreen={this.props.showScreen}></Track>
                                )
                            })}
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