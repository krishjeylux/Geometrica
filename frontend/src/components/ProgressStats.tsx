import { VocabularyWord } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, Target, Award, RotateCcw, BookOpen } from 'lucide-react';

interface ProgressStatsProps {
  vocabulary: VocabularyWord[];
  onResetProgress: () => void;
}

export function ProgressStats({ vocabulary, onResetProgress }: ProgressStatsProps) {
  const totalWords = vocabulary.length;
  const masteredWords = vocabulary.filter(word => word.mastered).length;
  const masteredPercentage = totalWords > 0 ? (masteredWords / totalWords) * 100 : 0;

  const beginnerWords = vocabulary.filter(w => w.difficulty === 'beginner');
  const intermediateWords = vocabulary.filter(w => w.difficulty === 'intermediate');
  const advancedWords = vocabulary.filter(w => w.difficulty === 'advanced');

  const beginnerMastered = beginnerWords.filter(w => w.mastered).length;
  const intermediateMastered = intermediateWords.filter(w => w.mastered).length;
  const advancedMastered = advancedWords.filter(w => w.mastered).length;

  const getMasteryLevel = (percentage: number) => {
    if (percentage === 100) return { label: 'Master', color: 'text-purple-600', icon: '👑' };
    if (percentage >= 80) return { label: 'Expert', color: 'text-blue-600', icon: '⭐' };
    if (percentage >= 60) return { label: 'Advanced', color: 'text-green-600', icon: '🎯' };
    if (percentage >= 40) return { label: 'Intermediate', color: 'text-yellow-600', icon: '📚' };
    if (percentage >= 20) return { label: 'Beginner', color: 'text-orange-600', icon: '🌱' };
    return { label: 'Starting Out', color: 'text-gray-600', icon: '🚀' };
  };

  const masteryLevel = getMasteryLevel(masteredPercentage);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overall Progress Card */}
      <Card className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-10 h-10" />
            <div>
              <h2 className="text-white">Your Progress</h2>
              <p className="text-indigo-100">Keep up the great work!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white mb-1">{masteryLevel.icon}</div>
            <Badge className="bg-white/20 text-white hover:bg-white/30">
              {masteryLevel.label}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">
              {masteredWords} of {totalWords} words mastered
            </span>
            <span className="text-white">{masteredPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={masteredPercentage} className="h-3 bg-white/20" />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Total Words</h3>
              <p className="text-gray-600">{totalWords}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Mastered</h3>
              <p className="text-gray-600">{masteredWords}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Remaining</h3>
              <p className="text-gray-600">{totalWords - masteredWords}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-6">Progress by Difficulty</h3>
        <div className="space-y-6">
          {/* Beginner */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Beginner
                </Badge>
                <span className="text-gray-600">
                  {beginnerMastered} / {beginnerWords.length}
                </span>
              </div>
              <span className="text-gray-600">
                {beginnerWords.length > 0 
                  ? ((beginnerMastered / beginnerWords.length) * 100).toFixed(0)
                  : 0}%
              </span>
            </div>
            <Progress 
              value={beginnerWords.length > 0 ? (beginnerMastered / beginnerWords.length) * 100 : 0} 
              className="h-2"
            />
          </div>

          {/* Intermediate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  Intermediate
                </Badge>
                <span className="text-gray-600">
                  {intermediateMastered} / {intermediateWords.length}
                </span>
              </div>
              <span className="text-gray-600">
                {intermediateWords.length > 0 
                  ? ((intermediateMastered / intermediateWords.length) * 100).toFixed(0)
                  : 0}%
              </span>
            </div>
            <Progress 
              value={intermediateWords.length > 0 ? (intermediateMastered / intermediateWords.length) * 100 : 0}
              className="h-2"
            />
          </div>

          {/* Advanced */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  Advanced
                </Badge>
                <span className="text-gray-600">
                  {advancedMastered} / {advancedWords.length}
                </span>
              </div>
              <span className="text-gray-600">
                {advancedWords.length > 0 
                  ? ((advancedMastered / advancedWords.length) * 100).toFixed(0)
                  : 0}%
              </span>
            </div>
            <Progress 
              value={advancedWords.length > 0 ? (advancedMastered / advancedWords.length) * 100 : 0}
              className="h-2"
            />
          </div>
        </div>
      </Card>

      {/* Reset Progress */}
      <Card className="p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 mb-1">Reset Progress</h3>
            <p className="text-gray-600">Start your learning journey from the beginning</p>
          </div>
          <Button
            variant="outline"
            onClick={onResetProgress}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
}
