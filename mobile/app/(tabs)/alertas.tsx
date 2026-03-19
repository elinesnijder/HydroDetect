// app/(tabs)/alertas.tsx — Alertas / Incêndios / FIRMS (placeholder)
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const C = {
  bg: "#080E18",
  surface: "#0F1923",
  primary: "#3B8BFF",
  accent: "#00C2FF",
  danger: "#F87171",
  border: "#1E3048",
  text: "#E8F0FA",
  textMuted: "#4A6A8A",
  dangerBg: "#2D1518",
  dangerBorder: "#4A2028",
};

export default function AlertasScreen() {
  return (
    <View style={s.container}>
      <View style={s.placeholder}>
        <View style={s.iconCircle}>
          <Ionicons name="flame-outline" size={28} color={C.danger} />
        </View>
        <Text style={s.title}>Alertas e Incêndios</Text>
        <Text style={s.subtitle}>
          Deteção NASA FIRMS, fogos ativos{"\n"}
          e alertas em tempo real via satélite
        </Text>

        {/* Quick stats preview */}
        <View style={s.statsRow}>
          <View style={[s.statBox, { backgroundColor: C.dangerBg, borderColor: C.dangerBorder }]}>
            <Text style={[s.statValue, { color: C.danger }]}>3</Text>
            <Text style={[s.statLabel, { color: C.danger }]}>Fogos ativos</Text>
          </View>
          <View style={[s.statBox, { backgroundColor: "#2A2310", borderColor: "#3D3318" }]}>
            <Text style={[s.statValue, { color: "#FBBF24" }]}>7</Text>
            <Text style={[s.statLabel, { color: "#FBBF24" }]}>Deteções FIRMS</Text>
          </View>
        </View>

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
    backgroundColor: "#F8717112",
    borderWidth: 1,
    borderColor: "#F8717125",
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
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  statBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    minWidth: 120,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
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