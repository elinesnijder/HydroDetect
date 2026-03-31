// app/(tabs)/mapa.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

export default function MapaScreen() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const webviewRef = useRef<WebView>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      // Pedir permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não foi possível acessar a localização.");
        return;
      }

      // Posição inicial
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      sendLocationToWebview(latitude, longitude);

      // Atualização contínua
      subscriptionRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1, timeInterval: 2000 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          sendLocationToWebview(latitude, longitude);
        }
      );
    })();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  function sendLocationToWebview(lat: number, lng: number) {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify({ lat, lng }));
    }
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      html, body, #map { height: 100%; margin: 0; }
      .popup-content { font-size: 14px; font-weight: bold; }

      /* Marcador do usuário animado */
      .user-marker { position: relative; width: 30px; height: 30px; }
      .user-marker .center {
        width: 12px; height: 12px;
        background: #007bff;
        border: 2px solid white;
        border-radius: 50%;
        position: absolute;
        top: 9px; left: 9px; z-index: 2;
      }
      .user-marker .pulse {
        width: 30px; height: 30px;
        background: rgba(0,123,255,0.3);
        border-radius: 50%;
        position: absolute; top: 0; left: 0;
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(0.5); opacity: 0.6; }
        50% { transform: scale(1.2); opacity: 0.3; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([39.5, -8.0], 6);

      // Tiles OpenStreetMap HOT (sem bloqueio)
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      function getColor(level) {
        if(level >= 70) return 'green';
        if(level >= 40) return 'orange';
        return 'red';
      }

      // Barragens
      const barragens = [
        { name: "Castelo de Bode", lat: 39.5467, lng: -8.3192, level: 78 },
        { name: "Cabril", lat: 39.9308, lng: -8.0861, level: 65 },
        { name: "Alqueva", lat: 38.1972, lng: -7.4944, level: 82 },
        { name: "Aguieira", lat: 40.3428, lng: -8.1978, level: 55 },
        { name: "Alto Rabagão", lat: 41.7167, lng: -7.85, level: 71 }
      ];

      barragens.forEach(b => {
        const icon = L.divIcon({
          html: '<div style="background-color:' + getColor(b.level) + '; width:20px; height:20px; border-radius:50%; border:2px solid white;"></div>',
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        L.marker([b.lat, b.lng], { icon: icon })
          .addTo(map)
          .bindPopup('<div class="popup-content">' + b.name + '<br>Nível: ' + b.level + '%</div>');
      });

      // Incêndio exemplo
      const fogoIcon = L.divIcon({
        html: '<div style="background-color:red; width:24px; height:24px; border-radius:50%; border:2px solid yellow;"></div>',
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([40.3211, -7.6114], { icon: fogoIcon })
        .addTo(map)
        .bindPopup('<div class="popup-content">Incêndio - Serra da Estrela 🔥</div>');

      // Marcador do usuário animado
      var userMarker = null;
      document.addEventListener('message', function(event) {
        const data = JSON.parse(event.data);
        const { lat, lng } = data;

        if(userMarker === null) {
          const userIcon = L.divIcon({
            html: \`
              <div class="user-marker">
                <div class="pulse"></div>
                <div class="center"></div>
              </div>
            \`,
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup("Você está aqui");
          map.setView([lat, lng], 8);
        } else {
          userMarker.setLatLng([lat, lng]);
          map.panTo([lat, lng]);
        }
      });
    </script>
  </body>
  </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});