import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry } from '../actions/addEntry';
import { deleteEntry } from '../actions/deleteEntry';
import { editEntry } from '../actions/editEntry';
import EditEntryForm from '../components/EditEntryForm';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllEntriesByCurrentUser } from '../actions/getEntry';

const ItemDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const { item: itemParam } = route.params;
    const dispatch = useDispatch();
    const items = useSelector((state) => state.items);
    const item = items.find((item) => item.id === itemParam);
    const [entries, setEntries] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [quantity, setQuantity] = useState('');
    const [buttonTitle, setButtonTitle] = useState(moment(date).format('MM/DD/YYYY'));
    const [editingEntryId, setEditingEntryId] = useState(null);

    useEffect(() => {
        const fetchEntries = async () => {
            const entries = await getAllEntriesByCurrentUser();
            setEntries(entries);
        };
        fetchEntries();
    }, []);


    const handleQuantityChange = (text) => {
        setQuantity(text);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        const formattedDate = moment(selectedDate).format('MM/DD/YYYY');
        setButtonTitle(formattedDate);
        console.log('on Date Change', currentDate, event, date);
    };

    const handleAddEntry = () => {
        dispatch(addEntry(item, quantity, date, itemParam.name));
        setQuantity('');
    };

    const handleDeleteEntry = (entryId) => {
        console.log('Delete', item.id);
        dispatch(deleteEntry(item, entryId));
    };

    const handleUpdateEntry = (entryId, newQuantity) => {
        const updatedEntry = { id: entryId, quantity: newQuantity };
        const updatedEntries = entries.map(entry => entry.id === entryId ? updatedEntry : entry);
        dispatch(editEntry(item, updatedEntries));
        setEditingEntryId(null);
    };


    const renderEntry = ({ entry, date, quantity }) => {
        const formattedDate = moment(date.toDate()).format('MM/DD/YYYY')
        // console.log(entry, date, quantity)
        console.log(moment(date.toDate()).format('MM/DD/YYYY'));


        const renderRightActions = (progress, dragX) => {
            return (
                <View style={styles.deleteContainer}>
                    <TouchableOpacity
                        onPress={() => handleDeleteEntry(entry.id)}
                        style={styles.deleteButton}
                    >
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            );
        };

        const renderLeftActions = (progress, dragX) => {
            const trans = dragX.interpolate({
                inputRange: [-100, 0],
                outputRange: [1, 0],
            });

            const onPressEdit = () => {
                setEditingEntryId(entry.id);
            };

            return (
                <View style={styles.updateContainer}>
                    <TouchableOpacity style={styles.updateButton} onPress={onPressEdit}>
                        <Text style={styles.updateText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            );
        };

        if (editingEntryId && entry && entry.id === editingEntryId) {
            return (
                <EditEntryForm
                    entry={entry}
                    item={item}
                    quantity={entry.quantity}
                    onSubmit={handleUpdateEntry}
                    onCancel={() => setEditingEntryId(null)}
                />
            );
        }

        return (
            <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
                <View style={styles.entryContainer}>
                    <Text style={styles.entryText}>{entry.quantity}</Text>
                    <Text style={styles.entryText}>{formattedDate}</Text>
                </View>
            </Swipeable>
        );
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={({ pressed }) => [{ backgroundColor: pressed ? '#fff' : 'transparent', borderRadius: 20, padding: 16, width: '85%', marginTop: 10, alignSelf: 'flex-start' }]}
                onPress={() => navigation.goBack()}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="chevron-back" size={24} color='#fff' />
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
                        Back
                    </Text>
                </View>
            </TouchableOpacity>
            <ScrollView style={styles.inputContainer}>
                <Text style={styles.title}>{itemParam.name}
                </Text>
                <Text style={{
                    fontStyle: 'italic',
                    borderBottomWidth: 2,
                    borderBottomColor: 'black'
                }}>ID: {itemParam.id}
                </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handleQuantityChange}
                    value={quantity}
                    placeholder="Quantity"
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: '#5637DD',
                        borderRadius: 10,
                        padding: 10,
                        alignSelf: 'center',
                        width: '80%'
                    }}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={{ fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 18 }}>{buttonTitle
                    }</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#8BC34A',
                        padding: 10,
                        borderRadius: 5,
                        marginVertical: 3,
                    }}
                    onPress={handleAddEntry}
                    disabled={!quantity}
                >
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Add Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => {
                        navigation.navigate('LineChart', { itemId: item.id, name: itemParam.name });
                    }}
                >
                    <View style={styles.imageContainer}>
                        <Image source={require('../assets/img/chart.png')} style={styles.image} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Line Chart</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.listContainer}>
                <View style={{ borderBottomWidth: 2, borderBottomColor: 'black' }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>Product Entries
                    </Text>
                </View>

                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#708090', textAlign: 'center' }}>
                    Quantity{'          '}&&{'          '}Date
                </Text>
                <FlatList
                    data={entries}
                    keyExtractor={(entry) => entry.id}
                    renderItem={({ item }) => renderEntry({ entry: item, date: item.date })}
                    ListEmptyComponent={<Text style={styles.entryText}>No Entries Found</Text>}
                    contentContainerStyle={styles.entriesContainer}
                />
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#778899',
        alignItems: 'center'
    },
    inputContainer: {
        flex: 1,
        padding: 10,
    },
    listContainer: {
        flex: 1,
        padding: 16,
        marginTop: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 4,
        padding: 5,
        marginVertical: 5,
        width: '100%',
        backgroundColor: '#fff',
    },
    entriesContainer: {
        flexGrow: 1,
    },
    entryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        borderWidth: 2,
        borderColor: 'black',
        marginVertical: 5,
        borderRadius: 4,
        backgroundColor: '#F7F7F7',
    },
    entryText: {
        marginTop: 1,
        marginHorizontal: 20,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    deleteContainer: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: '75%',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: '75%',
    },
    deleteText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    updateButton: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: '75%',
    },
    updateText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    updateContainer: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: '75%',
    },
    card: {
        marginTop: 24,
        backgroundColor: 'black',
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        marginTop: 24,
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
    },
});



export default ItemDetailScreen;