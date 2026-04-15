function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = url;
    audio.onloadedmetadata = () => {
      resolve(audio.duration); // duration in seconds
      audio.src = ''; // cleanup
    };
    audio.onerror = reject;
  });
}

// usage
const duration = await getAudioDuration(book.audioLink);







function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}






const [duration, setDuration] = useState('');

useEffect(() => {
  if (!book?.audioLink) return;

  getAudioDuration(book.audioLink).then((secs) => {
    setDuration(formatDuration(secs)); // "03:24"
  });
}, [book?.audioLink]);

// then in your JSX
<span>{duration}</span>