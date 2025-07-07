import * as React from 'react';
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {

    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [fact, setFact] = useState("");
    const [error, setError] = useState('');

    const isMonthValid = (m: string) => {
        const num = Number(m);
        return !isNaN(num) && num >= 1 && num <= 12;
    };

    const isDayValid = (d: string) => {
        const num = Number(d);
        return !isNaN(num) && num >= 1 && num <= 31;
    };

    // useEffect(() => {
    //     if (isMonthValid(month) && isDayValid(day)) {
    //         fetchFact();
    //     }
    // }, [month, day]);

    useEffect(() => {
        if (isMonthValid(month) && isDayValid(day)) {
            fetchFact();
        } else {
            setFact("");  
        }
    }, [month, day]);


    const onMonthChange = (text: string) => {
        const trimmed = text.trim();
        setMonth(trimmed);
        setFact('');
        if (trimmed && !isMonthValid(trimmed)) {
            setError(`Invalid month: ${trimmed}`);
        } else {
            setError('');
        }
    };

    const onDayChange = (text: string) => {
        const trimmed = text.trim();
        setDay(trimmed);
        setFact('');
        if (trimmed && !isDayValid(trimmed)) {
            setError(`Invalid day: ${trimmed}`);
        } else {
            setError('');
        }
    };

    async function fetchFact() {
        const url = `https://numbersapi.p.rapidapi.com/${month}/${day}/date`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'c0fe3f544emsh4c8af0d0fb0eb1dp179bf4jsnbc223d522e60',
                'x-rapidapi-host': 'numbersapi.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.text();
            setFact(result);
        } catch (error) {
            setError(error);
        }
    }

    return (
        <View style={styles.container}>
            {fact ? <Text style={styles.fact}>{fact}</Text> : null}
            <Picker
            selectedValue={month}
            onValueChange={(itemValue) => setMonth(itemValue)}
            style={styles.picker}
            >
            <Picker.Item label="Select month" value="" />
            {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Day"
                value={day}
                autoCapitalize="none"
                onChangeText={onDayChange}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    picker: {
        height: 50,   width: '100%',      // 或者固定宽度如 150
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
    fact: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
    },
});