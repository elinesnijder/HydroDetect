// app/(tabs)/mapa.tsx — Mapa de Portugal (placeholder)
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const C = {
  bg: "#080E18",
  surface: "#0F1923",
  primary: "#3B8BFF",
  accent: "#00C2FF",
  border: "#1E3048",
  text: "#E8F0FA",
  textSec: "#7A9BBF",
  textMuted: "#4A6A8A",
};

export default function MapaScreen() {
  return (
    <View style={s.container}>
      <View style={s.placeholder}>
        <View style={s.iconCircle}>
          <Ionicons name="map-outline" size={28} color={C.primary} />
        </View>
        <Text style={s.title}>Mapa Operacional</Text>
        <Text style={s.subtitle}>
          Mapa interativo de Portugal com barragens,{"\n"}
          incêndios e helicópteros em tempo real
        </Text>
        <View style={s.comingSoon}>
          <Text style={s.comingSoonText}>Em desenvolvimento</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholder: {
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#3B8BFF12",
    borderWidth: 1,
    borderColor: "#3B8BFF25",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  comingSoon: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    marginTop: 8,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: "500",
    color: C.accent,
  },
});