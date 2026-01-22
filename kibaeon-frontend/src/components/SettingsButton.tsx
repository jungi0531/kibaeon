import { useState, useEffect } from 'react';
import { isSoundEnabled, toggleSound, getSoundVolumeValue, setSoundVolume, playKeyboardSound } from '../utils/sound';

function SettingsButton() {
  const [showSettings, setShowSettings] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [volume, setVolume] = useState(getSoundVolumeValue() * 100);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    setVolume(getSoundVolumeValue() * 100);
  }, [showSettings]);

  const handleToggleSound = () => {
    playKeyboardSound();
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setSoundVolume(newVolume / 100);
  };

  // 볼륨 테스트 함수
  const testSound = () => {
    playKeyboardSound(); // 먼저 키보드 소리 재생
    const audio = new Audio();
    audio.src = new URL('../assets/sound/vintage_keyboard_sound.wav', import.meta.url).href;
    audio.volume = volume / 100;
    audio.play().catch(err => console.log('테스트 사운드 재생 실패:', err));
  };

  return (
    <>
      {/* 설정 버튼 */}
      <button
        onClick={() => {
          playKeyboardSound();
          setShowSettings(!showSettings);
        }}
        className="fixed top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 z-40"
        style={{
          backgroundColor: '#EBD9B4',
          border: '3px solid #4A3F35',
          boxShadow: '0 4px 0 rgba(0,0,0,0.3), 0 6px 8px rgba(0,0,0,0.15)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        ⚙️
      </button>

      {/* 설정 모달 */}
      {showSettings && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowSettings(false)}
        >
          <div
            className="rounded-lg shadow-xl p-6 w-full max-w-sm"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '3px solid #4A3F35',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-title)' }}>
              ⚙️ 설정
            </h2>

            <div className="space-y-6">
              {/* 사운드 on/off */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold" style={{ color: 'var(--text-title)' }}>
                  🔊 사운드
                </span>
                <label className="keycap-toggle">
                  <input
                    type="checkbox"
                    checked={soundOn}
                    onChange={handleToggleSound}
                  />
                  <span className="keycap-toggle-slider"></span>
                </label>
              </div>

              {/* 볼륨 조절 */}
              {soundOn && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold" style={{ color: 'var(--text-title)' }}>
                      🎚️ 볼륨
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-title)' }}>
                        {Math.round(volume)}%
                      </span>
                      <button
                        onClick={testSound}
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{
                          backgroundColor: '#B8E6B8',
                          border: '2px solid #4A3F35',
                          color: 'var(--text-title)',
                        }}
                      >
                        테스트
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #D4A574 0%, #D4A574 ${volume}%, #E5DDD0 ${volume}%, #E5DDD0 100%)`,
                      outline: 'none',
                      border: '2px solid #4A3F35',
                    }}
                  />
                </div>
              )}

              {/* 닫기 버튼 */}
              <button
                onClick={() => {
                  playKeyboardSound();
                  setShowSettings(false);
                }}
                className="w-full py-3 rounded-lg font-bold text-lg transition-all duration-200"
                style={{
                  backgroundColor: '#EBD9B4',
                  border: '3px solid #4A3F35',
                  color: 'var(--text-title)',
                  boxShadow: '0 4px 0 rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsButton;
