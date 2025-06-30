"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Target, Info, Github, Share2 } from 'lucide-react'

// Tipos do jogo
type Position = { row: number; col: number }
type CellType = "empty" | "fence" | "cat"
type GameState = "playing" | "player-wins" | "cpu-wins"

// Configurações do jogo
const BOARD_SIZE = 11
const INITIAL_FENCES = 12
const CENTER_POS = { row: 5, col: 5 }

// Direções hexagonais simuladas
const HEX_DIRECTIONS = [
  { row: -1, col: 0 }, // Norte
  { row: -1, col: 1 }, // Nordeste
  { row: 0, col: 1 }, // Sudeste
  { row: 1, col: 0 }, // Sul
  { row: 1, col: -1 }, // Sudoeste
  { row: 0, col: -1 }, // Noroeste
]

export default function ChatNoirGame() {
  const [board, setBoard] = useState<CellType[][]>([])
  const [catPosition, setCatPosition] = useState<Position>(CENTER_POS)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [playerScore, setPlayerScore] = useState(0)
  const [cpuScore, setCpuScore] = useState(0)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  // Carregar dados do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPlayerScore = localStorage.getItem("chatNoir-playerScore")
      const savedCpuScore = localStorage.getItem("chatNoir-cpuScore")

      if (savedPlayerScore) setPlayerScore(Number.parseInt(savedPlayerScore))
      if (savedCpuScore) setCpuScore(Number.parseInt(savedCpuScore))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("chatNoir-playerScore", playerScore.toString())
      localStorage.setItem("chatNoir-cpuScore", cpuScore.toString())
    }
  }, [playerScore, cpuScore])

  // Inicializar tabuleiro
  const initializeBoard = useCallback(() => {
    const newBoard: CellType[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill("empty"))

    // Colocar gato no centro
    newBoard[CENTER_POS.row][CENTER_POS.col] = "cat"

    // Colocar cercas aleatórias
    let fencesPlaced = 0
    while (fencesPlaced < INITIAL_FENCES) {
      const row = Math.floor(Math.random() * BOARD_SIZE)
      const col = Math.floor(Math.random() * BOARD_SIZE)

      if (newBoard[row][col] === "empty" && !(row === CENTER_POS.row && col === CENTER_POS.col)) {
        newBoard[row][col] = "fence"
        fencesPlaced++
      }
    }

    setBoard(newBoard)
    setCatPosition(CENTER_POS)
    setGameState("playing")
    setIsPlayerTurn(true)
    setMoveCount(0)
  }, [])

  // Verificar se posição está na borda
  const isEdge = (pos: Position): boolean => {
    return pos.row === 0 || pos.row === BOARD_SIZE - 1 || pos.col === 0 || pos.col === BOARD_SIZE - 1
  }

  // Verificar se posição é válida
  const isValidPosition = (pos: Position): boolean => {
    return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE
  }

  // Obter vizinhos válidos
  const getValidNeighbors = (pos: Position): Position[] => {
    return HEX_DIRECTIONS.map((dir) => ({ row: pos.row + dir.row, col: pos.col + dir.col })).filter(
      (newPos) => isValidPosition(newPos) && board[newPos.row][newPos.col] === "empty",
    )
  }

  // Algoritmo BFS para encontrar caminho até a borda
  const findPathToEdge = (start: Position): Position[] => {
    const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [start] }]
    const visited = new Set<string>()
    visited.add(`${start.row},${start.col}`)

    while (queue.length > 0) {
      const { pos, path } = queue.shift()!

      if (isEdge(pos)) {
        return path
      }

      const neighbors = getValidNeighbors(pos)
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`
        if (!visited.has(key)) {
          visited.add(key)
          queue.push({ pos: neighbor, path: [...path, neighbor] })
        }
      }
    }

    return []
  }

  // Verificar se o gato está cercado
  const isCatTrapped = (): boolean => {
    const path = findPathToEdge(catPosition)
    return path.length === 0
  }

  // Movimento da CPU (gato)
  const moveCat = useCallback(() => {
    if (gameState !== "playing" || isPlayerTurn) return

    const path = findPathToEdge(catPosition)

    if (path.length === 0) {
      setGameState("player-wins")
      setPlayerScore((prev) => prev + 1)
      return
    }

    if (path.length === 1) {
      setGameState("cpu-wins")
      setCpuScore((prev) => prev + 1)
      return
    }

    const nextPosition = path[1]

    setBoard((prev) => {
      const newBoard = prev.map((row) => [...row])
      newBoard[catPosition.row][catPosition.col] = "empty"
      newBoard[nextPosition.row][nextPosition.col] = "cat"
      return newBoard
    })

    setCatPosition(nextPosition)

    if (isEdge(nextPosition)) {
      setGameState("cpu-wins")
      setCpuScore((prev) => prev + 1)
    } else {
      setIsPlayerTurn(true)
    }
  }, [catPosition, gameState, isPlayerTurn])

  // Executar movimento da CPU
  useEffect(() => {
    if (!isPlayerTurn && gameState === "playing") {
      const timer = setTimeout(moveCat, 800)
      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameState, moveCat])

  // Clique do jogador
  const handleCellClick = (row: number, col: number) => {
    if (!isPlayerTurn || gameState !== "playing" || board[row][col] !== "empty") {
      return
    }

    setBoard((prev) => {
      const newBoard = prev.map((r) => [...r])
      newBoard[row][col] = "fence"
      return newBoard
    })

    setMoveCount(prev => prev + 1)

    setTimeout(() => {
      if (isCatTrapped()) {
        setGameState("player-wins")
        setPlayerScore((prev) => prev + 1)
      } else {
        setIsPlayerTurn(false)
      }
    }, 100)
  }

  // Compartilhar resultado
  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Chat Noir - Jogo do Gato',
        text: `Acabei de ${gameState === 'player-wins' ? 'cercar o gato' : 'deixar o gato escapar'} em ${moveCount} movimentos!`,
        url: window.location.href
      })
    } else {
      // Fallback para navegadores sem suporte
      const text = `Acabei de ${gameState === 'player-wins' ? 'cercar o gato' : 'deixar o gato escapar'} em ${moveCount} movimentos! Jogue também: ${window.location.href}`
      navigator.clipboard.writeText(text)
      alert('Link copiado para a área de transferência!')
    }
  }

  // Inicializar jogo
  useEffect(() => {
    initializeBoard()
  }, [initializeBoard])

  // Classes CSS para células
  const getCellClass = (row: number, col: number): string => {
    const cell = board[row]?.[col]
    const baseClass = "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border border-gray-300 cursor-pointer transition-all duration-200 flex items-center justify-center text-sm sm:text-base md:text-lg font-bold rounded-sm hover:scale-105 "

    switch (cell) {
      case "cat":
        return baseClass + "bg-orange-400 hover:bg-orange-500 text-white shadow-lg animate-pulse"
      case "fence":
        return baseClass + "bg-gray-700 text-white shadow-md"
      case "empty":
        if (isEdge({ row, col })) {
          return baseClass + "bg-green-100 hover:bg-green-200 border-green-300"
        }
        return baseClass + "bg-white hover:bg-gray-100"
      default:
        return baseClass + "bg-white"
    }
  }

  const getCellSymbol = (row: number, col: number): string => {
    const cell = board[row]?.[col]
    switch (cell) {
      case "cat": return "🐱"
      case "fence": return "🚧"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🐱 Chat Noir
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Cerque o gato antes que ele escape!
          </p>
        </div>

        {/* Controles superiores */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 sm:mb-6">
          {/* Placar */}
          <div className="flex gap-2 sm:gap-4">
            <Card className="w-24 sm:w-32 md:w-40">
              <CardHeader className="pb-1 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2 justify-center">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  Jogador
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 text-center">
                  {playerScore}
                </div>
              </CardContent>
            </Card>

            <Card className="w-24 sm:w-32 md:w-40">
              <CardHeader className="pb-1 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2 justify-center">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                  CPU
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 text-center">
                  {cpuScore}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowInstructions(!showInstructions)} 
              variant="outline" 
              size="sm"
            >
              <Info className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Ajuda</span>
            </Button>
            <Button onClick={initializeBoard} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Nova Partida</span>
            </Button>
            {gameState !== "playing" && (
              <Button onClick={shareResult} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
            )}
          </div>
        </div>

        {/* Instruções */}
        {showInstructions && (
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Como Jogar</CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-gray-600 space-y-2">
              <p>• <strong>Objetivo:</strong> Cerque o gato 🐱 antes que ele escape pelas bordas verdes</p>
              <p>• <strong>Sua vez:</strong> Clique em uma célula vazia para colocar uma cerca 🚧</p>
              <p>• <strong>CPU:</strong> O gato se move automaticamente tentando chegar à borda</p>
              <p>• <strong>Vitória:</strong> Você vence se o gato ficar completamente cercado</p>
              <p>• <strong>Derrota:</strong> A CPU vence se o gato chegar a qualquer borda verde</p>
            </CardContent>
          </Card>
        )}

        {/* Status do jogo */}
        <div className="text-center mb-4">
          {gameState === "playing" && (
            <Badge 
              variant={isPlayerTurn ? "default" : "secondary"} 
              className="text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              {isPlayerTurn ? "Sua vez - Clique para colocar uma cerca" : "CPU pensando..."}
            </Badge>
          )}
          {gameState === "player-wins" && (
            <Badge variant="default" className="text-xs sm:text-sm px-3 sm:px-4 py-2 bg-green-600">
              🎉 Você venceu em {moveCount} movimentos! O gato foi cercado!
            </Badge>
          )}
          {gameState === "cpu-wins" && (
            <Badge variant="destructive" className="text-xs sm:text-sm px-3 sm:px-4 py-2">
              😿 O gato escapou em {moveCount} movimentos! CPU venceu!
            </Badge>
          )}
        </div>

        {/* Tabuleiro */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="inline-block p-2 sm:p-4 bg-white rounded-lg shadow-xl border-2 border-gray-200">
            <div 
              className="grid gap-0.5 sm:gap-1" 
              style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
            >
              {board.map((row, rowIndex) =>
                row.map((_, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    title={
                      board[rowIndex][colIndex] === "empty" && isEdge({ row: rowIndex, col: colIndex })
                        ? "Borda - Saída do gato"
                        : ""
                    }
                  >
                    {getCellSymbol(rowIndex, colIndex)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="text-center text-xs sm:text-sm text-gray-500 mb-4">
          <p>
            Movimentos: {moveCount} | Total de jogos: {playerScore + cpuScore} | 
            Taxa de vitória: {playerScore + cpuScore > 0 ? Math.round((playerScore / (playerScore + cpuScore)) * 100) : 0}%
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400">
          <p>© 2025 - Guilherme. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}