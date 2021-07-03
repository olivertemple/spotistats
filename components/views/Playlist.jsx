import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, ScrollView, TouchableHighlight, BackHandler, ActivityIndicator } from 'react-native';
import AudioFeatures from "./components/AudioFeatures";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Track from "./components/Track";
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

    async fetchTracks(next, data){
        let tracks = await fetch(next, data);
        tracks = await tracks.json();
        return tracks
    }

    async fetchData(){
        let access_token = await AsyncStorage.getItem("access_token");
        let data = {
            method:"GET",
            headers:{
                "Authorization":"Bearer "+access_token
            }
          }
          let res = await fetch("https://api.spotify.com/v1/playlists/"+this.props.id,data)
          res = await res.json();
          console.log(res)
          if (res.error){
            if (res.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (res.error.message === "Invalid access token"){
              console.log("Invalid access token")
            }
          }else{
                let info = res;
                let tracks=info.tracks.items;
                if (info.tracks.next!==null){
                    let next = info.tracks.next;
                    while (next != null){
                        let moreTracks = await this.fetchTracks(next, data);
                        tracks = tracks.concat(moreTracks.items)
                        next = moreTracks.next;
                    }
                }
                let trackIds = []
                for (let i = 0; i < tracks.length; i++){
                    trackIds.push(tracks[i].track.id)
                }
                let trackIdsSeparated = [];
                let playlistFeatures = {};
                let index = 100
                while (index < trackIds.length+100){
                    let ids = trackIds.slice(index-100,index);
                    trackIdsSeparated.push(ids);
                    index += 100;
                }

                for (let k=0; k < trackIdsSeparated.length; k++){
                    trackIds = trackIdsSeparated[k]
                    let features = await fetch("https://api.spotify.com/v1/audio-features?ids="+trackIds, data);
                    features = await features.json();
                    features = features.audio_features
                    console.log(features)
                    for (let i = 0; i < features.length; i++){
                        let trackFeatures = features[i];
                        if (trackFeatures !== null){
                            let keys = Object.keys(trackFeatures);
                            for (let j=0; j<keys.length; j++){
                                if (["acousticness","danceability","energy","instrumentalness","liveness","speechiness","valence", "loudness"].includes(keys[j])){
                                    if (!playlistFeatures[keys[j]]){
                                        playlistFeatures[keys[j]] = trackFeatures[keys[j]]
                                    }else{
                                        playlistFeatures[keys[j]] += trackFeatures[keys[j]]
                                    }
                                }
                            }
                        }
                        
                    }
                }
                
                console.log(playlistFeatures)


                
                this.setState({
                    name:info.name,
                    imageUrl:info.images[0].url,
                    totalTracks:info.tracks.total,
                    owner:info.owner.display_name,
                    features:{
                        valence:playlistFeatures.valence/info.tracks.total,
                        energetic:playlistFeatures.energy/info.tracks.total,
                        danceable:playlistFeatures.danceability/info.tracks.total,
                        acoustic:playlistFeatures.acousticness/info.tracks.total,
                        lively:playlistFeatures.liveness/info.tracks.total,
                        speechful:playlistFeatures.speechiness/info.tracks.total,
                        instrumental:playlistFeatures.instrumentalness/info.tracks.total,
                        loudness:Math.abs(playlistFeatures.loudness)/(info.tracks.total*100)
                    },
                    tracks:tracks,
                    dataFetched:true
                })
          }
    }


    render(){
        if (this.state.dataFetched){
            return(
                <ScrollView style={{marginBottom:40}}>
                    <ImageBackground source = {{ uri:this.state.imageUrl }} style={{width:Dimensions.get("window").width, height:Dimensions.get("window").width, justifyContent:"space-between", padding:10}} imageStyle={{borderBottomRightRadius:10, borderBottomLeftRadius:10, opacity:0.7}}>
                        <TouchableHighlight onPress={this.props.back} underlayColor={"#00000000"}>
                            <Image source={{ uri:String(Back) }} style={{width:20, height:20}}></Image>
                        </TouchableHighlight>
                        <Text style={{color:"white", fontSize:25, textShadowColor:"black", textShadowRadius:7.5, textShadowOffset:{width:0, height:0}}}>{this.state.name}</Text>
                    </ImageBackground>
                    <View style={{margin:10}}>
                        <View style={{display:"flex",flexDirection:"row", width:"100%"}}>
                            <View style={styles.info}>
                                <Text style={[styles.GreenText]}>{this.state.totalTracks}</Text>
                                <Text style={styles.GeneralText}>Tracks</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={[styles.GreenText, {fontSize:15}]}>{this.state.owner}</Text>
                                <Text style={styles.GeneralText}>owner</Text>
                            </View>
                        </View>
    
                        <View>
                            <Text style={[styles.GeneralText, {fontSize:25}]}>Audio Features</Text>
                            <AudioFeatures features={this.state.features}></AudioFeatures>
                        </View>                     
                    </View>

                    <View style={{margin:10}}>
                        <Text style={{color:"white", fontSize:25}}>Playlist Content</Text>
                        <View>
                            {this.state.tracks.map(item => {
                                let artists = [];
                                for (let i = 0; i < item.track.artists.length; i++){
                                    artists.push(item.track.artists[i].name)
                                }
                                artists = artists.join(", ")
                                return(
                                    <Track id={item.track.id} name={item.track.name} artists={artists} image={item.track.album.images.slice("-1")[0].url} showScreen={this.props.showScreen}></Track>
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