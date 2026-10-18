import { YouTubeVideoItem, YouTubeSubscriptionItem, YouTubePlaylistItem } from "./types";

export interface DemoProfile {
  id: string;
  name: string;
  displayName: string;
  handle: string;
  avatarUrl: string;
  description: string;
  videos: YouTubeVideoItem[];
  subscriptions: YouTubeSubscriptionItem[];
  playlists: YouTubePlaylistItem[];
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "brainrot-doomscroller",
    name: "The 3 AM Brainrot Doomscroller",
    displayName: "SkibidiScroll99",
    handle: "@dopamine_demon",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces",
    description: "Subway Surfers splitscreen, screaming streamers, and 7-second attention span.",
    videos: [
      { id: "v1", title: "When the NPC tries to out-rizz the Gyatt in Ohio", channelTitle: "MemeCentral", channelId: "c1", categoryId: "23", durationSeconds: 38 },
      { id: "v2", title: "Subway Surfers satisfying gameplay with Reddit stories", channelTitle: "DailyBrainrot", channelId: "c2", categoryId: "24", durationSeconds: 52 },
      { id: "v3", title: "I survived 100 days trapped in a giant gold vault", channelTitle: "MrBeast", channelId: "c3", categoryId: "24", durationSeconds: 1200 },
      { id: "v4", title: "Speed barks at a dog in Minecraft VR", channelTitle: "IShowSpeed", channelId: "c4", categoryId: "20", durationSeconds: 45 },
      { id: "v5", title: "Soap cutting ASMR compilation to calm your existential dread", channelTitle: "OddlySatisfying", channelId: "c5", categoryId: "24", durationSeconds: 49 },
      { id: "v6", title: "Kai Cenat breaks his desk after losing in Elden Ring", channelTitle: "Kai Cenat Live", channelId: "c6", categoryId: "20", durationSeconds: 59 },
      { id: "v7", title: "Why Minecraft sand falling physics will cure your insomnia", channelTitle: "SatisfyMe", channelId: "c7", categoryId: "20", durationSeconds: 32 },
      { id: "v8", title: "Family Guy funniest moments compilation #487", channelTitle: "ClipMaster", channelId: "c8", categoryId: "23", durationSeconds: 55 },
      { id: "v9", title: "Gordan Ramsay yells at an undercooked donut for 10 minutes", channelTitle: "ChefClips", channelId: "c9", categoryId: "24", durationSeconds: 610 },
      { id: "v10", title: "POV: You forgot to study for tomorrow's final exam at 4 AM", channelTitle: "RelatableShorts", channelId: "c10", categoryId: "23", durationSeconds: 22 },
      { id: "v11", title: "GTA 5 ramp stunts with floating cars and slime ASMR", channelTitle: "DailyBrainrot", channelId: "c2", categoryId: "24", durationSeconds: 41 },
      { id: "v12", title: "Hydraulic press crushes 50 iPhones at once", channelTitle: "CrushLab", channelId: "c11", categoryId: "24", durationSeconds: 58 },
    ],
    subscriptions: [
      { id: "s1", title: "MrBeast", description: "I do crazy challenges" },
      { id: "s2", title: "IShowSpeed", description: "Streaming and gaming" },
      { id: "s3", title: "Kai Cenat Live", description: "AMP streams" },
      { id: "s4", title: "DailyBrainrot", description: "Satisfying clips and memes" },
      { id: "s5", title: "MemeCentral", description: "Top internet humor" },
      { id: "s6", title: "TikTok Re-Uploads 24/7", description: "The algorithm feeds you" },
    ],
    playlists: [
      { id: "p1", title: "Videos to watch when insomnia hits", itemCount: 142, sampleVideoTitles: ["Oddly satisfying soap", "Speed screams", "Family Guy clips"] },
      { id: "p2", title: "Vibes only no thinking", itemCount: 88, sampleVideoTitles: ["GTA ramp stunts", "Hydraulic press"] },
      { id: "p3", title: "Watch later (never opened)", itemCount: 954, sampleVideoTitles: ["How to fix your attention span", "Start an online business in 2024"] },
    ],
  },
  {
    id: "tech-hustle-bro",
    name: "The 5 AM Cold-Shower Hustle Bro",
    displayName: "ChadOptimizer",
    handle: "@biohack_billionaire",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
    description: "Cold plunges, dopamine detox protocols, and buying courses to learn how to sell courses.",
    videos: [
      { id: "tv1", title: "How I wake up at 4:30 AM, drink salt water and dominate the market", channelTitle: "Alex Hormozi", channelId: "tc1", categoryId: "27", durationSeconds: 1540 },
      { id: "tv2", title: "Dr. Andrew Huberman: The Optimal Dopamine Reset Protocol", channelTitle: "Huberman Lab", channelId: "tc2", categoryId: "28", durationSeconds: 7800 },
      { id: "tv3", title: "Why 99% of Software Engineers will be replaced by AI in 6 months", channelTitle: "TechLead", channelId: "tc3", categoryId: "28", durationSeconds: 840 },
      { id: "tv4", title: "Lex Fridman Podcast #420: Physics, Consciousness, and AI Aliens", channelTitle: "Lex Fridman", channelId: "tc4", categoryId: "27", durationSeconds: 11400 },
      { id: "tv5", title: "Sam Altman: The Future of Compute and Energy", channelTitle: "Y Combinator", channelId: "tc5", categoryId: "28", durationSeconds: 2400 },
      { id: "tv6", title: "Day in the life of a FAANG Senior Staff Engineer earning $850k", channelTitle: "SiliconValleyVibes", channelId: "tc6", categoryId: "22", durationSeconds: 920 },
      { id: "tv7", title: "Never touch carbs before 2 PM: Neurobiology of Ketosis", channelTitle: "Huberman Lab", channelId: "tc2", categoryId: "28", durationSeconds: 4500 },
      { id: "tv8", title: "The $100M Offer Playbook: Break down of acquisition funnels", channelTitle: "Alex Hormozi", channelId: "tc1", categoryId: "27", durationSeconds: 1800 },
    ],
    subscriptions: [
      { id: "ts1", title: "Huberman Lab", description: "Neuroscience and science-based tools" },
      { id: "ts2", title: "Alex Hormozi", description: "Business growth and monetization" },
      { id: "ts3", title: "Lex Fridman", description: "Conversations on tech and science" },
      { id: "ts4", title: "Y Combinator", description: "Startup advice and founder stories" },
      { id: "ts5", title: "TechLead", description: "Former tech lead discusses software" },
    ],
    playlists: [
      { id: "tp1", title: "Morning 5 AM Mindset Routine", itemCount: 28, sampleVideoTitles: ["Huberman protocol", "Cold shower science"] },
      { id: "tp2", title: "Startup Grind: $10M ARR or Bust", itemCount: 64, sampleVideoTitles: ["SaaS scaling secrets", "YC pitch teardowns"] },
    ],
  },
  {
    id: "escapist-nostalgia-gamer",
    name: "The Cozy Nostalgia Escapist",
    displayName: "PixelDreamer",
    handle: "@lofi_nightowl",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces",
    description: "4-hour video game retrospectives, lo-fi beats, and rewatching 2012 Minecraft playthroughs.",
    videos: [
      { id: "nv1", title: "lofi hip hop radio - beats to relax/study to", channelTitle: "Lofi Girl", channelId: "nc1", categoryId: "10", durationSeconds: 86400 },
      { id: "nv2", title: "Why Skyrim's ambient music makes you cry 13 years later", channelTitle: "Noclip", channelId: "nc2", categoryId: "20", durationSeconds: 2800 },
      { id: "nv3", title: "Minecraft Soundtrack (C418) Full Album for Cozy Rainy Nights", channelTitle: "ChillVibes", channelId: "nc3", categoryId: "10", durationSeconds: 5400 },
      { id: "nv4", title: "A 4-Hour Retrospective on why The Simpsons Hit & Run was a masterpiece", channelTitle: "DeepDiveGames", channelId: "nc4", categoryId: "20", durationSeconds: 14400 },
      { id: "nv5", title: "Building a cozy Japanese cabin in Animal Crossing with rain sounds", channelTitle: "CozyCozy", channelId: "nc5", categoryId: "20", durationSeconds: 2100 },
      { id: "nv6", title: "Nintendo Direct 2026 Reactions: Where is Silksong?!", channelTitle: "IGN", channelId: "nc6", categoryId: "20", durationSeconds: 1800 },
    ],
    subscriptions: [
      { id: "ns1", title: "Lofi Girl", description: "Peaceful music 24/7" },
      { id: "ns2", title: "DeepDiveGames", description: "Multi-hour documentary video essays" },
      { id: "ns3", title: "Noclip", description: "Video game history and documentaries" },
      { id: "ns4", title: "CozyCozy", description: "Relaxing gaming playthroughs" },
    ],
    playlists: [
      { id: "np1", title: "Sleep & Rainy Day Background", itemCount: 45, sampleVideoTitles: ["Skyrim ambiance", "Minecraft C418", "Lofi beats"] },
      { id: "np2", title: "4-hour long essays to fall asleep to", itemCount: 22, sampleVideoTitles: ["Simpsons Hit & Run retrospective", "Fallout lore"] },
    ],
  },
];
