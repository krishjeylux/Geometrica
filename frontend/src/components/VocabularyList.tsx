import { useState } from 'react';
import { VocabularyWord } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Volume2, Check, X, Search } from 'lucide-react';

interface VocabularyListProps {
  vocabulary: VocabularyWord[];
  onToggleMastered: (id: string) => void;
}

export function VocabularyList({ vocabulary, onToggleMastered }: VocabularyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterMastered, setFilterMastered] = useState<string>('all');

  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
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

  const filteredVocabulary = vocabulary.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || word.difficulty === filterDifficulty;
    const matchesMastered = filterMastered === 'all' || 
                           (filterMastered === 'mastered' && word.mastered) ||
                           (filterMastered === 'unmastered' && !word.mastered);
    
    return matchesSearch && matchesDifficulty && matchesMastered;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="All difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterMastered} onValueChange={setFilterMastered}>
            <SelectTrigger>
              <SelectValue placeholder="All words" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All words</SelectItem>
              <SelectItem value="mastered">Mastered only</SelectItem>
              <SelectItem value="unmastered">Unmastered only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 text-gray-600">
          Showing {filteredVocabulary.length} of {vocabulary.length} words
        </div>
      </div>

      <div className="space-y-4">
        {filteredVocabulary.map((word) => (
          <Card key={word.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-gray-900">{word.word}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  onClick={() => handlePronounce(word.word)}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(word.difficulty)}>
                  {word.difficulty}
                </Badge>
                <Button
                  variant={word.mastered ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onToggleMastered(word.id)}
                  className="flex items-center gap-1"
                >
                  {word.mastered ? (
                    <>
                      <Check className="w-3 h-3" />
                      Mastered
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" />
                      Not Mastered
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-indigo-600">{word.partOfSpeech}</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-500">/{word.pronunciation}/</span>
              </div>

              <div>
                <span className="text-gray-700">{word.definition}</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-gray-600 italic flex-1">"{word.example}"</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-indigo-600 shrink-0"
                    onClick={() => handlePronounce(word.example)}
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredVocabulary.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No words found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
