window.showGameStatus = function (message) {
	const statusMessage = document.getElementById('status-message')
	const gameStatus = document.getElementById('game-status')
	const restartButton = document.getElementById('restart-button')

	statusMessage.textContent = message
	gameStatus.style.visibility = 'visible'

	restartButton.onclick = function () {
		gameStatus.style.visibility = 'hidden'
		startGameplay()
	}
}

function startGameplay() {
	// Инициализация карты
	gameMap = new Map()
	gameMap.init()

	mapUpdate = new MapUpdate(gameMap)
	mapUpdate.render()

	// Создание врагов
	enemies = []
	const enemyPositions = mapUpdate.findObjectCoordinates('tile-E')
	if (enemyPositions) {
		enemyPositions.forEach((position, index) => {
			const { x, y } = position
			const enemyInstance = new Enemy(gameMap, mapUpdate, index, { x, y })
			enemies.push(enemyInstance)
		})
	}

	// Создание игрока
	player = new Player(gameMap, mapUpdate, enemies)
	player.init()

	// Обработчик событий для движения
	let isPlayerTurn = true

	// Маппинг направлений для движения
	const directions = {
		ArrowUp: { dx: 0, dy: -1 },
		ArrowLeft: { dx: -1, dy: 0 },
		ArrowDown: { dx: 0, dy: 1 },
		ArrowRight: { dx: 1, dy: 0 },
		w: { dx: 0, dy: -1 },
		a: { dx: -1, dy: 0 },
		s: { dx: 0, dy: 1 },
		d: { dx: 1, dy: 0 },
		ц: { dx: 0, dy: -1 },
		ф: { dx: -1, dy: 0 },
		ы: { dx: 0, dy: 1 },
		в: { dx: 1, dy: 0 },
	}

	// Обработчик событий клавиатуры
	document.addEventListener('keydown', event => {
		if (!isPlayerTurn) return

		// Движение игрока
		if (directions[event.key]) {
			player.move(directions[event.key])
			endPlayerTurn()
		}

		// Атака игрока на пробел
		if (event.key === ' ') {
			player.attack()
			endPlayerTurn()
		}
	})

	// Завершение хода игрока и движение врагов
	function endPlayerTurn() {
		isPlayerTurn = false
		setTimeout(() => {
			enemies.forEach(enemy => enemy.moveRandom(player))
			isPlayerTurn = true
		}, 100) // Задержка
	}
}

window.startGame = function startGame() {
	// Показываем окно состояния с блокировкой игры до нажатия кнопки
	showGameStatus('Добро пожаловать в игру!', startGameplay)
}

window.startGameplay = startGameplay
