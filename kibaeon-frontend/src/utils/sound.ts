import keyboardSound from '../assets/sound/vintage_keyboard_sound.wav';

// Web Audio API 사용 (HTMLAudioElement보다 훨씬 빠름)
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

// AudioContext 초기화 (유저 인터랙션 후 호출됨)
const initAudioContext = async () => {
  if (audioContext) return;

  audioContext = new AudioContext();

  // 사운드 파일 로드 및 디코딩
  try {
    const response = await fetch(keyboardSound);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error('사운드 로드 실패:', error);
  }
};

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
  const clampedVolume = Math.max(0, Math.min(1, volume));
  localStorage.setItem('soundVolume', clampedVolume.toString());
};

// 키보드 사운드 재생 (Web Audio API - 매우 빠름)
export const playKeyboardSound = (): void => {
  if (!getSoundEnabled()) return;

  // AudioContext가 없으면 초기화
  if (!audioContext) {
    initAudioContext();
    return;
  }

  // suspended 상태면 resume (브라우저 정책)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // 버퍼가 아직 로드 안됐으면 스킵
  if (!audioBuffer) return;

  // 새로운 버퍼 소스 생성 (매번 새로 만들어야 함)
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  // 볼륨 조절용 GainNode
  const gainNode = audioContext.createGain();
  gainNode.gain.value = getSoundVolume();

  // 연결: source -> gain -> destination
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // 재생
  source.start(0);
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

// 페이지 로드 시 첫 클릭/키 입력으로 AudioContext 초기화
const initOnInteraction = () => {
  initAudioContext();
  document.removeEventListener('click', initOnInteraction);
  document.removeEventListener('keydown', initOnInteraction);
};

if (typeof document !== 'undefined') {
  document.addEventListener('click', initOnInteraction);
  document.addEventListener('keydown', initOnInteraction);
}
