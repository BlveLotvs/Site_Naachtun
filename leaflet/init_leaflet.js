document.addEventListener('DOMContentLoaded', function () {
    // Initialiser la carte centrée sur Naachtun
    var map = L.map('map').setView([17.765009, -89.608497], 8);

    // Fond de carte OpenStreetMap
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
    });
    


   // Ajout du contrôle pour basculer entre les fonds
   var baseMaps = {
    "OpenStreetMap": osmLayer,
    "GoogleSatellite":googleSatellite
};

L.control.layers(baseMaps).addTo(map);




    // Charger l'icône SVG de manière asynchrone et créer des icônes personnalisées
    fetch('leaflet/icons/map-pin.svg')
        .then(response => response.text())
        .then(svgText => {
            // Modifier la couleur des SVG et créer des icônes personnalisées
            const createCustomIcon = (color, size) => {
                const coloredSvg = svgText.replace('<svg', `<svg style="fill: ${color};"`);
                return L.divIcon({
                    html: coloredSvg,
                    className: '',
                    iconSize: [size, size],
                    iconAnchor: [size / 2, size],
                    popupAnchor: [0, -size]
                });
            };

            // Créer des icônes avec des couleurs et tailles différentes
            const naachtunIcon = createCustomIcon('orange', 50); // Taille plus grande pour Naachtun
            const rang1Icon = createCustomIcon('red', 30);
            const rang2Icon = createCustomIcon('blue', 30);

            // Charger le site principal de Naachtun avec une icône personnalisée
            var naachtunMarker = L.geoJSON(null, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: naachtunIcon });
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(`Site : ${feature.properties.Name || 'Nom non disponible'}`);
                }
            });

            fetch('leaflet/data_geojson/site_naachtun.geojson')
                .then(response => response.json())
                .then(data => {
                    naachtunMarker.addData(data).addTo(map);
                })
                .catch(err => console.error('Erreur lors du chargement du site de Naachtun GeoJSON :', err));

            // Charger les points de rang 1 avec une icône personnalisée
            var rang1Layer = L.geoJSON(null, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: rang1Icon });
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(`Site de rang 1 : ${feature.properties.Name || 'Nom non disponible'}`);
                }
            });

            fetch('leaflet/data_geojson/rang1.geojson')
                .then(response => response.json())
                .then(data => {
                    rang1Layer.addData(data).addTo(map);
                })
                .catch(err => console.error('Erreur lors du chargement des points de rang 1 GeoJSON :', err));

            // Charger les points de rang 2 avec une icône personnalisée
            var rang2Layer = L.geoJSON(null, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: rang2Icon });
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(`Site de rang 2 : ${feature.properties.Name || 'Nom non disponible'}`);
                }
            });

            fetch('leaflet/data_geojson/rang2.geojson')
                .then(response => response.json())
                .then(data => {
                    rang2Layer.addData(data).addTo(map);
                })
                .catch(err => console.error('Erreur lors du chargement des points de rang 2 GeoJSON :', err));

            // Charger les zones depuis le fichier GeoJSON des polygones
            fetch('leaflet/data_geojson/Polygone.geojson')
                .then(response => response.json())
                .then(data => {
                    var geoJsonLayer = L.geoJSON(data, {
                        style: function (feature) {
                            const colors = {
                                '1': 'red',
                                '2': 'blue',
                                '3': 'green',
                            };
                            return {
                                color: colors[feature.properties.Echelle],
                                weight: 2,
                                fillOpacity: 0.1
                            };
                        },
                        onEachFeature: function (feature, layer) {
                            layer.bindPopup(`Zone : ${feature.properties.Echelle}<br>Donnée : ${feature.properties.Data}`);
                        }
                    }).addTo(map);

                    // Ajouter la couche au contrôle une fois qu'elle est disponible
                    overlays["Zones GeoJSON"] = geoJsonLayer;
                    controlLayers.addOverlay(geoJsonLayer, "Zones GeoJSON");
                })
                .catch(err => console.error('Erreur lors du chargement des GeoJSON des zones :', err));

            // Contrôle des couches
            var overlays = {
                "Site principal Naachtun": naachtunMarker,
                "Sites de rang 1": rang1Layer,
                "Sites de rang 2": rang2Layer
            };
            var controlLayers = L.control.layers(null, overlays).addTo(map);

            // Ajouter la légende avec les SVG personnalisés
            var legend = L.control({ position: 'bottomright' });
            legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'map-legend');
                div.innerHTML += '<h4>Légende</h4>';

                // Légende pour Naachtun
                let naachtunSvg = svgText.replace('<svg', `<svg style="fill: orange;" width="25" height="25"`);
                div.innerHTML += `<div>${naachtunSvg} Site principal de Naachtun</div>`;

                // Légende pour rang 1
                let rang1Svg = svgText.replace('<svg', `<svg style="fill: red;" width="25" height="25"`);
                div.innerHTML += `<div>${rang1Svg} Site de rang 1</div>`;

                // Légende pour rang 2
                let rang2Svg = svgText.replace('<svg', `<svg style="fill: blue;" width="25" height="25"`);
                div.innerHTML += `<div>${rang2Svg} Site de rang 2</div>`;

                // Légende pour les polygones
                div.innerHTML += '<div><span style="background-color: red; display:inline-block; width: 15px; height: 15px;"></span> Zone Échelle 1 (Img LiDAR)</div>';
                div.innerHTML += '<div><span style="background-color: blue; display:inline-block; width: 15px; height: 15px;"></span> Zone Échelle 2 (Img sat)</div>';
                div.innerHTML += '<div><span style="background-color: green; display:inline-block; width: 15px; height: 15px;"></span> Zone Échelle 3 (Img sat)</div>';
                return div;
            };
            legend.addTo(map);
        })
        .catch(err => console.error('Erreur lors du chargement de l\'icône SVG :', err));
});


