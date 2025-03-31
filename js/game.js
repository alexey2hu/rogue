import Enemy from './enemy.js'
import Map from './map.js'
import MapUpdate from './mapUpdate.js'
import Player from './player.js'

const gameMap = new Map() // Создаем объект карты
gameMap.init() // Инициализация карты

const mapUpdate = new MapUpdate(gameMap) // Создаем объект для обновления карты
mapUpdate.render()

// Создание врагов после размещения объектов
const enemies = []

// Получаем все объекты на карте, включая врагов
const enemyPositions = gameMap
	.getAllObjectCoordinates()
	.filter(pos => pos.tile.startsWith('tile-E')) // Фильтруем только врагов (tile-E)

enemyPositions.forEach((pos, index) => {
	// Создаем экземпляр врага с его уникальным ID
	const enemyInstance = new Enemy(gameMap, mapUpdate, index, {
		x: pos.x,
		y: pos.y,
	})
	enemies.push(enemyInstance) // Добавляем врага в массив
})

// Создание игрока
const player = new Player(gameMap, mapUpdate, enemies)
player.init()

// Обработчик событий для движения
let isPlayerTurn = true // Переменная, отслеживающая очередь хода

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
