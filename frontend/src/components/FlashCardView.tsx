import { useState } from 'react';
import { VocabularyWord } from '../App';
import { FlashCard } from './FlashCard';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react';
import { Badge } from './ui/badge';

interface FlashCardViewProps {
  vocabulary: VocabularyWord[];
  onToggleMastered: (id: string) => void;
}

export function FlashCardView({ vocabulary, onToggleMastered }: FlashCardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOnlyUnmastered, setShowOnlyUnmastered] = useState(false);

  const filteredVocabulary = showOnlyUnmastered 
    ? vocabulary.filter(word => !word.mastered)
    : vocabulary;

  const currentWord = filteredVocabulary[currentIndex];
  const totalCards = filteredVocabulary.length;
  const progressPercentage = ((currentIndex + 1) / totalCards) * 100;

  const goToNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleToggleMastered = () => {
    if (currentWord) {
      onToggleMastered(currentWord.id);
    }
  };

  const resetToStart = () => {
    setCurrentIndex(0);
  };

  if (filteredVocabulary.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">All Words Mastered!</h3>
          <p className="text-gray-600 mb-4">You've mastered all the vocabulary words.</p>
          <Button onClick={() => setShowOnlyUnmastered(false)} variant="outline">
            Show All Words
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">
            Card {currentIndex + 1} of {totalCards}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowOnlyUnmastered(!showOnlyUnmastered)}
        >
          {showOnlyUnmastered ? 'Show All' : 'Show Unmastered'}
        </Button>
      </div>

      <Progress value={progressPercentage} className="mb-6" />

      <FlashCard word={currentWord} />

      <div className="flex items-center justify-between mt-6 gap-4">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={resetToStart}
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant={currentWord?.mastered ? 'default' : 'outline'}
            onClick={handleToggleMastered}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {currentWord?.mastered ? 'Mastered' : 'Mark as Mastered'}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={goToNext}
          disabled={currentIndex === totalCards - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
