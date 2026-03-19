// app/(tabs)/index.tsx — HidroScan Dashboard (Dark Theme)
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ─── DARK THEME TOKENS ───────────────────────────────────────────────────────
const C = {
  // Backgrounds (dark → light)
  bg: "#080E18",
  surface: "#0F1923",
  surfaceLight: "#162232",
  surfaceHover: "#1A2B3D",
  card: "#121E2D",

  // Blues
  primary: "#3B8BFF",
  primaryDim: "#2A6FD4",
  secondary: "#5BA3FF",
  accent: "#00C2FF",
  glow: "#3B8BFF20",
  ice: "#1A2E45",
  iceBorder: "#243B55",

  // Borders
  border: "#1E3048",
  borderLight: "#162232",

  // Text
  text: "#E8F0FA",
  textSec: "#7A9BBF",
  textMuted: "#4A6A8A",

  // Status
  success: "#34D399",
  successBg: "#0D2E23",
  successBorder: "#1A4A35",
  warning: "#FBBF24",
  warningBg: "#2A2310",
  warningBorder: "#3D3318",
  danger: "#F87171",
  dangerBg: "#2D1518",
  dangerBorder: "#4A2028",
  dangerLight: "#F8717140",
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

interface WaterSource {
  id: number;
  name: string;
  full: string;
  lat: number;
  lng: number;
  type: string;
  cap: number;
  level: number;
  area: number;
  depth: number;
  access: "A" | "B" | "C";
  heli: boolean;
  region: string;
}

interface Fire {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: "critical" | "high";
  ha: number;
}

const SOURCES: WaterSource[] = [
  { id: 1, name: "Castelo de Bode", full: "Barragem do Castelo de Bode", lat: 39.5467, lng: -8.3192, type: "barragem", cap: 1095, level: 78, area: 3290, depth: 42, access: "A", heli: true, region: "Santarém" },
  { id: 2, name: "Cabril", full: "Barragem de Cabril", lat: 39.9308, lng: -8.0861, type: "barragem", cap: 870, level: 65, area: 2080, depth: 65, access: "A", heli: true, region: "Leiria" },
  { id: 3, name: "Alqueva", full: "Barragem do Alqueva", lat: 38.1972, lng: -7.4944, type: "barragem", cap: 4150, level: 82, area: 25000, depth: 96, access: "A", heli: true, region: "Évora" },
  { id: 4, name: "Aguieira", full: "Barragem de Aguieira", lat: 40.3428, lng: -8.1978, type: "barragem", cap: 450, level: 55, area: 2000, depth: 50, access: "B", heli: false, region: "Viseu" },
  { id: 5, name: "Alto Rabagão", full: "Barragem do Alto Rabagão", lat: 41.7167, lng: -7.85, type: "barragem", cap: 569, level: 71, area: 2200, depth: 58, access: "A", heli: true, region: "Vila Real" },
  { id: 6, name: "Montargil", full: "Lago de Montargil", lat: 39.0833, lng: -8.1667, type: "lago", cap: 165, level: 60, area: 1646, depth: 18, access: "B", heli: false, region: "Portalegre" },
  { id: 7, name: "Vilarinho das Furnas", full: "Barragem de Vilarinho das Furnas", lat: 41.7833, lng: -8.15, type: "barragem", cap: 118, level: 45, area: 340, depth: 97, access: "C", heli: false, region: "Braga" },
  { id: 8, name: "Régua", full: "Barragem da Régua", lat: 41.1547, lng: -7.7864, type: "barragem", cap: 95, level: 88, area: 580, depth: 25, access: "A", heli: true, region: "Vila Real" },
  { id: 9, name: "Santa Luzia", full: "Barragem de Santa Luzia", lat: 40.0167, lng: -7.5, type: "barragem", cap: 50, level: 72, area: 250, depth: 76, access: "B", heli: false, region: "Castelo Branco" },
  { id: 10, name: "Azibo", full: "Barragem do Azibo", lat: 41.55, lng: -6.8833, type: "barragem", cap: 54, level: 80, area: 410, depth: 42, access: "A", heli: true, region: "Bragança" },
  { id: 11, name: "Pracana", full: "Albufeira de Pracana", lat: 39.65, lng: -7.8333, type: "albufeira", cap: 107, level: 58, area: 520, depth: 35, access: "B", heli: false, region: "Castelo Branco" },
  { id: 12, name: "Paradela", full: "Barragem de Paradela", lat: 41.8333, lng: -7.8333, type: "barragem", cap: 164, level: 67, area: 380, depth: 112, access: "C", heli: false, region: "Vila Real" },
];

const FIRES: Fire[] = [
  { id: "F1", name: "Serra da Estrela", lat: 40.3211, lng: -7.6114, severity: "critical", ha: 2500 },
  { id: "F2", name: "Monchique", lat: 37.3167, lng: -8.55, severity: "high", ha: 800 },
  { id: "F3", name: "Pedrógão Grande", lat: 39.9167, lng: -8.1333, severity: "critical", ha: 4200 },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function LevelPill({ level }: { level: number }) {
  const color = level >= 70 ? C.success : level >= 40 ? C.warning : C.danger;
  const bg = level >= 70 ? C.successBg : level >= 40 ? C.warningBg : C.dangerBg;
  return (
    <View style={[s.pill, { backgroundColor: bg, borderWidth: 1, borderColor: level >= 70 ? C.successBorder : level >= 40 ? C.warningBorder : C.dangerBorder }]}>
      <Text style={[s.pillText, { color }]}>{level}%</Text>
    </View>
  );
}

function Pill({ label, color, bg, borderColor }: { label: string; color: string; bg: string; borderColor?: string }) {
  return (
    <View style={[s.pill, { backgroundColor: bg, borderWidth: 1, borderColor: borderColor || bg }]}>
      <Text style={[s.pillText, { color }]}>{label}</Text>
    </View>
  );
}

function LevelBar({ value, height = 3 }: { value: number; height?: number }) {
  const color = value >= 70 ? C.primary : value >= 40 ? C.warning : C.danger;
  return (
    <View style={[s.barTrack, { height }]}>
      <View style={[s.barFill, { width: `${value}%`, backgroundColor: color, height }]} />
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterAccess, setFilterAccess] = useState<"all" | "A" | "B">("all");

  const filtered = useMemo(
    () =>
      SOURCES.filter(
        (src) =>
          (src.name + src.region).toLowerCase().includes(search.toLowerCase()) &&
          (filterAccess === "all" || src.access === filterAccess)
      ).sort((a, b) => b.cap - a.cap),
    [search, filterAccess]
  );

  const distances = useMemo(() => {
    const sel = SOURCES.find((src) => src.id === selectedId);
    if (!sel) return [];
    return FIRES.map((f) => ({
      ...f,
      dist: haversine(sel.lat, sel.lng, f.lat, f.lng),
      eta: Math.round((haversine(sel.lat, sel.lng, f.lat, f.lng) / 200) * 60),
    })).sort((a, b) => a.dist - b.dist);
  }, [selectedId]);

  const operational = SOURCES.filter((src) => src.level >= 40).length;

  const handleSelect = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  // ─── RENDER ITEM ─────────────────────────────────────────────────
  const renderSource = ({ item: src }: { item: WaterSource }) => {
    const isSelected = selectedId === src.id;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSelect(src.id)}
        style={[s.sourceCard, isSelected && s.sourceCardActive]}
      >
        {/* Header row */}
        <View style={s.sourceHeader}>
          <View style={{ flex: 1 }}>
            <Text style={s.sourceName}>{src.name}</Text>
            <Text style={s.sourceMeta}>
              {src.region} · {src.cap.toLocaleString()} hm³
            </Text>
          </View>
          <LevelPill level={src.level} />
        </View>

        {/* Bar + badges */}
        <View style={s.sourceBarRow}>
          <View style={{ flex: 1 }}>
            <LevelBar value={src.level} />
          </View>
          {src.heli && (
            <Pill label="HELI" color={C.accent} bg={C.ice} borderColor={C.iceBorder} />
          )}
          <Pill
            label={src.access === "A" ? "Fácil" : src.access === "B" ? "Médio" : "Difícil"}
            color={src.access === "A" ? C.success : src.access === "B" ? C.warning : C.danger}
            bg={src.access === "A" ? C.successBg : src.access === "B" ? C.warningBg : C.dangerBg}
            borderColor={src.access === "A" ? C.successBorder : src.access === "B" ? C.warningBorder : C.dangerBorder}
          />
        </View>

        {/* ─── EXPANDED DETAIL ──────────────────────────────────── */}
        {isSelected && (
          <View style={s.detail}>
            <Text style={s.detailType}>
              {src.type.toUpperCase()} · {src.region}
            </Text>
            <Text style={s.detailFull}>{src.full}</Text>

            {/* Level bar large */}
            <View style={s.levelSection}>
              <View style={s.levelRow}>
                <Text style={s.levelLabel}>Nível atual</Text>
                <Text style={s.levelValue}>{src.level}%</Text>
              </View>
              <LevelBar value={src.level} height={6} />
            </View>

            {/* Stats grid */}
            <View style={s.statsGrid}>
              {[
                ["Capacidade", `${src.cap.toLocaleString()} hm³`],
                ["Área", `${src.area.toLocaleString()} ha`],
                ["Profundidade", `${src.depth} m`],
                ["Coordenadas", `${src.lat.toFixed(2)}°N, ${Math.abs(src.lng).toFixed(2)}°W`],
              ].map(([label, value]) => (
                <View key={label} style={s.statCell}>
                  <Text style={s.statLabel}>{label}</Text>
                  <Text style={s.statValue}>{value}</Text>
                </View>
              ))}
            </View>

            {/* Operational status */}
            <View
              style={[
                s.opBox,
                {
                  backgroundColor:
                    src.level >= 70 ? C.successBg : src.level >= 40 ? C.warningBg : C.dangerBg,
                  borderColor:
                    src.level >= 70 ? C.successBorder : src.level >= 40 ? C.warningBorder : C.dangerBorder,
                },
              ]}
            >
              <Text
                style={[
                  s.opTitle,
                  { color: src.level >= 70 ? C.success : src.level >= 40 ? C.warning : C.danger },
                ]}
              >
                {src.level >= 70
                  ? "✓ Operacional"
                  : src.level >= 40
                  ? "⚠ Cautela recomendada"
                  : "✕ Não recomendado"}
              </Text>
              <Text
                style={[
                  s.opDesc,
                  {
                    color:
                      src.level >= 70 ? "#6EE7B7" : src.level >= 40 ? "#FCD34D" : "#FCA5A5",
                  },
                ]}
              >
                {src.level >= 70
                  ? "Nível adequado para reabastecimento. Superfície permite aproximação segura."
                  : src.level >= 40
                  ? "Nível moderado. Verificar profundidade no ponto de captação antes de operar."
                  : "Nível crítico. Risco de danos no equipamento. Procurar alternativa."}
              </Text>
            </View>

            {/* Distances to fires */}
            <Text style={s.sectionLabel}>DISTÂNCIA AOS INCÊNDIOS ATIVOS</Text>
            {distances.map((d) => (
              <View key={d.id} style={s.distRow}>
                <View style={s.distLeft}>
                  <View
                    style={[
                      s.dot,
                      { backgroundColor: d.severity === "critical" ? C.danger : C.warning },
                    ]}
                  />
                  <View>
                    <Text style={s.distName}>{d.name}</Text>
                    <Text style={s.distHa}>{d.ha.toLocaleString()} ha</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={s.distKm}>{d.dist.toFixed(0)} km</Text>
                  <Text style={s.distEta}>~{d.eta} min voo</Text>
                </View>
              </View>
            ))}

            {/* Satellite info */}
            <View style={s.satInfo}>
              <Ionicons name="globe-outline" size={12} color={C.textMuted} />
              <Text style={s.satText}>Sentinel-2 NDWI · 10m/px · Atualizado: 08 Mar 2026</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ─── HEADER ──────────────────────────────────────────────────────
  const ListHeader = () => (
    <>
      {/* Summary bar */}
      <View style={s.summaryBar}>
        <View style={s.summaryItem}>
          <View style={[s.dotSmall, { backgroundColor: C.danger }]} />
          <Text style={s.summaryText}>
            <Text style={{ fontWeight: "700", color: C.danger }}>{FIRES.length}</Text> incêndios
          </Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryItem}>
          <View style={[s.dotSmall, { backgroundColor: C.primary }]} />
          <Text style={s.summaryText}>
            <Text style={{ fontWeight: "700", color: C.text }}>
              {operational}/{SOURCES.length}
            </Text>{" "}
            operacionais
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={s.liveBadge}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Fire alerts */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.fireScroll}
      >
        {FIRES.map((f) => (
          <View key={f.id} style={s.fireCard}>
            <View style={[s.dot, { backgroundColor: C.danger }]} />
            <View>
              <Text style={s.fireName}>{f.name}</Text>
              <Text style={s.fireMeta}>
                {f.ha.toLocaleString()} ha ·{" "}
                {f.severity === "critical" ? "Crítico" : "Alto"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Search */}
      <View style={s.searchContainer}>
        <Ionicons name="search-outline" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={s.searchInput}
          placeholder="Pesquisar barragens, regiões..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={s.filterRow}>
        {(
          [
            ["all", "Todas"],
            ["A", "Acesso fácil"],
            ["B", "Acesso médio"],
          ] as const
        ).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[s.filterBtn, filterAccess === key && s.filterBtnActive]}
            onPress={() => setFilterAccess(key)}
          >
            <Text style={[s.filterText, filterAccess === key && s.filterTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={{ flex: 1 }} />
        <Text style={s.resultCount}>{filtered.length} resultados</Text>
      </View>
    </>
  );

  // ─── EMPTY ───────────────────────────────────────────────────────
  const EmptyList = () => (
    <View style={s.empty}>
      <Ionicons name="water-outline" size={32} color={C.border} />
      <Text style={s.emptyText}>Nenhuma barragem encontrada</Text>
      <Text style={s.emptyHint}>Tenta pesquisar por outro nome ou região</Text>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <FlatList
        data={filtered}
        keyExtractor={(src) => String(src.id)}
        renderItem={renderSource}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  listContent: {
    paddingBottom: 24,
  },

  // Summary
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  summaryText: {
    fontSize: 12,
    color: C.textSec,
  },
  summaryDivider: {
    width: 1,
    height: 14,
    backgroundColor: C.border,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: C.dangerBorder,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.danger,
  },
  liveText: {
    fontSize: 9,
    fontWeight: "700",
    color: C.danger,
    letterSpacing: 1,
  },
  dotSmall: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  // Fire alerts
  fireScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  fireCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.dangerBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: C.dangerBorder,
  },
  fireName: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text,
  },
  fireMeta: {
    fontSize: 10,
    color: C.danger,
    marginTop: 1,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.text,
  },

  // Filters
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 6,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  filterBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.ice,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "500",
    color: C.textSec,
  },
  filterTextActive: {
    color: C.primary,
  },
  resultCount: {
    fontSize: 11,
    color: C.textMuted,
  },

  // Source card
  sourceCard: {
    marginHorizontal: 12,
    marginBottom: 4,
    borderRadius: 12,
    padding: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  sourceCardActive: {
    backgroundColor: C.ice,
    borderColor: C.iceBorder,
  },
  sourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  sourceName: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  sourceMeta: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 2,
  },
  sourceBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Pill
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Level bar
  barTrack: {
    backgroundColor: C.borderLight,
    borderRadius: 99,
    overflow: "hidden",
    width: "100%",
  },
  barFill: {
    borderRadius: 99,
  },

  // Dot
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  // ─── EXPANDED DETAIL ─────────────────────────────────────────────
  detail: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  detailType: {
    fontSize: 10,
    color: C.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailFull: {
    fontSize: 18,
    fontWeight: "700",
    color: C.text,
    marginBottom: 14,
  },

  // Level
  levelSection: {
    marginBottom: 14,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  levelLabel: {
    fontSize: 13,
    color: C.textSec,
  },
  levelValue: {
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 1,
    backgroundColor: C.border,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
  },
  statCell: {
    width: "49.5%",
    backgroundColor: C.surface,
    padding: 12,
  },
  statLabel: {
    fontSize: 11,
    color: C.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },

  // Operational box
  opBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  opTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  opDesc: {
    fontSize: 12,
    lineHeight: 18,
  },

  // Distances
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  distRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  distLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  distName: {
    fontSize: 14,
    fontWeight: "500",
    color: C.text,
  },
  distHa: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 1,
  },
  distKm: {
    fontSize: 14,
    fontWeight: "700",
    color: C.accent,
  },
  distEta: {
    fontSize: 11,
    color: C.textSec,
    marginTop: 1,
  },

  // Satellite info
  satInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  satText: {
    fontSize: 10,
    color: C.textMuted,
  },

  // Empty
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: C.textSec,
    fontWeight: "500",
  },
  emptyHint: {
    fontSize: 12,
    color: C.textMuted,
  },
});