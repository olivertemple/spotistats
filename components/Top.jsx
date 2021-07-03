import React, { Component } from "react";
import { View, ScrollView, Text, ActivityIndicator, TouchableHighlight, Dimensions} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackCard from "./top/TrackCard";
import ArtistCard from "./top/ArtistCard"
export default class Top extends Component{
    constructor(props){
        super(props)
        this.state={
            dataFetched:false,
            timeRange:"short_term",
            type:"tracks"
        }
        this.fetchData();
        this.artists = this.artists.bind(this);
        this.tracks = this.tracks.bind(this);
        this.setTimeFrame = this.setTimeFrame.bind(this);
    }

    async fetchData(){
        let access_token = await AsyncStorage.getItem("access_token");
        let data = {
            method:"GET",
            headers:{
                "Authorization":"Bearer "+access_token
            }
          }
          let tracks = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range="+this.state.timeRange,data)
          tracks = await tracks.json();
          if (tracks.error){
            if (tracks.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (tracks.error.message === "Invalid access token"){
              console.log("Invalid access token")
            }
          }else{
                let albums = await fetch("https://api.spotify.com/v1/me/top/artists?limit=50&time_range="+this.state.timeRange,data)
                albums = await albums.json();
                albums = albums.items;
                tracks = tracks.items;
                this.setState({
                    tracks:tracks,
                    albums:albums,
                    dataFetched:true
                })
          }
    }
    topTracks(){ 
       return(
            <View style={{padding:10, flexWrap:"wrap", flexDirection:"row"}}>
                {this.state.tracks.map((item,index) => {
                    return(
                        <TrackCard name={item.name} index={index} id={item.id} image={item.album.images[1].url} showScreen={this.props.showScreen} back={this.props.back}></TrackCard>
                    )
                })}
            </View>
            
        )
    }
    topArtists(){
        return(
            <View style={{padding:10, flexWrap:"wrap", flexDirection:"row"}}>
                {this.state.albums.map((item,index) => {
                    return(
                        <ArtistCard name={item.name} index={index} id={item.id} image={item.images[1].url} showScreen={this.props.showScreen} back={this.props.back}></ArtistCard>
                    )
                })}
            </View>
        )
        
    }
    topAlbums(){

    }

    artists(){
        this.setState({
            type:"artists"
        })
    }
    tracks(){
        this.setState({
            type:"tracks"
        })
    }

    setTimeFrame(timeFrame){
        this.setState({
            timeRange:timeFrame
        }, () => {
            this.fetchData()
        })
    }
    render(){
        if (this.state.dataFetched){
            return(
                <View style={{marginBottom:40, height:"100%"}}>
                    <Text style={{color:"white",fontSize:25, textAlign:"center"}}>Top</Text>
                    <View style={{flexDirection:"row"}}>
                        <TouchableHighlight onPress={this.tracks} style={{width:"50%"}}>
                            <View style={{borderBottomColor:this.state.type==="tracks" ? "#1DB954" : "#00000000", borderBottomWidth:2}}>
                                <Text style={{color:"white", fontSize:20, textAlign:"center"}}>Tracks</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.artists} style={{width:"50%"}}>
                            <View style={{borderBottomColor:this.state.type==="artists" ? "#1DB954" : "#00000000", borderBottomWidth:2}}>
                                <Text style={{color:"white", fontSize:20, textAlign:"center"}}>Artists</Text>
                            </View>
                        </TouchableHighlight>

                    </View>
                    <ScrollView>
                        {this.state.type==="tracks" ? this.topTracks() : this.state.type === "artists" ? this.topArtists() : this.topAlbums()}
                    </ScrollView>
                    <View style={{flexDirection:"row", marginBottom:50, padding:5}}>
                        <TouchableHighlight style={{width:"33%"}} onPress={() => {this.setTimeFrame("short_term")}}>
                            <Text style={{color: this.state.timeRange==="short_term" ? "#1DB954" : "white", fontSize:15, textAlign:"center", fontWeight:"bold"}}>4 weeks</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width:"33%"}} onPress={() => {this.setTimeFrame("medium_term")}}>
                            <Text style={{color: this.state.timeRange==="medium_term" ? "#1DB954" : "white", fontSize:15, textAlign:"center", fontWeight:"bold"}}>6 months</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width:"33%"}} onPress={() => {this.setTimeFrame("long_term")}}>
                            <Text style={{color: this.state.timeRange==="long_term" ? "#1DB954" : "white", fontSize:15, textAlign:"center",fontWeight:"bold"}}>lifetime</Text>
                        </TouchableHighlight>
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

/*
*/