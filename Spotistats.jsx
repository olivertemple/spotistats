import React, { Component } from "react";
import { Dimensions, View } from 'react-native';
import Overview from "./components/Overview";
import Song from "./components/views/Song";
import Album from "./components/views/Album";
import Artist from "./components/views/Artist";
import Playlist from "./components/views/Playlist"

import Top from "./components/Top";

import Stats from "./components/Stats"
import Genres from "./components/Genres"
import NavBar from "./components/NavBar"
export default class Spotistats extends Component{

    constructor(props){
        super(props)
        this.state = {
            screen:"overview",
            active:"home"
        }
        this.previousStates = [];
        this.previousStateIndex = null;
        this.showScreen = this.showScreen.bind(this);
        this.back = this.back.bind(this);
    }
    /*//!states
    song:
    state={
        screen:"song",
        song:{
            id:id
        },
        previous:previous
    } 
    ###
    overview:
    state={
        screen:"overview",
        previous:previous
    }
    */
    
    showScreen(state){
        /*
        state = {
            screen: String ("song","album","overview" etc.)
            data:{
                the data for the thing
            }
        }
        */ 
        let oldState = this.state;
        if (state.screen !== "overview" || state.screen !== "top"){
            this.previousStates.push(oldState);
            this.previousStateIndex !== null ? this.previousStateIndex+=1 : this.previousStateIndex = 0;
        }else{
            this.previousStates = [];
            this.previousStateIndex = null;
        }
        
        this.setState(state);

        if (state.screen === "overview"){
            this.setState({
                active:"home"
            })
        }else if (state.screen === "top"){
            this.setState({
                active:"top"
            })
        }else if (state.screen === "stats"){
            this.setState({
                active:"stats"
            })
        }else if (state.screen === "charts"){
            this.setState({
                active:"charts"
            })
        }

    }
    back(){
        let newState = this.previousStates[this.previousStateIndex];
        this.previousStates.splice(this.previousStateIndex, 1);
        this.previousStateIndex -= 1;
        this.setState(newState);
    }

    getComponent(){
        if (this.state.screen === "overview"){
            return(
                <Overview refresh={this.props.refresh} onRecentPress={this.showScreen} showScreen={this.showScreen}></Overview>
            )
        }else if(this.state.screen === "song"){
            return(
                <Song id={this.state.song.id} back={this.back} showScreen={this.showScreen} refresh={this.props.refresh}></Song>
            )
        }else if (this.state.screen === "album"){
            return(
                <Album id={this.state.album.id} back={this.back} showScreen={this.showScreen} refresh={this.props.refresh}></Album>
            )
        }else if (this.state.screen === "artist"){
            return(
                <Artist id={this.state.artist.id} back={this.back} showScreen={this.showScreen} refresh={this.props.refresh}></Artist>
            )
        }else if (this.state.screen === "playlist"){
            return(
                <Playlist id={this.state.playlist.id} back={this.back} showScreen={this.showScreen} refresh={this.props.refresh}></Playlist>
            )
        }else if (this.state.screen === "top"){
            return(
                <Top back={this.back} showScreen={this.showScreen} refresh={this.props.refresh}></Top>
            )
        }else if (this.state.screen === "stats"){
            return(
                <Stats showScreen={this.showScreen} refresh={this.props.refresh}></Stats>
            )
        }else if (this.state.screen === "genres"){
            return(
                <Genres showScreen={this.showScreen} back={this.back} genres={this.state.genres} artistGenres={this.state.artistGenres} topArtists={this.state.topArtists}></Genres>
            )
        }
    }

    render(){
        let height = Dimensions.get("window").height
        
        return(
            <View style={{height:height, backgroundColor:"black", justifyContent:"space-between"}}>
                {this.getComponent()}
                <NavBar showScreen={this.showScreen} active={this.state.active}></NavBar>
            </View>
        )
    }
}