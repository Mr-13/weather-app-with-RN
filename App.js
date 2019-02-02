/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
  View,
  ActivityIndicator,
  StatusBar
  } from 'react-native';

import { fetchLocationId, fetchWeather } from './utils/api';

import getImageForWeather from './utils/getImageForWeather';

import SearchInput from './components/SearchInput';


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      error: false,
      temperature: 0,
      weather: '',
      location: '',
    };
  }

  handleUpdateLocation = async city => {

    if(!city) return;

    this.setState({
      loading:true,
      }, async () => { 
        try {
          const locationId = await fetchLocationId(city);
          const {location, weather, temperature} = await fetchWeather(locationId);

          this.setState({
            loading: false,
            error: false,
            location,
            weather,
            temperature
          });
        } 
        catch(e){
          this.setState({
            loading: false,
            error: true
          });
        }
      }
    );
  };

  render() {

    const {loading, error, location, weather, temperature} = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behaviour="padding">
          <StatusBar barStyle="light-content"/>
          <ImageBackground
            source = {getImageForWeather(weather)}
            style = {styles.imageContainer}
            imageStyle = {styles.image}
          >

                <View style={styles.detailsContainer}>

                    <ActivityIndicator animating = {loading} color = "white" size= "large" />
                    {!loading && (
                      <View>
                        {error && (
                          <Text style={[styles.smallText, styles.textStyle]}>
                          Could not load weather, please try a different city.
                          </Text>
                        )}
                        
                        {!error && (
                          <View>
                            <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
                            <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                            <Text style={[styles.largeText, styles.textStyle]}>{`${Math.round(temperature)}°`}</Text>
                          </View>
                        )}                
                            <SearchInput
                              placeholder="Search my City"
                              onSubmit = {this.handleUpdateLocation}
                            />
                     </View>
                    )}        

                </View>


          </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },

  imageContainer: {
    flex: 1
  },

  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },

  largeText: {
    fontSize: 44,
  },
  
  smallText: {
    fontSize: 18,
  },

  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white'
  },

  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20
  }
});