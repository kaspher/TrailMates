import React from 'react';
import {Platform, StyleSheet, View, Image} from 'react-native';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Image
                source={require('./logo/TRAILMATESWIZYTOWKA.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 100,
        backgroundColor: Platform.select({
            ios: '#386641',
            android: '#386641',
            default: '#cccccc',
        }),
        paddingTop: 30,
    },

    logo:  {
        width: '100%',
        height: '100%',
    },
});