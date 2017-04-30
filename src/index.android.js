import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import SearchForm from './www/SearchForm.component';

export default class src extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>
          Find My Airbnb
        </Text>
        <Text style={styles.instructions}>
          Recherchez l'hôtel idéal pour votre séjour en effectuant une simple recherche.
        </Text>
          <SearchForm style={styles.form} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center'
  },
  form: {
    textAlign: 'center'
  },
});

AppRegistry.registerComponent('src', () => src);
