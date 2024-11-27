import React from 'react';
import {Platform, StyleSheet, View, Image} from 'react-native';
import LongLogo from "../../assets/longlogo.svg"

const Header = () => {
    return (
        <View>
            <LongLogo width={100} height={100}/>
        </View>
    );
}

export default Header;