import Utils from './utils.js'

class Enemy {
	static enemies = [] // Статический массив врагов

	constructor(gameMap, mapUpdate, id, initialPosition) {
		this.gameMap = gameMap
		this.mapUpdate = mapUpdate
		this.tileType = `tile-E`
		this.health = 100
		this.attackPower = 10
		this.id = id
		this.position = initialPosition
		Utils.updateHealthDisplay(
			this.tileType,
			this.position.x,
			this.position.y,
			this.health
		)
		Enemy.enemies.push(this) // Добавляем врага в статический массив
	}

	// Метод для получения текущих координат врага
	getPosition() {
		return this.position
	}

	// Метод для обновления позиции врага
	updatePosition(newX, newY) {
		this.position = { x: newX, y: newY }
	}

	// Метод для случайного движения врага
	moveRandom(player) {
		let directions = [
			{ dx: 0, dy: -1 }, // вверх
			{ dx: -1, dy: 0 }, // влево
			{ dx: 0, dy: 1 }, // вниз
			{ dx: 1, dy: 0 }, // вправо
		]

		const direction = directions[Math.floor(Math.random() * directions.length)]
		Utils.moveObject(this, direction, player)
	}
}

export default Enemy
