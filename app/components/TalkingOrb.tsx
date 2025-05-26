"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-webgl2'

interface TalkingOrbProps {
  isAgentSpeaking: boolean
  isUserSpeaking?: boolean
  size?: number
  className?: string
  audioStream?: MediaStream
  userAudioStream?: MediaStream
  agentAudioStream?: MediaStream
}

const COLOR = {
  BLACK: 0,
  WHITE: 1,
  RED: 2,
  ORANGE: 3,
  YELLOW: 4,
  GREEN: 5,
  CYAN: 6,
  BLUE: 7,
  PURPLE: 8,
  PINK: 9,
} as const

export function TalkingOrb({ 
  isAgentSpeaking, 
  isUserSpeaking = false, 
  size = 120,
  className = "",
  audioStream,
  userAudioStream,
  agentAudioStream
}: TalkingOrbProps) {
  const isActive = isAgentSpeaking || isUserSpeaking
  const [audioLevel, setAudioLevel] = useState(0)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  console.log('TalkingOrb state:', {
    isAgentSpeaking,
    isUserSpeaking,
    isActive,
    hasUserAudioStream: !!userAudioStream,
    hasAgentAudioStream: !!agentAudioStream
  });
  
  // Set up audio analysis to get audio levels
  useEffect(() => {
    const currentAudioStream = isAgentSpeaking ? agentAudioStream : userAudioStream;
    
    if (currentAudioStream && isActive) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaStreamSource(currentAudioStream)
        
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.8
        source.connect(analyser)
        analyserRef.current = analyser
        
        const updateAudioData = () => {
          if (!analyser) return
          
          const bufferLength = analyser.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)
          analyser.getByteFrequencyData(dataArray)
          
          // Calculate average volume
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
          const normalizedLevel = average / 255
          setAudioLevel(normalizedLevel)
          
          animationFrameRef.current = requestAnimationFrame(updateAudioData)
        }
        
        updateAudioData()
        
        return () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
          audioContext.close().catch(console.warn)
        }
      } catch (error) {
        console.error('Error setting up audio analysis:', error);
      }
    } else {
      setAudioLevel(0)
    }
  }, [isAgentSpeaking, userAudioStream, agentAudioStream, isActive])
  
  // Initialize Rive
  const stateMachine = 'default'
  const { rive, RiveComponent } = useRive({
    src: '/animations/orb-1.0.0.riv',
    stateMachines: stateMachine,
    autoplay: true,
    onLoad: () => {
      console.log('Rive orb loaded successfully');
      
      // Log all available inputs
      if (rive) {
        const inputs = rive.stateMachineInputs(stateMachine);
        console.log('Available inputs in orb animation:', inputs?.map(input => ({
          name: input.name,
          type: input.type
        })));
      }
    }
  })
  
  // Get state machine inputs
  const listeningInput = useStateMachineInput(rive, stateMachine, 'listening')
  const thinkingInput = useStateMachineInput(rive, stateMachine, 'thinking')
  const speakingInput = useStateMachineInput(rive, stateMachine, 'speaking')
  const asleepInput = useStateMachineInput(rive, stateMachine, 'asleep')
  const colorInput = useStateMachineInput(rive, stateMachine, 'color')
  
  // Try to get potential audio level inputs
  const audioLevelInput = useStateMachineInput(rive, stateMachine, 'audioLevel')
  const volumeInput = useStateMachineInput(rive, stateMachine, 'volume')
  const intensityInput = useStateMachineInput(rive, stateMachine, 'intensity')
  
  // Update Rive states based on props
  useEffect(() => {
    console.log('Updating Rive states:', {
      listening: isUserSpeaking,
      speaking: isAgentSpeaking,
      asleep: false,
      audioLevel: audioLevel,
      color: isAgentSpeaking ? 'CYAN' : isUserSpeaking ? 'GREEN' : 'BLUE'
    });
    
    if (listeningInput) {
      listeningInput.value = isUserSpeaking
    }
    if (thinkingInput) {
      // Could be used for processing state
      thinkingInput.value = false
    }
    if (speakingInput) {
      speakingInput.value = isAgentSpeaking
    }
    if (asleepInput) {
      // Keep orb always awake so it never disappears
      asleepInput.value = false
    }
    if (colorInput) {
      // Change color based on who is active
      if (isAgentSpeaking) {
        colorInput.value = COLOR.CYAN  // Teal/cyan for AI speaking
      } else if (isUserSpeaking) {
        colorInput.value = COLOR.GREEN // Green for user speaking
      } else {
        colorInput.value = COLOR.BLUE  // Blue for idle/ready state
      }
    }
    
    // Try to set audio level if any of these inputs exist
    if (audioLevelInput && audioLevelInput.value !== undefined) {
      audioLevelInput.value = audioLevel * 100 // Convert to 0-100 range
    }
    if (volumeInput && volumeInput.value !== undefined) {
      volumeInput.value = audioLevel * 100
    }
    if (intensityInput && intensityInput.value !== undefined) {
      intensityInput.value = audioLevel * 100
    }
  }, [
    isUserSpeaking,
    isAgentSpeaking,
    isActive,
    audioLevel,
    listeningInput,
    thinkingInput,
    speakingInput,
    asleepInput,
    colorInput,
    audioLevelInput,
    volumeInput,
    intensityInput,
  ])
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <RiveComponent 
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Status text */}
      <div className="absolute -bottom-8 left-0 right-0 text-center text-sm font-medium">
        {isActive ? (
          isUserSpeaking ? (
            <span className="text-emerald-500">
              Listening
            </span>
          ) : isAgentSpeaking ? (
            <span className="text-teal-500">
              Speaking
            </span>
          ) : (
            <span className="text-gray-500">Ready</span>
          )
        ) : (
          <span className="text-gray-500">Ready</span>
        )}
      </div>
    </div>
  )
} 