// Voici l'application notée du 10/01/19, cette application permet de scanner des codes barres de certains
// produits et connaître leur nom ainsi que leur nutri-score.

// Ici se trouve l'importe de toutes les données nécessaires à l'usage de l'application notamment l'usage
// du react native et des éléments généraux.

import React from 'react';
import {
  Button,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import {homeStyle} from './style/home';
import {fontsStyle} from './style/fonts';
import {globalStyle} from './style/global';
import AppHeader from './components/AppHeader';
import ScanButton from './components/ScanButton';
import ProductItem from './components/ProductItem';
import {RNCamera} from 'react-native-camera';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      modalVisible: false,
      modalProductVisible: false,
      products: [{id: 1, name: 'Coca', date: new Date()}],
    };
    this.title = 'YOKI NUTRI';
  }

  // Ici se trouve l'api nécessaire à l'application, elles permettent de récupérer
  // certains détails notamment le résultat des données du scan, les informations nutriscore, ...etc

  getProductFromApi = async barcode => {
    try {
      let response = await fetch(
        'https://fr.openfoodfacts.org/api/v0/produit/' + barcode + '.json',
      );
      let responseJson = await response.json();

      console.log(responseJson);

      return responseJson.product;
    } catch (error) {
      console.error(error);
    }
  };

  handleScanPress = () => {
    this.setModalVisible(true);

    // Ici permet de scanner un code barre pour connaître les informations de celui-ci.
  };

  setModalVisible = bool => {
    this.setState({modalVisible: bool});
  };

  setModalProductVisible = bool => {
    this.setState({modalProductVisible: bool});
  };

  handleProductPress = async data => {
    // await this._handleBarCodeRead({type: 'EAM', data: '8000500037560'}) #cette ligne est inutile suite à l'ajout du modal
    this.setState({modalProductVisible: true});
  };

  // Grâce à cette ligne, nous obtenons les données du code barre scanné

  _handleBarCodeRead = async ({type, data}) => {
    alert(data);

    let scannedProduct = await this.getProductFromApi(data);

    // Permet la création d'un nouvel objet produit avec toutes les informations demandées

    let newProduct = {
      id: 1,
      name: scannedProduct.product_name,
      date: new Date(),
      nutri: scannedProduct.nutriscore_grade,
      catego: scannedProduct.categories,
      ingredients: scannedProduct.ingredients_text_fr,
    };

    // Récupération de la liste

    let _products = this.state.products;

    console.log(scannedProduct);
    console.log(newProduct);

    _products.push(newProduct); // ajout du nouveau produit dans le menu principal
    this.setState({products: _products}); // on set les nouveaux produits dans le state
    this.setState({modalScanVisible: false});
  };

  render() {
    return (
      <View style={globalStyle.container}>
        <AppHeader title={this.title} />

        <ScanButton handlePress={this.handleScanPress} />

        <ScrollView style={homeStyle.scrollProductView}>
          {this.state.products.map(produit => {
            return (
              <ProductItem
                product={produit}
                key={produit.id}
                onPressItem={data => this.handleProductPress(data)}
              />
            );
          })}
        </ScrollView>

        {/* Modal pour la partie du scan des produits */}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={{flex: 1}}>
            <AppHeader title="Détection du code barre..." />

            <RNCamera
              style={{flex: 1}}
              type={RNCamera.Constants.Type.back}
              // flashMode={RNCamera.Constants.FlashMode.on}
              onBarCodeRead={this._handleBarCodeRead}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}></RNCamera>

            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
              style={{
                position: 'absolute',
                handlebackgroundColor: 'lightblue',
                width: '100%',
                height: 70,
                left: 0,
                bottom: 0,
              }}>
              <Text>Retour</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Partie du modal de la fiche technique des produits scannés */}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalProductVisible}
          onRequestClose={() => {
            this.setModalProductVisible(!this.state.modalProductVisible);
          }}>
          <View style={{flex: 1}}>
            <AppHeader title="Produit scanné" />

            <Text
              style={{
                textAlignVertical: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'red',
              }}>
              {this.state.products[this.state.products.length - 1].name}
            </Text>

            <Text
              style={{
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                color: 'blue',
              }}>
              Note du nutriscore :{' '}
              {this.state.products[this.state.products.length - 1].nutri}
            </Text>

            <Text
              style={{
                fontWeight: 'bold',
                color: 'green',
              }}>
              Catégorie du produit :{' '}
              {this.state.products[this.state.products.length - 1].catego}
            </Text>

            <Text
              style={{
                fontWeight: 'bold',
                color: 'orange',
              }}>
              Liste des ingrédients :{' '}
              {this.state.products[this.state.products.length - 1].ingredients}
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.setModalProductVisible(!this.state.modalProductVisible);
              }}
              style={{
                position: 'absolute',
                handlebackgroundColor: 'lightblue',
                width: '100%',
                height: 70,
                left: 0,
                bottom: 0,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'red',
                }}>
                RETOUR AU MENU PRINCIPAL
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}
