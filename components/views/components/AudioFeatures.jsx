import React, { Component } from "react";
import { Text, View} from 'react-native';

export default class AudioFeatures extends Component{
    render(){
        return(
            <View style={{display:"flex",flexDirection:"row", padding:10, justifyContent:"space-evenly"}}>
                <View style={{width:"45%"}}>
                    {(Object.keys(this.props.features)).slice(0,4).map((x,i) => {
                        return(
                            <View >
                                <Text style={{color:"white", fontSize:15}}>{x}</Text>
                                <View style={{display:"flex",flexDirection:"row", width:"100%", marginTop:5}}>
                                    <View style={{backgroundColor:"#1DB954", height:3, width:`${this.props.features[x]*100}%`,borderRadius:10}}></View>
                                    <View style={{backgroundColor:"rgb(20,20,20)", height:3, width:`${(1-this.props.features[x])*100}%`,borderRadius:10}}></View>
                                </View>
                            </View>
                        )
                    })}
                </View>
                <View style={{width:"45%"}}>
                    {(Object.keys(this.props.features)).slice(4).map((x,i) => {
                        return(
                            <View>
                                <Text style={{color:"white",fontSize:15}}>{x}</Text>
                                <View style={{display:"flex",flexDirection:"row", width:"100%", marginTop:5}}>
                                    <View style={{backgroundColor:"#1DB954", height:3, width:`${this.props.features[x]*100}%`, borderRadius:10}}></View>
                                    <View style={{backgroundColor:"rgb(20,20,20)", height:3, width:`${(1-this.props.features[x])*100}%`,borderRadius:10}}></View>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }
}