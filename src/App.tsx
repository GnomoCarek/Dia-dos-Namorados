import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, Stars, HeartHandshake, Volume2, VolumeX } from 'lucide-react'

export default function App() {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [yesButtonSize, setYesButtonSize] = useState(1)
  const [noTextIndex, setNoTextIndex] = useState(0)
  const [isAccepted, setIsAccepted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const noTexts = [
    "Não",
    "Tem certeza?",
    "Pensa bem...",
    "Olha o outro botão!",
    "Nem tenta!",
    "Eita!",
    "Quase!",
    "Tô fugindo!",
    "Clica no Sim!",
    "Vem cá!",
  ]

  const startMusic = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          console.log("Música iniciada!")
        })
        .catch(e => {
          console.error("Erro ao iniciar música:", e)
        })
    }
  }

  const moveNoButton = () => {
    startMusic()
    const x = Math.random() * (window.innerWidth - 150) - (window.innerWidth / 2 - 75)
    const y = Math.random() * (window.innerHeight - 150) - (window.innerHeight / 2 - 75)
    
    setNoButtonPos({ x, y })
    setNoTextIndex((prev) => (prev + 1) % noTexts.length)
    setYesButtonSize((prev) => prev + 0.2)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error("Erro ao toggle áudio:", e))
      }
    }
  }

  const handleYes = () => {
    startMusic()
    setIsAccepted(true)
    const duration = 15 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center overflow-hidden select-none">
      <audio 
        ref={audioRef} 
        src="musica.mp3" 
        loop 
        onCanPlay={() => console.log("Áudio pronto!")}
        onError={(e) => console.error("Erro no elemento áudio:", e)}
      />

      <button 
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 p-3 bg-white/30 backdrop-blur-md rounded-full text-pink-600 shadow-lg border border-white/50 transition-all hover:scale-110 active:scale-95"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <AnimatePresence mode="wait">
        {!isAccepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={120} className="text-red-500 fill-red-500" />
              </motion.div>
              <motion.div 
                className="absolute -top-4 -right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Stars className="text-yellow-400" />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 drop-shadow-sm">
              Quer namorar comigo?
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 relative w-full max-w-md h-40">
              <motion.button
                onClick={handleYes}
                style={{ scale: yesButtonSize }}
                whileHover={{ scale: yesButtonSize + 0.1 }}
                whileTap={{ scale: yesButtonSize - 0.1 }}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-colors z-10"
              >
                SIM!
              </motion.button>

              <motion.button
                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                className="px-8 py-4 bg-red-500 text-white font-bold rounded-full shadow-lg whitespace-nowrap"
              >
                {noTexts[noTextIndex]}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="accepted"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <HeartHandshake size={150} className="text-pink-600" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-pink-600">
              Uhuuuul! ❤️
            </h2>
            <p className="text-2xl text-gray-700 font-medium">
              Sabia que você ia dizer sim! 
            </p>
            <p className="text-xl text-gray-600 italic mt-4">
              Te amo muito! Prepare-se para o melhor namoro do mundo!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corações de fundo flutuando */}
      {!isAccepted && [...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-red-400 -z-10 select-none pointer-events-none"
          initial={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        >
          <Heart size={Math.random() * 40 + 20} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  )
}
