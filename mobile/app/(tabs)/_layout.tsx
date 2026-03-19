// app/(tabs)/_layout.tsx — HidroScan Tab Navigator (Dark Theme)
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// ─── DARK THEME TOKENS ───────────────────────────────────────────────────────
const C = {
  bg: "#080E18",
  surface: "#0F1923",
  navy: "#0B1D33",
  primary: "#3B8BFF",
  accent: "#00C2FF",
  border: "#1E3048",
  text: "#E8F0FA",
  textMuted: "#4A6A8A",
  danger: "#F87171",
  tabBar: "#0A1220",
  tabBarBorder: "#162232",
};

// ─── HEADER ──────────────────────────────────────────────────────────────────

function HeaderTitle() {
  return (
    <View style={styles.headerRow}>
      {/* Logo */}
      <View style={styles.logo}>
        <View style={styles.logoInner}>
          <Text style={styles.logoLetter}>H</Text>
        </View>
      </View>

      {/* Brand */}
      <View>
        <Text style={styles.brandName}>HidroScan</Text>
      </View>

      {/* Beta badge */}
      <View style={styles.betaBadge}>
        <Text style={styles.betaText}>BETA</Text>
      </View>
    </View>
  );
}

// ─── TAB LAYOUT ──────────────────────────────────────────────────────────────

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Header
        headerStyle: {
          backgroundColor: C.bg,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        },
        headerTitle: () => <HeaderTitle />,
        headerTitleAlign: "left",

        // Tab bar
        tabBarStyle: {
          backgroundColor: C.tabBar,
          borderTopWidth: 1,
          borderTopColor: C.tabBarBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          letterSpacing: 0.2,
        },
      }}
    >
      {/* Tab 1: Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Ionicons name={focused ? "grid" : "grid-outline"} size={20} color={color} />
            </View>
          ),
        }}
      />

      {/* Tab 2: Mapa */}
      <Tabs.Screen
        name="mapa"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Ionicons name={focused ? "map" : "map-outline"} size={20} color={color} />
            </View>
          ),
        }}
      />

      {/* Tab 3: Helicópteros */}
        
      <Tabs.Screen
        name="helicopteros"
        options={{
            title: "Helis",
            tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
                <MaterialCommunityIcons
                name={focused ? "helicopter" : "helicopter"}
                size={22}
                color={color}
                />
            </View>
            ),
        }}
        />

      {/* Tab 4: Alertas */}
      <Tabs.Screen
        name="alertas"
        options={{
          title: "Alertas",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Ionicons name={focused ? "flame" : "flame-outline"} size={20} color={color} />
            </View>
          ),
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: C.danger,
            color: "#fff",
            fontSize: 10,
            fontWeight: "700",
            minWidth: 18,
            height: 18,
            lineHeight: 18,
            borderRadius: 9,
          },
        }}
      />
    </Tabs>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#3B8BFF15",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3B8BFF30",
  },
  logoInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoLetter: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  brandName: {
    color: C.text,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  betaBadge: {
    backgroundColor: "#00C2FF15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#00C2FF30",
  },
  betaText: {
    color: C.accent,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  // Active tab icon glow
  activeIconWrap: {
    backgroundColor: "#3B8BFF12",
    borderRadius: 10,
    padding: 4,
  },
});