import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import './ColorPicker.css';

/**
 * ColorPicker Component
 * Allows users to select a color visually from predefined options or enter a custom HEX color
 * Enhanced with modern design and smooth interactions
 */
const ColorPicker = ({ value, onChange, label = "Choisir une couleur" }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#3B82F6');

  // Predefined color palette with organized groups
  const colorGroups = [
    {
      name: 'Vibrant',
      colors: [
        '#EF4444', // Red
        '#F97316', // Orange
        '#F59E0B', // Amber
        '#EAB308', // Yellow
        '#84CC16', // Lime
        '#22C55E', // Green
        '#10B981', // Emerald
        '#14B8A6', // Teal
      ]
    },
    {
      name: 'Cool',
      colors: [
        '#06B6D4', // Cyan
        '#0EA5E9', // Sky
        '#3B82F6', // Blue
        '#6366F1', // Indigo
        '#8B5CF6', // Violet
        '#A855F7', // Purple
        '#D946EF', // Fuchsia
        '#EC4899', // Pink
      ]
    },
    {
      name: 'Neutral',
      colors: [
        '#F43F5E', // Rose
        '#64748B', // Slate
        '#6B7280', // Gray
        '#78716C', // Stone
        '#57534E', // Warm Gray
        '#374151', // Cool Gray
        '#1F2937', // Dark Gray
        '#000000', // Black
      ]
    }
  ];

  const handleColorSelect = (color) => {
    setCustomColor(color);
    onChange(color);
  };

  const handleHexInputChange = (e) => {
    let hex = e.target.value;
    // Add # if not present
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    setCustomColor(hex);
    // Only update if valid hex color
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onChange(hex);
    }
  };

  const currentColor = value || customColor;

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
        {label}
      </label>

      {/* Color Display Button */}
      <motion.button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-xl hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <motion.div
          className="relative w-10 h-10 rounded-lg shadow-lg ring-2 ring-white"
          style={{ backgroundColor: currentColor }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${currentColor} 0%, ${currentColor}dd 100%)`,
              boxShadow: `0 4px 12px ${currentColor}40`
            }}
          />
        </motion.div>
        <div className="flex-1 text-left">
          <span className="block text-xs text-gray-500 font-medium mb-0.5">Couleur sélectionnée</span>
          <span className="block text-sm font-bold text-gray-900 font-mono uppercase">
            {currentColor}
          </span>
        </div>
        <motion.div
          animate={{ rotate: showPicker ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Color Picker Dropdown */}
      <AnimatePresence>
        {showPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)}
              className="fixed inset-0 z-40"
            />

            {/* Picker Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  <h3 className="text-sm font-bold text-gray-900">Palette de couleurs</h3>
                </div>
                <p className="text-xs text-gray-600 mt-1">Choisissez la couleur parfaite pour votre étiquette</p>
              </div>

              <div className="p-5 space-y-5">
                {/* Color Groups */}
                {colorGroups.map((group, groupIndex) => (
                  <div key={group.name}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider px-2">
                        {group.name}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    <div className="grid grid-cols-8 gap-2.5">
                      {group.colors.map((color, colorIndex) => {
                        const isSelected = currentColor === color;
                        return (
                          <motion.button
                            key={color}
                            type="button"
                            onClick={() => handleColorSelect(color)}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: groupIndex * 0.05 + colorIndex * 0.02,
                              type: 'spring',
                              stiffness: 400,
                              damping: 20
                            }}
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-full aspect-square rounded-lg transition-all duration-200 ${
                              isSelected
                                ? 'ring-3 ring-gray-900 ring-offset-2 shadow-lg'
                                : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-gray-400 shadow-sm hover:shadow-md'
                            }`}
                            style={{
                              backgroundColor: color,
                              boxShadow: isSelected ? `0 8px 16px ${color}60` : `0 2px 8px ${color}40`
                            }}
                            title={color}
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <div className="p-1 bg-white rounded-full shadow-lg">
                                    <Check className="w-3 h-3 text-gray-900" strokeWidth={3} />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Custom Color Input */}
                <div className="space-y-4 border-t-2 border-gray-200 pt-5">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider px-2">
                      Personnalisée
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>

                  <div className="space-y-4">
                    {/* React Colorful Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Sélecteur de couleur
                      </label>
                      <HexColorPicker
                        color={currentColor}
                        onChange={handleColorSelect}
                      />
                    </div>

                    {/* HEX Input */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Code HEX
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customColor}
                          onChange={handleHexInputChange}
                          placeholder="#3B82F6"
                          className="w-full px-3 py-2.5 pl-8 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm font-mono font-bold uppercase transition-all"
                          maxLength={7}
                        />
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                          #
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Aperçu
                      </span>
                      <motion.div
                        className="px-4 py-2 rounded-lg shadow-lg font-bold text-sm"
                        style={{
                          backgroundColor: currentColor,
                          color: '#ffffff',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          boxShadow: `0 4px 12px ${currentColor}60`
                        }}
                        animate={{
                          backgroundColor: currentColor,
                          boxShadow: `0 4px 12px ${currentColor}60`
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        Étiquette
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-t-2 border-gray-200">
                <motion.button
                  type="button"
                  onClick={() => setShowPicker(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 font-bold shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  Confirmer la sélection
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
