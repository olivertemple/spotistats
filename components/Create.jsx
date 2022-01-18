import React, { Component, useRef } from "react";
import { View, Text, ScrollView, Dimensions, TouchableHighlight, Image, ActivityIndicator, TouchableHighlightBase} from "react-native";
import Fetch from "./Fetch";
import Post from "./Post";
import Track from "./views/components/Track";
import { Swipeable } from "react-native-gesture-handler";
import { createRef } from "react";
import Playlists from "./create/Playlists";

export default class Create extends Component{
    constructor(props){
        super(props);
        this.state = {
            playlists:[],
            genres:[],
            active:0,
            genreRefs:[null,null,null,null,null],
            scrollRef:null,
            create:null
        }
        this.renderPlaylists = this.renderPlaylists.bind(this)
        this.setActive = this.setActive.bind(this)
        this.setGenreRef = this.setGenreRef.bind(this)
        this.removeSongFromPlaylist = this.removeSongFromPlaylist.bind(this)
        this.getData();
    }


    async getData(){
        let genres = {};
        let artists = await new Fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term").getData();

        artists.forEach(item => {
            let items = item.items;
            items.forEach(artist => {
                artist.genres.forEach(genre => {
                    if (genres[genre]){
                        genres[genre] += 1;
                    }else{
                        genres[genre]=1
                    }
                })
            })
        })
        let toSort = [];
        Object.keys(genres).forEach(genre => {
            toSort.push([genre, genres[genre]])
        })
        let sorted = toSort.sort(function(a, b){return b[1] - a[1]});
        console.log(sorted)
        let stateGenres = []
        for(let i=0; i<5; i++){
            stateGenres.push(sorted[i][0]);
            this.getPlaylist(sorted[i][0]);
        }
        this.setState({genres:stateGenres})
    }

    async getPlaylist(genre){
        let seedArtists = [];
        let seedTracks = [];
        let seedAlbums = [];
        this.setState({status:"fetching your top tracks"})
        let tracks = await new Fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term").getData();
        this.setState({status:"analyzing your top tracks"})
        for (let i = 0; i < tracks.length; i++){
            let item = tracks[i]
            let items = item.items;
            for (let j = 0; j<items.length; j++){
                let track = items[j]
                let genres = [];
                for (let k=0; k<track.artists.length; k++){
                    let artist = track.artists[k];
                    artist = await new Fetch("https://api.spotify.com/v1/artists/"+artist.id).getData();
                    artist[0].genres.forEach(item => {
                        genres.push(item)
                    })
                    if (genres.includes(genre)){
                        track.artists.forEach(artist => {
                            seedArtists.push(artist.id)
                        })
                        seedTracks.push(track.id)
                        seedAlbums.push(track.album.id)
                    }
                }
            }
        }
        this.setState({status:"generating songs"})

        let artist = Math.floor(Math.random() * (seedArtists.length-2))
        let track = Math.floor(Math.random() * (seedTracks.length-2))


        seedArtists = seedArtists.slice(artist,artist+2).join(",");
        seedTracks = seedTracks.slice(track,track+2).join(",");
        let recommendations = await new Fetch("https://api.spotify.com/v1/recommendations?limit=100&seed_artists="+seedArtists+"&seed_tracks="+seedTracks+"&seed_genres="+genre).getData();

        let ids = [];
        let tracksObj = {};
        recommendations[0].tracks.forEach(track => {
            ids.push(track.id)
            tracksObj[track.id] = track;
        })


        let state = this.state;
        state.playlists.push({genre:genre, tracks:tracksObj, ids:ids})
        
        this.setState(state, () => {console.log(this.state)});
        
    }

    async createNewPlaylist(genre){
        console.log(genre);
        console.log(this.state)
        this.state.playlists.forEach(async playlist => {
            if (playlist.genre === genre){
                let me = await new Fetch("https://api.spotify.com/v1/me").getData();
                let uris = []
                for (let i = 0; i < playlist.ids.length; i++){
                    uris.push("spotify:track:"+playlist.ids[i])
                }
                
                let newPlaylist = await new Post("https://api.spotify.com/v1/users/"+me[0].id+"/playlists").getData({name:genre+" from spotistats"});

                let addToPlaylist = await new Post("https://api.spotify.com/v1/playlists/"+newPlaylist[0].id+"/tracks").getData({uris:uris})

                if(addToPlaylist[0].snapshot_id){
                    this.setState({create:true})
                }
            }
        })
       
    }

    removeSongFromPlaylist(id, genre){
        console.log("here")
        let state = this.state;
        state.playlists.forEach(playlist => {
            if (playlist.genre === genre){
                playlist.ids = playlist.ids.filter(item => id != item);
            }
        })
        this.setState(state)        
    }


    setActive(key){
        this.setState({active:key}, () => {
            console.log(this.state)
            let offset = (this.state.genreRefs[this.state.active].current.offsetLeft)
            console.log(offset)
            this.state.scrollRef.current.scrollTo({x:offset});
        })
        
    }

    success(){
        if (this.state.create !== null){
            setTimeout(() => {
                this.setState({create:null})
            }, 1000)
            if (this.state.create){
                return(
                    <View style={{width:Dimensions.get("window").width,alignItems:"center", position:"absolute", bottom:20}}>
                        <View style={{backgroundColor:"#1DB954", borderRadius:10, width:70, padding:5, alignItems:"center"}}>
                            <Text style={{color:"white"}}>success</Text>
                        </View>
                    </View>
                ) 
            }else{
                return(
                    <View style={{width:Dimensions.get("window").width,alignItems:"center"}}>
                        <View style={{backgroundColor:"red", borderRadius:10, width:70, padding:5, alignItems:"center"}}>
                            <Text style={{color:"white"}}>failed</Text>
                        </View>
                    </View>
                )
            }
        }else{
            return null
        }
    }

    setGenreRef(ref, key){
        this.state.genreRefs[key]=ref
    }

    renderPlaylists(){
        if (this.state.playlists.length===5){
            return(
                <View style={{justifyContent:"space-between", flexDirection:"row"}}>
                    <ScrollView horizontal={true}>
                        {this.state.genres.map((genre, key) => {
                            if (this.state.active != key){
                                return(
                                    <TouchableHighlight onPress={() => {this.setActive(key)}}>
                                        <View style={{padding:2, borderBottomColor:"white", borderBottomWidth:1}}> 
                                            <Text style={{color:"white"}}>{genre}</Text>
                                        </View>
                                    </TouchableHighlight>
                                    
                                )
                            }else{
                                return(
                                    <TouchableHighlight onPress={() => {this.setActive(key)}}>
                                        <View style={{padding:2, paddingTop:1, borderLeftColor:"white", borderTopColor:"white", borderRightColor:"white", borderWidth:1, borderTopRightRadius:10, borderTopLeftRadius:10}}>
                                            <Text style={{color:"white", fontSize:15, fontWeight:"bold"}}>{genre}</Text>
                                        </View>
                                    </TouchableHighlight>
                                )
                            }
                            
                        }
                            
                        )}
                    </ScrollView>
                    <TouchableHighlight onPress={() => {this.createNewPlaylist(this.state.genres[this.state.active])}}>
                        <Image source={require("../assets/add.png")} style={{width:30, height:30, marginRight:10}}></Image>
                    </TouchableHighlight>
                </View>
            )
        }else{
            return null
        }
        
    }

    render(){
        let scrollRef = createRef(null);
        this.state.scrollRef = scrollRef
        return(
            <View style={{marginBottom:40}}>
                <Text style={{color:"white",fontSize:25, textAlign:"center"}}>Create</Text>
                <View style={{margin:10}}>
                    <Text style={{color:"white",fontSize:20, marginBottom:10}}>We have some personalized playlists generated from your top songs.</Text>
                    {this.renderPlaylists()}
                    <ScrollView horizontal={true} ref={scrollRef}>
                        <Playlists genres={this.state.genres} playlists={this.state.playlists} status={this.state.status} setGenreRef={this.setGenreRef} removeSongFromPlaylist={this.removeSongFromPlaylist}></Playlists>
                       
                    </ScrollView>
                </View>
                {this.success()}
            </View>
        )

    }
}