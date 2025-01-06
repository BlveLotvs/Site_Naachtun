document.addEventListener('DOMContentLoaded', function () {
    var mindmapData = {
        name: "Projet Naachtun : Dynamiques Mayas",
        children: [
            {
                name: "Contexte Général",
                children: [
                    {
                        name: "Dynamiques environnementales et patrimoniales",
                        children: [
                            { name: "Forêt tropicale dense" },
                            { name: "Zones humides (bajos)" },
                            { name: "Zones élevées (uplands)" }
                        ]
                    },
                    {
                        name: "Objectifs de recherche",
                        children: [
                            { name: "Cartographie des aménagements hydrauliques" },
                            { name: "Analyse des dynamiques socio-environnementales" },
                            { name: "Étude des impacts climatiques sur les ressources" }
                        ]
                    },
                    {
                        name: "Problématique",
                        children: [
                            { name: "Comment valoriser les vestiges socio-écologiques avec le LIDAR et les satellites ?" }
                        ]
                    }
                ]
            },
            {
                name: "Méthodologie et Traitements",
                children: [
                    {
                        name: "Données d'acquisition",
                        children: [
                            { name: "LiDAR (135 km², 400-500 km²)" },
                            { name: "Images Satellites (JAXA, Sentinel-2)" }
                        ]
                    },
                    {
                        name: "Étapes des traitements",
                        children: [
                            {
                                name: "Prétraitement des données",
                                children: [
                                    { name: "Remplissage des zones sans données" },
                                    { name: "Réechantillonnage à 1m (JAXA)" },
                                    { name: "Alignement des coordonnées (UTM16)" }
                                ]
                            },
                            {
                                name: "Analyse spatiale",
                                children: [
                                    {
                                        name: "Indices topographiques",
                                        children: [
                                            { name: "MRVBF" },
                                            { name: "TWI" },
                                            { name: "Pentes (SAGA)" }
                                        ]
                                    },
                                    {
                                        name: "Indices de végétation",
                                        children: [
                                            { name: "NDWI" },
                                            { name: "NDVI" }
                                        ]
                                    },
                                    {
                                        name: "Hydrologie",
                                        children: [
                                            { name: "Bassins versants" },
                                            { name: "Réseaux hydrographiques" }
                                        ]
                                    }
                                ]
                            },
                            {
                                name: "Visualisation des résultats",
                                children: [
                                    { name: "Ombrage et multi-ombrage" },
                                    { name: "Red Relief Image Model (RRIM)" },
                                    { name: "Sky-View Factor" },
                                    { name: "Positive/Negative Openness" }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "Résultats attendus",
                children: [
                    { name: "Cartographie des zones basses et planes" },
                    { name: "Analyse des dynamiques hydrologiques" },
                    { name: "Identification des aménagements hydrauliques" },
                    { name: "Comparaison entre données LiDAR et JAXA" }
                ]
            },
            {
                name: "Livrables",
                children: [
                    { name: "Cartes (indices et analyses)" },
                    { name: "Rapport méthodologique" },
                    { name: "Polygones sur site web" }
                ]
            }
        ]
    };

    const width = 1200;
    const height = 800;

    const svg = d3.select("#mindmap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const treeLayout = d3.tree().size([height, width - 200]);

    const root = d3.hierarchy(mindmapData);
    treeLayout(root);

    const g = svg.append("g").attr("transform", "translate(100,0)");

    const zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .on("zoom", function (event) {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);

    g.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
        .style("fill", "none")
        .style("stroke", "#ccc")
        .style("stroke-width", 2);

    const node = g.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("r", 5)
        .style("fill", "steelblue");

    node.append("text")
        .attr("dy", 3)
        .attr("x", d => d.children ? -10 : 10)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);
});

