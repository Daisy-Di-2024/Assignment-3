import * as React from 'react';
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
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

    const isDayValid = (d: string, m: string) => {
        const dayNum = Number(d);
        const monthNum = Number(m);

        if (isNaN(dayNum) || dayNum < 1) return false;

        const daysInMonth = {
            1: 31,
            2: 28,
            3: 31,
            4: 30,
            5: 31,
            6: 30,
            7: 31,
            8: 31,
            9: 30,
            10: 31,
            11: 30,
            12: 31
        };

        return dayNum <= (daysInMonth[monthNum] || 0);
    };

    // useEffect(() => {
    //     if (isMonthValid(month) && isDayValid(day)) {
    //         fetchFact();
    //     }
    // }, [month, day]);

    useEffect(() => {
        if (isMonthValid(month) && isDayValid(day, month)) {
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
        if (trimmed && !isDayValid(trimmed, month)) {
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
            <View style={styles.factSection}>
                {fact ? (
                    <Text style={styles.fact} numberOfLines={10} ellipsizeMode="tail">
                        {fact}
                    </Text>
                ) : null}
            </View>

            <View style={styles.pickerSection}>
                <Picker
                    selectedValue={month}
                    onValueChange={onMonthChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Select month" value="" />
                    {Array.from({ length: 12 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
                    ))}
                </Picker>

                <Picker
                    selectedValue={day}
                    onValueChange={onDayChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Select day" value="" />
                    {Array.from({ length: 31 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
                    ))}
                </Picker>
            </View>

            <View style={styles.errorSection}>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    factSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    fact: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    pickerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        marginVertical: 10,
    },
    picker: {
        flex: 1,
        marginHorizontal: 8,
    },
    errorSection: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        fontSize: 14,
    },
});