import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Check_circle from '../../assets/svg/Check_circle.svg'
import { COLORS_DF, FONT_FAMILIES } from '../../config/themes/default';


const { width, height } = Dimensions.get('window');

const ModalComponent = (props) => {
    const { isVisible, label, closeModal } = props;

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={closeModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Check_circle />
                        <Text style={styles.textContent}>
                            {props.label}
                        </Text>
                        <TouchableOpacity
                            style={styles.gameButtonRegular}
                            onPress={closeModal}>
                            <Text style={styles.textButton}>Continuar </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    textContent: {
        color: COLORS_DF.citrine_brown,
        fontFamily: FONT_FAMILIES.bold,
        fontSize: height * 0.028,
        textAlign: 'center',
    },
    textButton: {
        fontFamily: FONT_FAMILIES.bold,
        fontSize: height * 0.024,
        textAlign: 'center',
        color: 'white'

    },
    modalContent: {
        height: width * 0.6,
        width: width * 0.77,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    gameButtonRegular: {
        alignItems: 'center',
        backgroundColor: COLORS_DF.robin_egg_blue,
        borderRadius: 7,
        flexDirection: 'row',
        marginTop: 25,
        justifyContent: 'center',
        padding: 5,
        height: 45,
        width: width * 0.5,
    },
    titleText: {

        fontSize: height * 0.04,
        textAlign: 'center',
    },
});

export default ModalComponent;
