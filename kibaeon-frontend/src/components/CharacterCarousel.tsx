import CharacterDisplay from './CharacterDisplay';
import { CHARACTER_TYPES } from '../constants/character';
import KeycapButton from './KeycapButton';

interface CharacterCarouselProps {
  selectedCharacter: string;
  onCharacterChange: (characterType: string) => void;
}

function CharacterCarousel({ selectedCharacter, onCharacterChange }: CharacterCarouselProps) {
  const currentIndex = CHARACTER_TYPES.findIndex(c => c.value === selectedCharacter);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : CHARACTER_TYPES.length - 1;
    onCharacterChange(CHARACTER_TYPES[newIndex].value);
  };

  const handleNext = () => {
    const newIndex = currentIndex < CHARACTER_TYPES.length - 1 ? currentIndex + 1 : 0;
    onCharacterChange(CHARACTER_TYPES[newIndex].value);
  };

  const currentCharacter = CHARACTER_TYPES[currentIndex];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-center" style={{ color: 'var(--text-title)' }}>
        캐릭터 선택
      </label>

      <div className="flex items-center gap-3">
        {/* 이전 버튼 */}
        <KeycapButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={handlePrevious}
        >
          ◀
        </KeycapButton>

        {/* 캐릭터 디스플레이 */}
        <div className="flex-1 flex flex-col items-center p-4 rounded-lg keycap-card" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="mb-2">
            <CharacterDisplay characterType={currentCharacter.value} />
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--text-title)' }}>
            {currentCharacter.label}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
            {currentIndex + 1} / {CHARACTER_TYPES.length}
          </p>
        </div>

        {/* 다음 버튼 */}
        <KeycapButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleNext}
        >
          ▶
        </KeycapButton>
      </div>
    </div>
  );
}

export default CharacterCarousel;
