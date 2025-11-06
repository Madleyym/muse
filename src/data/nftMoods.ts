export interface NFTMood {
  id: string;
  name: string;
  category: "free" | "pro";
  baseImage: string;
  ogImage: string; 
  gradients: {
    from: string;
    via?: string;
    to: string;
  }[];
  description: string;
}

export const nftMoods: NFTMood[] = [

  {
    id: "chaos-energy",
    name: "Chaos Energy",
    category: "pro",
    baseImage: "/assets/images/Pro/chaos-energy.png",
    ogImage: "/og/chaos-energy.png", // ✅ TAMBAH
    gradients: [
      { from: "#FF0066", via: "#CC00FF", to: "#6600CC" },
      { from: "#FF0099", via: "#FF00FF", to: "#9900FF" },
      { from: "#FF1493", via: "#FF00CC", to: "#CC00FF" },
      { from: "#FF0080", via: "#DD00DD", to: "#AA00FF" },
      { from: "#FF006E", via: "#EE00AA", to: "#8800FF" },
      { from: "#FF0055", via: "#FF00DD", to: "#7700DD" },
      { from: "#EE0077", via: "#FF00FF", to: "#9900DD" },
      { from: "#FF0088", via: "#CC00CC", to: "#6600AA" },
      { from: "#FF0099", via: "#DD00FF", to: "#8800CC" },
      { from: "#FF1493", via: "#FF00AA", to: "#AA00FF" },
    ],
    description: "Explosive chaotic energy with uncontrollable vibes",
  },
  {
    id: "chaostic-expression",
    name: "Chaostic Expression",
    category: "pro",
    baseImage: "/assets/images/Pro/chaostic-expression.png",
    ogImage: "/og/chaostic-expression.png", // ✅ TAMBAH
    gradients: [
      { from: "#FF1493", via: "#FF0099", to: "#DD00DD" },
      { from: "#FF69B4", via: "#FF1493", to: "#CC00FF" },
      { from: "#FF00FF", via: "#FF0099", to: "#AA00EE" },
      { from: "#FF006E", via: "#FF1493", to: "#9900DD" },
      { from: "#FF0088", via: "#FF00CC", to: "#8800CC" },
      { from: "#FF1493", via: "#EE0099", to: "#BB00DD" },
      { from: "#FF69B4", via: "#FF00AA", to: "#9900FF" },
      { from: "#FF00FF", via: "#FF1493", to: "#7700BB" },
      { from: "#FF0066", via: "#FF00BB", to: "#AA00EE" },
      { from: "#FF006E", via: "#FF0088", to: "#8800FF" },
    ],
    description: "Joyful chaotic expression with vibrant pink energy",
  },
  {
    id: "creative-mind",
    name: "Creative Mind",
    category: "pro",
    baseImage: "/assets/images/Pro/creative-mind.png",
    ogImage: "/og/creative-mind.png", // ✅ TAMBAH
    gradients: [
      { from: "#FF0000", via: "#FFFF00", to: "#0000FF" },
      { from: "#FF00FF", via: "#00FFFF", to: "#FFFF00" },
      { from: "#FF0066", via: "#00FF99", to: "#0066FF" },
      { from: "#FF0080", via: "#FFD700", to: "#00CCFF" },
      { from: "#FF006E", via: "#FFBE0B", to: "#0099FF" },
      { from: "#FF0000", via: "#00FF00", to: "#0000FF" },
      { from: "#FF00FF", via: "#FFFF00", to: "#00FFFF" },
      { from: "#FF1493", via: "#00FF88", to: "#0080FF" },
      { from: "#FF0088", via: "#FFCC00", to: "#0066CC" },
      { from: "#FF006E", via: "#00FFAA", to: "#0099DD" },
    ],
    description: "Full spectrum creative energy with rainbow vibes",
  },
  {
    id: "fire-starter",
    name: "Fire Starter",
    category: "pro",
    baseImage: "/assets/images/Pro/fire-starter.png",
    ogImage: "/og/fire-starter.png", // ✅ TAMBAH
    gradients: [
      { from: "#FFFF00", via: "#FF6600", to: "#FF0000" },
      { from: "#FFD700", via: "#FF4500", to: "#DD0000" },
      { from: "#FFA500", via: "#FF3300", to: "#BB0000" },
      { from: "#FFDD00", via: "#FF5500", to: "#CC0000" },
      { from: "#FFEE00", via: "#FF4400", to: "#AA0000" },
      { from: "#FFD700", via: "#FF6600", to: "#EE0000" },
      { from: "#FFA500", via: "#FF2200", to: "#990000" },
      { from: "#FFCC00", via: "#FF5500", to: "#DD0000" },
      { from: "#FFFF00", via: "#FF3D00", to: "#BB0000" },
      { from: "#FFD700", via: "#FF4500", to: "#CC0000" },
    ],
    description: "Intense fire energy with burning passion",
  },
  {
    id: "green-peace",
    name: "Green Peace",
    category: "pro",
    baseImage: "/assets/images/Pro/green-peace.png",
    ogImage: "/og/green-peace.png", // ✅ TAMBAH
    gradients: [
      { from: "#AAFF00", via: "#00DD00", to: "#006600" },
      { from: "#99FF00", via: "#00FF00", to: "#008800" },
      { from: "#88FF00", via: "#00EE00", to: "#005500" },
      { from: "#77FF00", via: "#00CC00", to: "#007700" },
      { from: "#00FF77", via: "#00DD55", to: "#004400" },
      { from: "#AAFF00", via: "#00FF00", to: "#006600" },
      { from: "#99EE00", via: "#00DD00", to: "#008800" },
      { from: "#00FF99", via: "#00CC66", to: "#005500" },
      { from: "#88FF00", via: "#00EE00", to: "#007700" },
      { from: "#AAFF00", via: "#00FF33", to: "#006600" },
    ],
    description: "Peaceful nature vibes with eco-friendly energy",
  },
  {
    id: "moon-mission",
    name: "Moon Mission",
    category: "pro",
    baseImage: "/assets/images/Pro/moon-mission.png",
    ogImage: "/og/moon-mission.png", // ✅ TAMBAH
    gradients: [
      { from: "#00FFFF", via: "#0088FF", to: "#000088" },
      { from: "#00DDFF", via: "#0066FF", to: "#000066" },
      { from: "#00EEFF", via: "#0099FF", to: "#000099" },
      { from: "#00FFFF", via: "#00AAFF", to: "#0000AA" },
      { from: "#00CCFF", via: "#0077FF", to: "#000077" },
      { from: "#00FFFF", via: "#0099EE", to: "#000088" },
      { from: "#00DDFF", via: "#00BBFF", to: "#0000BB" },
      { from: "#00EEFF", via: "#0066EE", to: "#000066" },
      { from: "#00FFFF", via: "#0088DD", to: "#000099" },
      { from: "#00CCFF", via: "#0099FF", to: "#0000CC" },
    ],
    description: "Cosmic moon mission with space explorer vibes",
  },
  {
    id: "morning-mom",
    name: "Morning Mom",
    category: "pro",
    baseImage: "/assets/images/Pro/morning-mom.png",
    ogImage: "/og/morning-mom.png", // ✅ TAMBAH
    gradients: [
      { from: "#FFDD00", via: "#FF6600", to: "#FF1493" },
      { from: "#FFD700", via: "#FF7700", to: "#FF0099" },
      { from: "#FFCC00", via: "#FF8800", to: "#FF00AA" },
      { from: "#FFEE00", via: "#FF9900", to: "#FF0088" },
      { from: "#FFD700", via: "#FF6600", to: "#FF1493" },
      { from: "#FFBB00", via: "#FF7700", to: "#FF00BB" },
      { from: "#FFCC00", via: "#FF8800", to: "#FF0077" },
      { from: "#FFE500", via: "#FF9900", to: "#FF0099" },
      { from: "#FFD700", via: "#FF7700", to: "#FF00AA" },
      { from: "#FFDD00", via: "#FF8800", to: "#FF1493" },
    ],
    description: "Cheerful morning energy with sunrise vibes",
  },
  {
    id: "mysterious",
    name: "Mysterious",
    category: "pro",
    baseImage: "/assets/images/Pro/mysterious.png",
    ogImage: "/og/mysterious.png", // ✅ TAMBAH
    gradients: [
      { from: "#EEEEFF", via: "#9966FF", to: "#00FFFF" },
      { from: "#DDDDFF", via: "#AA77FF", to: "#00DDFF" },
      { from: "#CCCCFF", via: "#8855EE", to: "#00EEFF" },
      { from: "#F5F5FF", via: "#BB88FF", to: "#00FFFF" },
      { from: "#EEEEFF", via: "#9966DD", to: "#00CCFF" },
      { from: "#DDDDFF", via: "#AA88EE", to: "#00FFFF" },
      { from: "#CCCCFF", via: "#8877DD", to: "#00DDFF" },
      { from: "#F0F0FF", via: "#9988EE", to: "#00EEFF" },
      { from: "#EEEEFF", via: "#AA77FF", to: "#00CCFF" },
      { from: "#DDDDFF", via: "#AA88DD", to: "#00FFFF" },
    ],
    description: "Ethereal mystery with ghostly spiritual vibes",
  },
  {
    id: "ocean-lady",
    name: "Ocean Lady",
    category: "pro",
    baseImage: "/assets/images/Pro/ocean-lady.png",
    ogImage: "/og/ocean-lady.png", // ✅ TAMBAH
    gradients: [
      { from: "#00FFFF", via: "#0088CC", to: "#001155" },
      { from: "#00EEFF", via: "#0066AA", to: "#000088" },
      { from: "#00DDFF", via: "#0077BB", to: "#001166" },
      { from: "#00FFFF", via: "#00AADD", to: "#000099" },
      { from: "#00CCFF", via: "#0099DD", to: "#001177" },
      { from: "#00EEFF", via: "#0088BB", to: "#000088" },
      { from: "#00DDFF", via: "#00AACC", to: "#001166" },
      { from: "#00FFFF", via: "#0066AA", to: "#000099" },
      { from: "#00FFFF", via: "#0099EE", to: "#001155" },
      { from: "#00CCFF", via: "#0088CC", to: "#000077" },
    ],
    description: "Deep ocean vibes with mermaid energy",
  },
  {
    id: "pink-to-rose",
    name: "Pink to Rose",
    category: "pro",
    baseImage: "/assets/images/Pro/pink-to-rose.png",
    ogImage: "/og/pink-to-rose.png", // ✅ TAMBAH
    gradients: [
      { from: "#FFB6C1", via: "#FF1493", to: "#880055" },
      { from: "#FFC0CB", via: "#FF0099", to: "#CC0077" },
      { from: "#FF69B4", via: "#FF0088", to: "#990066" },
      { from: "#FFB3D9", via: "#FF0077", to: "#880044" },
      { from: "#FFC0CB", via: "#FF1493", to: "#AA0066" },
      { from: "#FF99CC", via: "#FF0099", to: "#CC0088" },
      { from: "#FFB6C1", via: "#FF0088", to: "#AA0055" },
      { from: "#FFA6C9", via: "#FF0077", to: "#880044" },
      { from: "#FF91A4", via: "#FF0099", to: "#660033" },
      { from: "#FFC0CB", via: "#FF00AA", to: "#990055" },
    ],
    description: "Romantic lovely vibes with sweet pink energy",
  },
  {
    id: "relaxed-mode",
    name: "Relaxed Mode",
    category: "pro",
    baseImage: "/assets/images/Pro/relaxed-mode.png",
    ogImage: "/og/relaxed-mode.png", // ✅ TAMBAH
    gradients: [
      { from: "#99DDFF", via: "#AA88FF", to: "#DD99FF" },
      { from: "#AADDFF", via: "#9966FF", to: "#EE99FF" },
      { from: "#BBDDFF", via: "#AA77EE", to: "#DDAAFF" },
      { from: "#99CCFF", via: "#BB99FF", to: "#DD99EE" },
      { from: "#99DDFF", via: "#9977DD", to: "#EE99EE" },
      { from: "#BBCCFF", via: "#AA88FF", to: "#EEAAFF" },
      { from: "#AADDFF", via: "#CC88FF", to: "#EE99EE" },
      { from: "#99CCFF", via: "#9966CC", to: "#DD99DD" },
      { from: "#AADDFF", via: "#DD77FF", to: "#EEAAFF" },
      { from: "#BBDDFF", via: "#AA77DD", to: "#EE99EE" },
    ],
    description: "Chill relaxed vibes with zen peaceful energy",
  },

  // ========== FREE MOOD ==========
  {
    id: "art-free",
    name: "Art Free",
    category: "free",
    baseImage: "/assets/images/Free/art-free.png",
    ogImage: "/og/art-free.png", // ✅ TAMBAH
    gradients: [
      { from: "#FFD700", via: "#FFA500", to: "#FF6347" },
      { from: "#FF6B6B", via: "#FFB347", to: "#FFEE66" },
      { from: "#44DDCC", via: "#44AA88", to: "#556677" },
      { from: "#AAFF99", via: "#55DD88", to: "#33DD77" },
      { from: "#FF88AA", via: "#EE6688", to: "#CC5577" },
      { from: "#99EEDD", via: "#66BB99", to: "#33AA99" },
      { from: "#FF7777", via: "#DD5555", to: "#AA4455" },
      { from: "#FFDD99", via: "#FFAA77", to: "#FF7766" },
      { from: "#BB99DD", via: "#9977CC", to: "#8866BB" },
      { from: "#EE99EE", via: "#BB88CC", to: "#9966AA" },
    ],
    description: "Creative expression with artistic flair",
  },
];

// ========== GALLERY NFT INTERFACE & GENERATOR ==========

export interface GalleryNFT {
  id: number;
  moodId: string;
  name: string;
  baseImage: string;
  mood: NFTMood; // Full mood object with all gradients
  category: "free" | "pro";
  price: string; // Display format: "FREE" or "0.001 ETH"
  priceValue?: number; // Numeric value for sorting/filtering
  author: string;
  time: string;
  minted: string;
}

export const generateGalleryData = (count: number = 100): GalleryNFT[] => {
  const data: GalleryNFT[] = [];
  let idCounter = 1;

  // Shuffle moods untuk variasi
  const shuffledMoods = [...nftMoods].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const mood = shuffledMoods[i % shuffledMoods.length];

    data.push({
      id: idCounter,
      moodId: mood.id,
      name: mood.name,
      baseImage: mood.baseImage,
      mood: mood, // Simpan full mood object
      category: mood.category,
      price: mood.category === "free" ? "FREE" : "0.001 ETH", // Format: "0.001 ETH"
      priceValue: mood.category === "free" ? 0 : 0.001, // Numeric value
      author: `@user${Math.floor(Math.random() * 1000)}`,
      time: `${Math.floor(Math.random() * 10) + 1}${
        ["h", "d"][Math.floor(Math.random() * 2)]
      } ago`,
      minted: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });

    idCounter++;
  }

  // Sort by minted date (newest first)
  return data.sort(
    (a, b) => new Date(b.minted).getTime() - new Date(a.minted).getTime()
  );
};
