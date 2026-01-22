import keyboardSound from '../assets/sound/vintage_keyboard_sound.wav';

// 사운드 파일을 미리 로드해서 캐싱 (여러 개 생성하여 동시 재생 지원)
const audioPool: HTMLAudioElement[] = [];
const POOL_SIZE = 10; // 10개의 오디오 객체 미리 생성 (빠른 클릭 대응)

// 오디오 풀 초기화
for (let i = 0; i < POOL_SIZE; i++) {
  const audio = new Audio(keyboardSound);
  audio.preload = 'auto';
  audio.volume = 0.3; // 초기 볼륨 설정
  audio.load(); // 즉시 로드
  audioPool.push(audio);
}

let currentIndex = 0;

// LocalStorage에서 사운드 설정 가져오기 (기본값: true)
const getSoundEnabled = (): boolean => {
  const saved = localStorage.getItem('soundEnabled');
  return saved === null ? true : saved === 'true';
};

// LocalStorage에서 볼륨 설정 가져오기 (기본값: 0.3 = 30%)
const getSoundVolume = (): number => {
  const saved = localStorage.getItem('soundVolume');
  return saved === null ? 0.3 : parseFloat(saved);
};

// 사운드 설정 저장하기
export const setSoundEnabled = (enabled: boolean): void => {
  localStorage.setItem('soundEnabled', enabled.toString());
};

// 볼륨 설정 저장하기 (0.0 ~ 1.0)
export const setSoundVolume = (volume: number): void => {
  const clampedVolume = Math.max(0, Math.min(1, volume)); // 0~1 범위로 제한
  localStorage.setItem('soundVolume', clampedVolume.toString());
  // 모든 오디오 객체에 볼륨 적용
  audioPool.forEach(audio => {
    audio.volume = clampedVolume;
  });
};

// 키보드 사운드 재생
export const playKeyboardSound = (): void => {
  if (!getSoundEnabled()) return; // 사운드가 꺼져있으면 재생 안함

  // 풀에서 준비된 오디오 객체 찾기
  let audio = audioPool[currentIndex];
  let attempts = 0;

  // 최대 POOL_SIZE번 시도하여 준비된 오디오 찾기
  while (audio.readyState < 2 && attempts < POOL_SIZE) {
    currentIndex = (currentIndex + 1) % POOL_SIZE;
    audio = audioPool[currentIndex];
    attempts++;
  }

  // 다음 재생을 위해 인덱스 증가
  currentIndex = (currentIndex + 1) % POOL_SIZE;

  // 이미 재생 중이면 처음부터 다시 재생
  audio.currentTime = 0;
  audio.volume = getSoundVolume(); // 저장된 볼륨 사용

  // 재생 (에러 처리 포함)
  audio.play().catch((error) => {
    console.log('사운드 재생 실패:', error);
  });
};

// 사운드 on/off 토글
export const toggleSound = (): boolean => {
  const current = getSoundEnabled();
  const newValue = !current;
  setSoundEnabled(newValue);
  return newValue;
};

// 현재 사운드 설정 상태 가져오기
export const isSoundEnabled = (): boolean => {
  return getSoundEnabled();
};

// 현재 볼륨 가져오기
export const getSoundVolumeValue = (): number => {
  return getSoundVolume();
};

// 탭이 다시 포커스될 때 오디오 재활성화
const handleVisibilityChange = () => {
  if (!document.hidden) {
    // 탭이 다시 활성화되면 모든 오디오 객체 재로드
    audioPool.forEach(audio => {
      audio.load();
      audio.volume = getSoundVolume();
    });
  }
};

// visibilitychange 이벤트 리스너 등록
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', handleVisibilityChange);
}
