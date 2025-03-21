import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image, Dimensions, FlatList, Text, TouchableOpacity, TextInput } from "react-native";
import BaseStyle from '../assets/styles';
import { useDispatch, useSelector } from "react-redux";
import { addSearchToHistory, setResults } from "../store/slices/searchSlice";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchgeoLocation } from "../../api/index";

export const SearchScreen = () => {
  const [loaded, setloaded] = useState(true)
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const results = useSelector((state: any) => state.search.results);
  const history = useSelector((state: any) => state.search.history);
  const [location, setLocation] = useState({
    latitude: 3.1319,
    longitude: 101.6841,
  });

  const handleChange = (e: any) => {
    setQuery(e);
  };

  useEffect(() => {
    dispatch({ type: "search/fetch", payload: query });
  }, [query]);

  const renderItem = (res: any) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => search_map(res)}>
        <Text>{res.item.description}</Text>
      </TouchableOpacity>
    );
  };

  const search_map = async (input: any) => {
    setloaded(false)
    setQuery("");
    setResults([])
    dispatch(addSearchToHistory(input.item.description))

    try {
      const response = await fetchgeoLocation(input.item.place_id)
      if (response) {
        console.log(response)
        const placeDetails = response.data.result;
        setLocation({
          latitude: placeDetails.geometry.location.lat,
          longitude: placeDetails.geometry.location.lng,
        });
        setloaded(true)
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      setloaded(true)
    }

    // setTimeout(async () => {
    //   setloaded(true)
    // }, 500);
  }

  const renderHistory = (res: any) => {
    if (res.index == 0) {
      return (
        <View style={styles.item}>
          <Text style={[
            BaseStyle.font_weight_600
          ]}>{res.item}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.item}>
          <Text>{res.item}</Text>
        </View>
      );
    }

  };

  return (
    <View style={{ flex: 1 }} >
      {!loaded ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#FFFFFF', height: Dimensions.get('screen').height, width: Dimensions.get("window").width }}>
          <Image
            style={{ width: 200, height: 130 }}
            source={require('../assets/images/loading.gif')}
          />
        </View>
      ) : (
        <ScrollView style={[
          BaseStyle.main_container,
        ]} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={[
            BaseStyle.head_container
          ]}>
            <Text style={[
              BaseStyle.font_size_20,
              BaseStyle.font_weight_600,
              BaseStyle.txt_align_center
            ]}>React Place Search</Text>
          </View>
          <View style={[
            BaseStyle.body_container
          ]}>
            <View>
              <TextInput placeholder="Search places..." onChangeText={handleChange} style={[BaseStyle.inputStyle]} />
              {results.length > 0 && (
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.place_id}
                  renderItem={renderItem}
                  style={styles.dropdown}
                  nestedScrollEnabled 
                />
              )}
            </View>
            <View style={{
              gap: 20,
              paddingTop: 20
            }}>
              <Text style={[
                BaseStyle.font_size_20,
                BaseStyle.font_weight_600
              ]}>
                Map
              </Text>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={[styles.map]}
                initialRegion={{
                  ...location,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Selected Location"
                />
              </MapView>
            </View>
            <View style={{
              gap: 20,
              paddingTop: 20
            }}>
              <Text style={[
                BaseStyle.font_size_20,
                BaseStyle.font_weight_600
              ]}>
                Search History
              </Text>
              <FlatList
                data={history}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderHistory}
                nestedScrollEnabled 
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  map: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.5
  },
})