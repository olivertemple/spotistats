import React, { Component } from "react";
import { View, Text, ScrollView, Dimensions, TouchableHighlight, Image, ActivityIndicator, TouchableHighlightBase} from "react-native";
import { createRef } from "react";
import { Swipeable } from "react-native-gesture-handler";
import Track from "../views/components/Track";

export default class Playlists extends Component{
    render(){
        if (this.props.playlists.length === 5){
            return(
            this.props.genres.map((genre, key) => {
                let item;
                for (let i =0; i<this.props.playlists.length; i++){
                    if (this.props.playlists[i].genre===genre){
                        item = this.props.playlists[i]
                    }
                }
                console.log(item)
                let ref = createRef(null)
                this.props.setGenreRef(ref, key)
                return(
                    <View style={{width:Dimensions.get("window").width - 20}} ref={ref}>
                        <ScrollView style={{height:Dimensions.get("window").height - 180}}>
                            {item.ids.map(id => {
                                let track = item.tracks[id]
                                let artists = [];
                                track.artists.forEach(artist => {
                                    artists.push(artist.name)
                                })
                                artists = artists.join(", ")
                                return(
                                    <Swipeable key={track.id}
                                        renderRightActions={() => (
                                        <View style={{backgroundColor:"red", width:"95%", borderRadius:10, marginRight:10, marginTop:5, marginBottom:1, justifyContent:"center", padding:10}}>
                                            <Text style={{color:"black", textAlign:"right", fontWeight:"bold"}}>remove</Text>
                                        </View>)} onSwipeableRightOpen={() => {this.props.removeSongFromPlaylist(id, item.genre)}}
                                    >
                                        <Track id={track.id} name={track.name} artists={artists} image={track.album.images.slice(-1)[0].url} showScreen={() => {return null}}></Track>
    
                                    </Swipeable>
                                )
                            })}
                        </ScrollView>
                    </View>
                )
            }))
    }else{
        return(
            <View style={{marginTop:100, width:Dimensions.get("window").width - 20, justifyContent:"center", alignItems:"center"}}>
                <ActivityIndicator size="large" color="#1DB954"></ActivityIndicator>
                <Text style={{color:"white"}}>{this.props.status}</Text>
            </View>
        )
    }
}}