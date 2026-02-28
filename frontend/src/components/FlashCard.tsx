import { useState } from 'react';
import { VocabularyWord } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Volume2, RotateCw } from 'lucide-react';
import { motion } from 'motion/react';

interface FlashCardProps {
  word: VocabularyWord;
}

export function FlashCard({ word }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'advanced':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full h-[400px] cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <Card
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-xl p-8 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full flex justify-between items-start mb-6">
            <Badge className={getDifficultyColor(word.difficulty)}>
              {word.difficulty}
            </Badge>
            {word.mastered && (
              <Badge className="bg-green-500 text-white hover:bg-green-500">
                Mastered
              </Badge>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <h2 className="text-indigo-900 mb-4">{word.word}</h2>
            
            <Button
              variant="ghost"
              size="lg"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              onClick={(e) => {
                e.stopPropagation();
                handlePronounce(word.word);
              }}
            >
              <Volume2 className="w-5 h-5" />
              <span className="text-gray-600">/{word.pronunciation}/</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-gray-500 mt-4">
            <RotateCw className="w-4 h-4" />
            <span>Click to see definition</span>
          </div>
        </Card>

        {/* Back of card */}
        <Card
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200 shadow-xl p-8 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="w-full flex justify-between items-start mb-6">
            <Badge variant="outline">{word.partOfSpeech}</Badge>
            {word.mastered && (
              <Badge className="bg-green-500 text-white hover:bg-green-500">
                Mastered
              </Badge>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <h4 className="text-indigo-900 mb-2">Definition</h4>
              <p className="text-gray-700">{word.definition}</p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h4 className="text-indigo-900 mb-2">Example</h4>
              <p className="text-gray-700 italic">"{word.example}"</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 self-start"
              onClick={(e) => {
                e.stopPropagation();
                handlePronounce(word.example);
              }}
            >
              <Volume2 className="w-4 h-4" />
              Hear example
            </Button>
          </div>

          <div className="flex items-center gap-2 text-gray-500 mt-4 justify-center">
            <RotateCw className="w-4 h-4" />
            <span>Click to flip back</span>
          </div>
        </Card>
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
