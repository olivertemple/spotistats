import React, { Component } from "react";
import { View, Text, Image, TouchableHighlight, Animated } from "react-native";
const Expand = require("../../assets/expand-button.png");

export default class DropDown extends Component{
    constructor(props){
        super(props);
        this.state = {
            expanded:false
        }
        this.toggle = this.toggle.bind(this);
        this.spinValue = new Animated.Value(0);
        console.log(this.props)
    }
    toggle(){
        let state = this.state.expanded;
        this.setState({
            expanded:!state
        })

    }
    render(){
        if (!this.state.expanded){
            return(
                <View style={{padding:5}}>
                    <TouchableHighlight onPress={this.toggle}>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <View>
                                <Text style={{color:"white", fontSize:25, fontWeight:"bold"}}>{this.props.title}</Text>
                                <Text style={{color:"white", fontSize:20}}>{this.props.subtitle} artists</Text>
                            </View>
                            <Image source={{ uri:String(Expand) }} style={{width:20,height:20}}></Image>
                        </View>
                    </TouchableHighlight>
                </View>
            )
        }else{
            return(
                <View style={{padding:5}}>
                    <TouchableHighlight onPress={this.toggle}>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <View>
                                <Text style={{color:"#1DB954", fontSize:25, fontWeight:"bold"}}>{this.props.title}</Text>
                                <Text style={{color:"#1DB954", fontSize:20}}>{this.props.subtitle} artists</Text>
                            </View>
                            <Image source={{ uri:String(Expand) }} style={{width:20,height:20, transform:[{rotate:"180deg"}], tintColor:"#1DB954"}}></Image>
                        </View>
                    </TouchableHighlight>
                    <View>
                        {
                            this.props.data.map(item => {
                                return(
                                    <View style={{flexDirection:"row", margin:5}}>
                                        <TouchableHighlight onPress={() => {this.props.showScreen({screen:"artist", artist:{id:item.id}})}}>
                                            <View style={{flexDirection:"row"}}>
                                                <Image source={{ uri:item.images.slice(-1)[0].url }} style={{height:50, width:50, borderRadius:10}}></Image>
                                                <View style={{marginLeft:10}}>
                                                    <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>{item.name}</Text>
                                                    <Text style={{color:"white", fontSize:15}}>{this.props.topArtists[item.name] ? "#"+this.props.topArtists[item.name] : "Not"} in your top artists</Text>

                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            )
        }
    }
}