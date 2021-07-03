import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, ScrollView, TouchableHighlight, BackHandler, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Track from "./components/Track";

const Back = require("../../assets/left-arrow.png")
export default class Song extends Component{
    constructor(props){
        super(props)
        this.fetchData = this.fetchData.bind(this);
        this.state = {
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
          let res = await fetch("https://api.spotify.com/v1/artists/"+this.props.id,data)
          res = await res.json();
          if (res.error){
            if (res.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (res.error.message === "Invalid access token"){
              console.log("Invalid access token")
            }
          }else{
                let info = res;

                let topTracks = await fetch("https://api.spotify.com/v1/artists/"+this.props.id+"/top-tracks?market=GB", data);
                topTracks = await topTracks.json();

                this.setState({
                    name:info.name,
                    imageUrl:info.images[0].url,
                    popularity:info.popularity,
                    followers:info.followers.total,
                    genres:info.genres,
                    topTracks:topTracks.tracks,
                    dataFetched:true
                })
          }
    }


    render(){
        if (this.state.dataFetched){
            return(
                <ScrollView style={{marginBottom:40, backgroundColor:"black"}}>
                    <ImageBackground source = {{ uri:this.state.imageUrl }} style={{width:Dimensions.get("window").width, height:Dimensions.get("window").width, justifyContent:"space-between", padding:10}} imageStyle={{borderBottomRightRadius:10, borderBottomLeftRadius:10,opacity:0.7}}>
                        <TouchableHighlight onPress={this.props.back} underlayColor={"#00000000"}>
                            <Image source={{ uri:String(Back) }} style={{width:20, height:20}}></Image>
                        </TouchableHighlight>
                        <Text style={{color:"white", fontSize:25, textShadowColor:"black", textShadowRadius:7.5, textShadowOffset:{width:0, height:0}}}>{this.state.name}</Text>
                    </ImageBackground>
                    <View style={{margin:10}}>
                        <View style={{display:"flex",flexDirection:"row", width:"100%"}}>
                            <View style={styles.info}>
                                <Text style={[styles.GreenText]}>{String(this.state.popularity/10)}</Text>
                                <Text style={styles.GeneralText}>0-10 popularity</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={[styles.GreenText]}>{this.state.followers}</Text>
                                <Text style={styles.GeneralText}>followers</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{margin:10}}>
                        <Text style={{color:"white", fontSize:25}}>Genres</Text>
                        <View style={{flexDirection:"row", flexWrap:"wrap", justifyContent:"flex-start"}}>
                            {
                                this.state.genres.map(i => {
                                    return(
                                        <View style={{backgroundColor:"#181818", margin:5, padding:5, borderRadius:5}}>
                                            <Text style={{color:"white", fontSize:20}}>{i}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View style={{margin:10}}>
                        <Text style={{color:"white", fontSize:25}}>Top Tracks</Text>
                        <View>
                            {this.state.topTracks.map((item,index) => {
                                let artists = []
                                for (let i = 0; i < item.artists.length; i++){
                                    artists.push(item.artists[i].name)
                                }
                                return(
                                    <Track id={item.id} name={item.name} image={item.album.images.splice(-1)[0].url} artists={artists} index={index+1} showScreen={this.props.showScreen}></Track>
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