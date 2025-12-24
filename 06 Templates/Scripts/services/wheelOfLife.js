const categories = {
    "career": "Career",
    "health": "Workout",
    "growth": "Growth",
    "recreation": "Recreation",
    "social": "Social"
};

const colors = {
    "career": "rgba(255, 99, 132, 0.6)",
    "health": "rgba(75, 192, 192, 0.6)",
    "growth": "rgba(54, 162, 235, 0.6)",
    "recreation": "rgba(255, 206, 86, 0.6)",
    "social": "rgba(153, 102, 255, 0.6)"
};

const borders = {
    "career": "rgba(255, 99, 132, 1)",
    "health": "rgba(75, 192, 192, 1)",
    "growth": "rgba(54, 162, 235, 1)",
    "recreation": "rgba(255, 206, 86, 1)",
    "social": "rgba(153, 102, 255, 1)"
};

module.exports = {
    getCategories: () => categories,
    getLabels: () => Object.values(categories),
    getKeys: () => Object.keys(categories),
    getAllColors: () => Object.keys(categories).map(k => colors[k]),
    getAllBorders: () => Object.keys(categories).map(k => borders[k]),
    getColor: (k) => colors[k] || "rgba(200,200,200,0.5)",
    getBorder: (k) => borders[k] || "rgba(200,200,200,1)"
};