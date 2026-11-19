import React, { useState } from 'react';
import { 
  Search, Sprout, Bug, Droplets, CloudSun, Mountain, Lightbulb, 
  ChevronRight, ExternalLink, Filter 
} from 'lucide-react';
import { 
  CROP_DATA, FERTILIZER_DATA, PEST_DATA, 
  IRRIGATION_DATA, WEATHER_DATA, SOIL_DATA, FARMING_TIPS 
} from '../ruleEngine';

interface KnowledgeExplorerViewProps {
  onAskQuestion: (query: string) => void;
}

export const KnowledgeExplorerView: React.FC<KnowledgeExplorerViewProps> = ({ onAskQuestion }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: '🌟' },
    { id: 'crops', label: 'Crops', icon: '🌾' },
    { id: 'fertilizers', label: 'Fertilizers', icon: '🧪' },
    { id: 'pests', label: 'Pests & Diseases', icon: '🐛' },
    { id: 'irrigation', label: 'Irrigation', icon: '💧' },
    { id: 'weather', label: 'Weather', icon: '🌦️' },
    { id: 'soil', label: 'Soils & Testing', icon: '🧱' },
    { id: 'tips', label: 'Farming Tips', icon: '💡' },
  ];

  // Compile all knowledge entries into searchable cards
  const allCards = [
    // Crops
    ...Object.entries(CROP_DATA).map(([key, data]) => ({
      id: `crop-${key}`,
      category: 'crops',
      categoryLabel: 'Crop Information',
      title: data.title,
      icon: data.icon,
      content: data.text,
      sampleQuery: `Tell me about ${key} crop`
    })),
    // Fertilizers
    {
      id: 'fert-rice',
      category: 'fertilizers',
      categoryLabel: 'Fertilizer Guidance',
      title: 'Rice Fertilizer Management',
      icon: '🌾',
      content: FERTILIZER_DATA.rice,
      sampleQuery: 'Which fertilizer is good for rice?'
    },
    {
      id: 'fert-wheat',
      category: 'fertilizers',
      categoryLabel: 'Fertilizer Guidance',
      title: 'Wheat Balanced NPK Dose',
      icon: '🌾',
      content: FERTILIZER_DATA.wheat,
      sampleQuery: 'What fertilizer to use for wheat?'
    },
    {
      id: 'fert-tomato',
      category: 'fertilizers',
      categoryLabel: 'Fertilizer Guidance',
      title: 'Tomato Nutrition & Calcium',
      icon: '🍅',
      content: FERTILIZER_DATA.tomato,
      sampleQuery: 'Tomato fertilizer recommendations'
    },
    {
      id: 'fert-organic',
      category: 'fertilizers',
      categoryLabel: 'Fertilizer Guidance',
      title: 'Organic Manure & Biofertilizers',
      icon: '🌿',
      content: FERTILIZER_DATA.organic,
      sampleQuery: 'Tell me about organic fertilizers'
    },
    {
      id: 'fert-compost',
      category: 'fertilizers',
      categoryLabel: 'Fertilizer Guidance',
      title: 'Compost Making (60-90 Days)',
      icon: '🍂',
      content: FERTILIZER_DATA.compost,
      sampleQuery: 'How to make organic compost?'
    },
    // Pests
    {
      id: 'pest-tomato',
      category: 'pests',
      categoryLabel: 'Pest & Disease Control',
      title: 'Tomato Pests & Leaf Curl Control',
      icon: '🍅',
      content: PEST_DATA.tomato,
      sampleQuery: 'How can I control pests in tomato plants?'
    },
    {
      id: 'pest-rice',
      category: 'pests',
      categoryLabel: 'Pest & Disease Control',
      title: 'Rice Stem Borer & Blast Care',
      icon: '🌾',
      content: PEST_DATA.rice,
      sampleQuery: 'Rice stem borer and blast control'
    },
    {
      id: 'pest-wheat',
      category: 'pests',
      categoryLabel: 'Pest & Disease Control',
      title: 'Wheat Rust & Aphid Protection',
      icon: '🌾',
      content: PEST_DATA.wheat,
      sampleQuery: 'Wheat rust prevention'
    },
    {
      id: 'pest-general',
      category: 'pests',
      categoryLabel: 'Pest & Disease Control',
      title: 'Integrated Pest Management (IPM)',
      icon: '🐛',
      content: PEST_DATA.general,
      sampleQuery: 'General pest management and neem oil'
    },
    // Irrigation
    {
      id: 'irr-drip',
      category: 'irrigation',
      categoryLabel: 'Irrigation Guidance',
      title: 'Drip Irrigation & Water Savings',
      icon: '💧',
      content: IRRIGATION_DATA.drip,
      sampleQuery: 'Tell me about drip irrigation'
    },
    {
      id: 'irr-rice',
      category: 'irrigation',
      categoryLabel: 'Irrigation Guidance',
      title: 'Rice Alternate Wetting & Drying',
      icon: '💧',
      content: IRRIGATION_DATA.rice,
      sampleQuery: 'Rice irrigation watering'
    },
    {
      id: 'irr-wheat',
      category: 'irrigation',
      categoryLabel: 'Irrigation Guidance',
      title: 'Wheat Crown Root Initiation (CRI)',
      icon: '🌾',
      content: IRRIGATION_DATA.wheat,
      sampleQuery: 'Wheat critical watering stages'
    },
    // Weather
    {
      id: 'weath-rain',
      category: 'weather',
      categoryLabel: 'Weather Awareness',
      title: 'Rainy Season & Monsoon Precaution',
      icon: '🌧️',
      content: WEATHER_DATA.rainy,
      sampleQuery: 'What should I do in rainy weather?'
    },
    {
      id: 'weath-hot',
      category: 'weather',
      categoryLabel: 'Weather Awareness',
      title: 'Summer Heatwave & Mulching Care',
      icon: '☀️',
      content: WEATHER_DATA.hot,
      sampleQuery: 'Farming in hot summer heat'
    },
    {
      id: 'weath-dry',
      category: 'weather',
      categoryLabel: 'Weather Awareness',
      title: 'Drought & Dry Weather Tactics',
      icon: '🏜️',
      content: WEATHER_DATA.dry,
      sampleQuery: 'Drought condition crops'
    },
    {
      id: 'weath-cold',
      category: 'weather',
      categoryLabel: 'Weather Awareness',
      title: 'Winter Cold & Frost Defense',
      icon: '❄️',
      content: WEATHER_DATA.cold,
      sampleQuery: 'Protect crops from cold frost'
    },
    // Soil
    {
      id: 'soil-types',
      category: 'soil',
      categoryLabel: 'Soil Information',
      title: '5 Major Agricultural Soil Types',
      icon: '🧱',
      content: SOIL_DATA.types,
      sampleQuery: 'Different soil types and suitability'
    },
    {
      id: 'soil-black',
      category: 'soil',
      categoryLabel: 'Soil Information',
      title: 'Black Soil (Cotton Soil)',
      icon: '🧱',
      content: SOIL_DATA.black,
      sampleQuery: 'What soil is good for cotton?'
    },
    {
      id: 'soil-alluvial',
      category: 'soil',
      categoryLabel: 'Soil Information',
      title: 'Alluvial River Basin Soil',
      icon: '🧱',
      content: SOIL_DATA.alluvial,
      sampleQuery: 'Alluvial soil crops'
    },
    {
      id: 'soil-test',
      category: 'soil',
      categoryLabel: 'Soil Information',
      title: 'Soil Testing & pH Health Card',
      icon: '🧪',
      content: SOIL_DATA.testing,
      sampleQuery: 'How to do soil testing and check pH?'
    },
    // Tips
    {
      id: 'tip-rotation',
      category: 'tips',
      categoryLabel: 'Farming Best Practices',
      title: 'Crop Rotation with Legumes',
      icon: '💡',
      content: FARMING_TIPS[0],
      sampleQuery: 'Give me a tip on crop rotation'
    },
    {
      id: 'tip-mulch',
      category: 'tips',
      categoryLabel: 'Farming Best Practices',
      title: 'Organic Mulching Moisture Protection',
      icon: '💡',
      content: FARMING_TIPS[1],
      sampleQuery: 'Mulching best practice'
    },
    {
      id: 'tip-seed',
      category: 'tips',
      categoryLabel: 'Farming Best Practices',
      title: 'Seed Treatment with Trichoderma',
      icon: '💡',
      content: FARMING_TIPS[2],
      sampleQuery: 'Seed treatment before sowing'
    },
    {
      id: 'tip-storage',
      category: 'tips',
      categoryLabel: 'Farming Best Practices',
      title: 'Safe Grain Storage & Neem Leaves',
      icon: '💡',
      content: FARMING_TIPS[3],
      sampleQuery: 'Safe grain storage tips'
    }
  ];

  // Filtering
  const filteredCards = allCards.filter((card) => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesSearch = 
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.sampleQuery.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Search & Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <span>📚</span> AgroAssist Knowledge Base & Rule Explorer
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Explore all verified agricultural rules, crop cultivation guides, fertilizer formulas, and pest prevention guidelines.
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search knowledge by keyword (e.g. 'rice', 'compost', 'drip', 'blight', 'black soil')..."
            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {card.categoryLabel}
                </span>
                <span className="text-xl">{card.icon}</span>
              </div>

              <h3 className="font-bold text-stone-800 text-base mb-2">{card.title}</h3>

              <div className="text-xs text-stone-600 whitespace-pre-line leading-relaxed line-clamp-6 bg-stone-50 p-3 rounded-xl border border-stone-100 font-sans">
                {card.content}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100">
              <button
                onClick={() => onAskQuestion(card.sampleQuery)}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors border border-emerald-200/80"
              >
                <span>Ask this in Chat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
          <p className="text-stone-500 text-sm">No knowledge cards matched "{searchTerm}".</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs text-emerald-700 font-bold hover:underline"
          >
            Clear filters and show all topics
          </button>
        </div>
      )}
    </div>
  );
};
