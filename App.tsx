/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
  Vibration,
  ScrollView,
} from 'react-native';
import RNShake from 'react-native-shake';
import { SafeAreaView } from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  const moods = [
    {emoji: '😊', label: 'Happy', color: '#FFD700'},
    {emoji: '😢', label: 'Sad', color: '#87CEEB'},
    {emoji: '😡', label: 'Angry', color: '#FF6347'},
    {emoji: '😱', label: 'Surprised', color: '#FFA500'},
    {emoji: '😴', label: 'Sleepy', color: '#A9A9A9'},
    {emoji: '🤢', label: 'Sick', color: '#98FB98'},
    {emoji: '😇', label: 'Blessed', color: '#FFB6C1'},
    {emoji: '🤠', label: 'Excited', color: '#FF69B4'},
    {emoji: '😎', label: 'Cool', color: '#1E90FF'},
    {emoji: '😭', label: 'Heartbroken', color: '#C71585'},
    {emoji: '🤔', label: 'Thoughtful', color: '#D3D3D3'},
    {emoji: '😤', label: 'Frustrated', color: '#FF4500'},
    {emoji: '😌', label: 'Content', color: '#F0E68C'},
    {emoji: '🤩', label: 'Amazed', color: '#FF8C00'},
    {emoji: '😕', label: 'Confused', color: '#D2B48C'},
    {emoji: '😷', label: 'Worried', color: '#B0C4DE'},
    {emoji: '🤓', label: 'Nerdy', color: '#8A2BE2'},
    {emoji: '😈', label: 'Mischievous', color: '#800080'},
    {emoji: '🤡', label: 'Silly', color: '#FF69B4'},
    {emoji: '🥳', label: 'Celebratory', color: '#FFD700'},
    {emoji: '😶', label: 'Indifferent', color: '#C0C0C0'},
    {emoji: '😬', label: 'Nervous', color: '#FFB6C1'},
    {emoji: '🤤', label: 'Hungry', color: '#FFA07A'},
    {emoji: '😜', label: 'Playful', color: '#FF4500'},
    {emoji: '😔', label: 'Disappointed', color: '#708090'},
    {emoji: '🤯', label: 'Mind-blown', color: '#FF6347'},
    {emoji: '😇', label: 'Innocent', color: '#FFFACD'},
    {emoji: '🤥', label: 'Deceptive', color: '#D3D3D3'},
    {emoji: '😤', label: 'Determined', color: '#FF8C00'},
    {emoji: '😪', label: 'Tired', color: '#B0E0E6'},
    {emoji: '🤧', label: 'Allergic', color: '#E0FFFF'},
    {emoji: '😵', label: 'Dizzy', color: '#F5DEB3'},
    {emoji: '🤠', label: 'Adventurous', color: '#FFDEAD'},
    {emoji: '😺', label: 'Cheerful', color: '#FFDAB9'},
    {emoji: '😻', label: 'Loving', color: '#FFB6C1'},
    {emoji: '😼', label: 'Sassy', color: '#D8BFD8'},
    {emoji: '🙀', label: 'Shocked', color: '#FF6347'},
    {emoji: '😽', label: 'Affectionate', color: '#FFE4E1'},
  ];

  // Load saved history
  useEffect(() => {
    const loadHistory = async () => {
      const saved = await AsyncStorage.getItem('moodHistory');
      if (saved) setMoodHistory(JSON.parse(saved));
    };
    loadHistory();
  }, []);

  // Shake to delete history
  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      Alert.alert(
        'Delete Mood History',
        'Do you want to delete all mood history?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await AsyncStorage.removeItem('moodHistory');
              setMoodHistory([]);
              setSelectedMood(null);
              Vibration.vibrate(300);
            },
          },
        ]
      );
    });

    return () => subscription.remove();
  }, []);

  const saveMood = async (mood) => {
    try {
      Vibration.vibrate(100);
      const newEntry = {
        mood: mood.label,
        timestamp: new Date().toISOString(),
        color: mood.color,
        emoji: mood.emoji,
      };
      const updatedHistory = [newEntry, ...moodHistory];
      await AsyncStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
      setMoodHistory(updatedHistory);
      setSelectedMood(mood.label);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>How Are You Feeling?</Text>
      <Text style={styles.subtitle}>Track your daily moods.</Text>

      {/* Scrollable emojis */}
      <ScrollView contentContainerStyle={styles.moodScroll}>
        <View style={styles.moodGrid}>
          {moods.map((mood, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodButton,
                { backgroundColor: mood.color },
                selectedMood === mood.label && styles.selectedMood,
              ]}
              onPress={() => saveMood(mood)}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={styles.label}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Scrollable history */}
      {moodHistory.length > 0 && (
        <ScrollView contentContainerStyle={styles.historyScroll}>
          <Text style={styles.historyTitle}>Your Mood History</Text>
          {moodHistory.slice(0, 50).map((entry, index) => (
            <View
              key={index}
              style={[styles.historyItem, { borderLeftColor: entry.color }]}
            >
              <Text style={styles.selectedLabel}>{entry.emoji}</Text>
              <View>
                <Text style={styles.hostoryMood}>{entry.mood}</Text>
                <Text>{formatDate(entry.timestamp)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5F5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 10, color: '#333' },
  moodScroll: { paddingHorizontal: 10, paddingBottom: 10 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  moodButton: {
    width: 100,
    height: 120,
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 10,
  },
  emoji: { fontSize: 50 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 5 },
  selectedMood: { borderWidth: 3, borderColor: '#333', transform: [{ scale: 1.1 }] },
  historyScroll: { paddingHorizontal: 20, paddingBottom: 20 },
  historyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  historyItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 10, elevation: 2, borderLeftWidth: 10 },
  selectedLabel: { fontSize: 30, marginLeft: 15 },
  hostoryMood: { fontSize: 18, fontWeight: '600', color: '#333' },
});

export default App;
